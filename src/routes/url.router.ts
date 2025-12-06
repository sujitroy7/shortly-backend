import { Router } from "express";
import { createShortUrl, handleRedirect } from "../controllers/url.controller";

const router = Router()
router.post('/shorten', createShortUrl)
router.get('/:slug', handleRedirect)

export default router;