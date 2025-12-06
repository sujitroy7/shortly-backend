import express from 'express'

const app = express()

app.use(express.json())


// Routes

// Global Error Handler (should be after routes)


export default app;