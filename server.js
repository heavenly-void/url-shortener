import express from "express"
import path from "path"
import { PORT } from "./config/index.js"
import urlRouter from "./routes/url.routes.js"
import errorHandler from "./middlewares/errorHandler.middleware.js"

const app = express()

const dataDir = path.join(import.meta.dirname, "../data")

app.use(express.json())
app.use(express.static(path.join(import.meta.dirname, "public")))

app.use("/", urlRouter)
app.use((req, res) => {
  res.status(404).sendFile(path.join(import.meta.dirname, 'public', '404.html'));
});
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server is running in http://localhost:${PORT}`)
})
