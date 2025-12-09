import { Request, Response } from "express";
import { pool } from "../config/db";
import { generateSlug } from "../utils/slug";
import { redis } from "../config/redis";
import { logClicks } from "../utils/logClick";
import { createShortUrlSchema } from "../schemas/url.schemas";

export async function createShortUrl(req: Request, res: Response) {
    const validation = createShortUrlSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ 
            error: "Validation failed", 
            details: validation.error.format() 
        });
    }

    let { user_id, slug, destination_url } = validation.data;

    if (!slug) {
        slug = generateSlug()
    }

    const query = `INSERT INTO urls (user_id, slug, destination_url) VALUES ($1, $2, $3) RETURNING *`
    const values = [user_id, slug, destination_url]

    try {
        const result = await pool.query(query, values);
        return res.status(201).json({ status: 'success', data: result.rows })
    } catch (error) {
        console.error("Error creating short URL:", error)
        return res.status(500).json({ error: "Failed to create short URL" })
    }
}


export async function handleRedirect(req: Request, res: Response) {
    const { slug } = req.params;
    const redisCacheKey = `url:${slug}`

    const cache = await redis.get(redisCacheKey)

    if (cache) {
        const [id, destination_url] = cache.split("|");

        if (id && destination_url) {
            logClicks({
                urlId: Number(id),
                ip: req.ip ?? null,
                userAgent: req.headers["user-agent"] || "",
                referer: req.headers["referer"] || null
            });
            return res.status(302).redirect(destination_url)
        }
        await redis.del(redisCacheKey);
    }

    const query = `SELECT id, destination_url FROM urls WHERE slug = $1 LIMIT 1`
    const values = [slug]

    try {
        const result = await pool.query(query, values)

        if (result.rows.length === 0) return res.status(404).json({ error: "URL not found" })

        logClicks({
            urlId: result.rows[0].id,
            ip: req.ip ?? null,
            userAgent: req.headers["user-agent"] || "",
            referer: req.headers["referer"] || null
        });

        const { id, destination_url } = result.rows[0]


        await redis.set(redisCacheKey, `${id}|${destination_url}`, { EX: 60 * 60 * 24 }) // 24 TTL

        return res.status(302).redirect(destination_url)
    } catch (error) {
        console.error("Error fetching destination URL:", error)
        return res.status(500).json({ error: "Failed to fetch destination URL" })
    }
}