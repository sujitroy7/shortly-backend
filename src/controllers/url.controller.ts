import { Request, Response } from "express";
import { pool } from "../config/db";
import { generateSlug } from "../utils/slug";


export async function createShortUrl(req: Request, res: Response) {
    let { user_id, slug, destination_url } = req.body;

    if (!user_id || !destination_url) {
        return res.status(400).json({ error: "User ID and destination URL are required" })
    }

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

    const query = `SELECT destination_url FROM urls WHERE slug = $1 LIMIT 1`
    const values = [slug]

    try {
        const result = await pool.query(query, values)

        if (result.rows.length === 0) return res.status(404).json({ error: "URL not found" })

        return res.status(302).redirect(result.rows[0].destination_url)
    } catch (error) {
        console.error("Error fetching destination URL:", error)
        return res.status(500).json({ error: "Failed to fetch destination URL" })
    }
}