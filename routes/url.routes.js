import express from "express"
import { createShortUrl, redirectToUrl, getUrlStats } from "../controllers/url.controller.js"
import { createShortUrlLimiter, redirectLimiter } from "../middlewares/rateLimit.middleware.js"

const router = express.Router()

router.post("/shorten", createShortUrlLimiter, createShortUrl)
router.get("/stats/:shortCode", getUrlStats)
router.get("/u/:shortCode", redirectLimiter, redirectToUrl)

export default router
