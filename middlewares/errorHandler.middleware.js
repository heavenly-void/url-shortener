import path from "path"

const errorHandler = (err, req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return res
      .status(err.status || 500)
      .sendFile(path.join(import.meta.dirname, "../public/404.html"))
  }
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server"
  })
}

export default errorHandler
