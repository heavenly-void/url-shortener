import fs from "fs/promises"
import path from "path"

const dataDir = path.join(import.meta.dirname, "../data")

const urlPath = path.join(dataDir, "urls.json")

async function readJSON(filePath) {
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data)
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function readUrls() {
  return await readJSON(urlPath)
}

export async function writeUrls(urls) {
  return await writeJSON(urlPath, urls)
}
