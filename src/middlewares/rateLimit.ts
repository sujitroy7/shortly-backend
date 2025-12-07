import { Request, Response, NextFunction } from "express";
import { redis } from "../config/redis";

export async function rateLimit(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;

    const key = `rate:${ip}`;
    const limit = 100; // max requests
    const windowSeconds = 900; // 15 Mins

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, windowSeconds);
    }

    if (current > limit) {
        return res.status(429).json({ error: "Rate Limit exceeded" });
    }

    next();

}