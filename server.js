import express from "express"
import { PORT } from "./config/index.js"
import urlRouter from "./routes/url.routes.js"

const app = express()

app.use(express.json())

app.use("/", urlRouter)

app.listen(PORT, () => {
  console.log(`server is running in http://localhost:${PORT}`)
})
