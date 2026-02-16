import { v4 as uuidv4 } from "uuid"
import validUrl from "valid-url"
import { readUrls, writeUrls } from "../utils/fs.js"
import { BASE_URL } from "../config/index.js"

export const createShortUrl = async (req, res) => {
  try {
    const { url } = req.body
    const urls = await readUrls()

    if (!validUrl.isUri(url)) {
      return res.status(400).json({
        message: "URL tidak valid"
      })
    }

    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newShortUrl = {
      id: uuidv4(),
      shortCode,
      originalUrl: url,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastAccessed: null
    }
    urls.push(newShortUrl)
    await writeUrls(urls)

    return res.status(201).json({
      message: "Berhasil membuat short url",
      data: {
        shortUrl: `${BASE_URL}/${shortCode}`,
        shortCode,
        originalUrl: url
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      messsage: "Terjadi kesalahan pada server"
    })
  }
}
