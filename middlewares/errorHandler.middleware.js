const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server"
  })
}

export default errorHandler
