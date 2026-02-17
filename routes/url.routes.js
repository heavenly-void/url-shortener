import express from "express"
import { createShortUrl, redirectToUrl, getUrlStats } from "../controllers/url.controller.js"

const router = express.Router()

router.post("/shorten", createShortUrl)
router.get("/:shortCode", redirectToUrl)
router.get("/stats/:shortCode", getUrlStats)

export default router
