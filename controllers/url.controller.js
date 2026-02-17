import { v4 as uuidv4 } from "uuid"
import validUrl from "valid-url"
import { readUrls, writeUrls } from "../utils/fs.js"
import { BASE_URL } from "../config/index.js"

export const createShortUrl = async (req, res) => {
  try {
    const { url, customAlias } = req.body
    const urls = await readUrls()

    if (!validUrl.isUri(url)) {
      return res.status(400).json({
        message: "URL tidak valid"
      })
    }

    let shortCode

    if (customAlias) {
      const regex = /^[a-z0-9-]{3,20}$/
      const isValid = regex.test(customAlias)
      const isUsed = urls.find(u => u.shortCode === customAlias)

      if (!isValid) {
        return res.status(400).json({
          message: "Format alias tidak valid (3-20 karakter, huruf kecil, angka, dash)"
        })
      }

      if (isUsed) {
        return res.status(400).json({
          message: `Alias ${customAlias} sudah terpakai`
        })
      }

      shortCode = customAlias
    } else {
      do {
        shortCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      } while (urls.find(u => u.shortCode === shortCode))
    }

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
      message: "Terjadi kesalahan pada server"
    })
  }
}

export const redirectToUrl = async (req, res) => {
  try {
    const shortCode = req.params.shortCode
    const urls = await readUrls()

    const urlIndex = urls.findIndex(u => u.shortCode === shortCode)

    if (urlIndex === -1) {
      return res.status(404).json({
        message: "shortCode tidak ditemukan"
      })
    }

    urls[urlIndex].clicks++
    urls[urlIndex].lastAccessed = new Date().toISOString()

    await writeUrls(urls)

    return res.redirect(urls[urlIndex].originalUrl)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Terjadi kesalahan pada server"
    })
  }
}
