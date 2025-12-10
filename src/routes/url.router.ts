import { Router } from "express";
import { createShortUrl, handleRedirect, checkSlugAvailability, getRecentLinks } from "../controllers/url.controller";
import { rateLimit } from "../middlewares/rateLimit";

const router = Router()
router.post('/shorten', rateLimit, createShortUrl)
router.get('/check/:slug', checkSlugAvailability)
router.get('/recent', getRecentLinks)
router.get('/:slug', handleRedirect)

export default router;