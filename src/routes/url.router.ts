import { Router } from "express";
import { createShortUrl, handleRedirect } from "../controllers/url.controller";
import { rateLimit } from "../middlewares/rateLimit";

const router = Router()
router.post('/shorten', rateLimit, createShortUrl)
router.get('/:slug', handleRedirect)

export default router;