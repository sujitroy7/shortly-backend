import { pool } from "../config/db";

interface LogClicks {
    urlId: number;
    ip: string | null;
    userAgent: string | null;
    referer: string | null
}

export async function logClicks({ urlId, ip, userAgent, referer }: LogClicks) {
    const query = `INSERT INTO clicks (url_id, ip_address, user_agent, referer) VALUES ($1, $2, $3, $4)`
    const values = [urlId, ip, userAgent, referer]

    pool.query(query, values).catch((e) => { })

}