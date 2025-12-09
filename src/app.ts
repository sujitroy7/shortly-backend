import express from 'express'
import cors from 'cors'
import urlRouter from './routes/url.router'
import "./config/redis"
import config from './config/config'

const app = express()
app.use(express.json())
app.use(cors({
    origin: config.corsOrigin
}))

// Routes
app.use('/api', urlRouter)

// Global Error Handler (should be after routes)


export default app;