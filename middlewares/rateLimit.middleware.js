import rateLimit from "express-rate-limit"

export const createShortUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "Terlalu banyak request, coba lagi nanti.",
  },
})

export const redirectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    message: "Terlalu banyak request, coba lagi nanti.",
  },
})
