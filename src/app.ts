import express from 'express'
import urlRouter from './routes/url.router'

const app = express()
app.use(express.json())

// Routes
app.use('/api', urlRouter)

// Global Error Handler (should be after routes)


export default app;