import { v4 as uuidv4 } from "uuid"
import validUrl from "valid-url"
import { readUrls, writeUrls } from "../utils/fs.js"
import { BASE_URL } from "../config/index.js"

export const createShortUrl = async (req, res, next) => {
  try {
    let { url, customAlias } = req.body

    if (!url || typeof url !== "string") {
      const error = new Error("URL wajib diisi")
      error.status = 400
      return next(error)
    }

    const urls = await readUrls()

    url = url.trim()

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`
    }

    if (!validUrl.isWebUri(url)) {
      const error = new Error("URL tidak valid")
      error.status = 400
      return next(error)
    }

    let shortCode

    if (customAlias) {
      customAlias = customAlias.toLowerCase()

      const regex = /^[a-z0-9-]{3,20}$/
      const isValid = regex.test(customAlias)
      const isUsed = urls.find((u) => u.shortCode.toLowerCase() === customAlias)

      if (!isValid) {
        const error = new Error("Format alias tidak valid (3-20 karakter, huruf kecil, angka, dash)")
        error.status = 400
        return next(error)
      }

      if (isUsed) {
        const error = new Error(`Alias ${customAlias} sudah terpakai`)
        error.status = 400
        return next(error)
      }

      shortCode = customAlias
    } else {
      do {
        shortCode = Math.random().toString(36).substring(2, 8).toLowerCase()
      } while (
        urls.find((u) => u.shortCode.toLowerCase() === shortCode)
      )
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
    return next(error);
  }
}

export const redirectToUrl = async (req, res, next) => {
  try {
    const shortCode = req.params.shortCode?.toLowerCase();

    if (!shortCode) {
      const error = new Error("Short code tidak valid");
      error.status = 400;
      return next(error);
    }

    const urls = await readUrls();
    const urlIndex = urls.findIndex((u) => u.shortCode.toLowerCase() === shortCode);

    if (urlIndex === -1) {
      const error = new Error("Short code tidak ditemukan");
      error.status = 404;
      return next(error);
    }

    urls[urlIndex].clicks += 1;
    urls[urlIndex].lastAccessed = new Date().toISOString();

    await writeUrls(urls);

    return res.redirect(urls[urlIndex].originalUrl);

  } catch (error) {
    return next(error);
  }
};
