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