import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { SYSTEM_PROMPT } from './prompt'

dotenv.config()

const glm = createOpenAI({
    baseURL: process.env.AI_BASE_URL,
    apiKey: process.env.AI_API_KEY,
})

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt required' })
        }

        const model = process.env.AI_MODEL || 'glm-5'

        const result = streamText({
            model: glm.chat(model),
            system: SYSTEM_PROMPT,
            prompt,
            temperature: 0.6,
        })

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        for await (const chunk of result.textStream) {
            res.write(chunk)
        }

        res.end()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Server error' })
    }
})

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`[backend] Server running at http://localhost:${port}`)
})
