import { Request, Response } from "express";
import { pool } from "../config/db";
import { generateSlug } from "../utils/slug";
import { redis } from "../config/redis";
import { logClicks } from "../utils/logClick";
import { createShortUrlSchema } from "../schemas/url.schemas";
import { isSocialMediaBot } from "../utils/botDetector";
import { fetchOgMetadata, generateOgHtml } from "../utils/ogFetcher";

export async function createShortUrl(req: Request, res: Response) {
  const validation = createShortUrlSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: validation.error.format(),
    });
  }
  let { slug, destination_url } = validation.data;

  try {
    const query = `INSERT INTO urls (user_id, destination_url) VALUES ($1, $2) RETURNING *`;
    const user_id = 1;
    const values = [user_id, destination_url];
    const result = await pool.query(query, values);

    if (!slug) {
      slug = generateSlug(result.rows[0].id);
    }

    const updateQuery = `UPDATE urls SET slug = $1 WHERE id = $2 RETURNING *`;
    const updateValues = [slug, result.rows[0].id];
    const updateResult = await pool.query(updateQuery, updateValues);

    return res.status(201).json({ status: "success", data: updateResult.rows });
  } catch (error) {
    console.error("Error creating short URL:", error);
    return res.status(500).json({ error: "Failed to create short URL" });
  }
}

export async function handleRedirect(req: Request, res: Response) {
  const { slug } = req.params;
  const redisCacheKey = `url:${slug}`;
  const userAgent = req.headers["user-agent"];
  const isBot = isSocialMediaBot(userAgent);

  // Helper function to handle the response based on whether it's a bot or human
  const sendResponse = async (destination_url: string) => {
    if (isBot) {
      // For social media bots, fetch OG metadata and serve HTML
      const metadata = await fetchOgMetadata(destination_url);
      const html = generateOgHtml(metadata, destination_url);
      return res.status(200).type("html").send(html);
    }
    // For humans, do fast 302 redirect
    return res.status(302).redirect(destination_url);
  };

  const cache = await redis.get(redisCacheKey);

  if (cache) {
    const [id, destination_url] = cache.split("|");

    if (id && destination_url) {
      logClicks({
        urlId: Number(id),
        ip: req.ip ?? null,
        userAgent: userAgent || "",
        referer: req.headers["referer"] || null,
      });
      return sendResponse(destination_url);
    }
    await redis.del(redisCacheKey);
  }

  const query = `SELECT id, destination_url FROM urls WHERE slug = $1 LIMIT 1`;
  const values = [slug];

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0)
      return res.status(404).json({ error: "URL not found" });

    logClicks({
      urlId: result.rows[0].id,
      ip: req.ip ?? null,
      userAgent: userAgent || "",
      referer: req.headers["referer"] || null,
    });

    const { id, destination_url } = result.rows[0];

    await redis.set(redisCacheKey, `${id}|${destination_url}`, {
      EX: 60 * 60 * 24,
    }); // 24 TTL

    return sendResponse(destination_url);
  } catch (error) {
    console.error("Error fetching destination URL:", error);
    return res.status(500).json({ error: "Failed to fetch destination URL" });
  }
}

export async function checkSlugAvailability(req: Request, res: Response) {
  const { slug } = req.params;

  if (!slug || slug.trim() === "") {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const query = `SELECT id FROM urls WHERE slug = $1 LIMIT 1`;
    const values = [slug];
    const result = await pool.query(query, values);

    const isAvailable = result.rows.length === 0;

    return res.status(200).json({
      slug,
      available: isAvailable,
    });
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return res.status(500).json({ error: "Failed to check slug availability" });
  }
}

export async function getRecentLinks(req: Request, res: Response) {
  const userId = 1;

  // Parse and validate limit query parameter (default: 10, max: 100)
  const requestedLimit = parseInt(req.query.limit as string, 10);
  const limit = isNaN(requestedLimit)
    ? 10
    : Math.min(Math.max(requestedLimit, 1), 100);

  try {
    const query = `
      SELECT 
        u.id,
        u.slug,
        u.destination_url,
        u.created_at,
        COUNT(c.id)::int AS click_count
      FROM urls u
      LEFT JOIN clicks c ON u.id = c.url_id
      WHERE u.user_id = $1
      GROUP BY u.id, u.slug, u.destination_url, u.created_at
      ORDER BY u.created_at DESC
      LIMIT $2
    `;
    const values = [userId, limit];
    const result = await pool.query(query, values);

    return res.status(200).json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching recent links:", error);
    return res.status(500).json({ error: "Failed to fetch recent links" });
  }
}
