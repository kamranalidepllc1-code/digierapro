import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3001
const PLACE_ID = 'ChIJR554DQxlMIgRXZ4vHjbBSPU'  // Digi Era Pro LLC

app.use(cors())

app.get('/api/reviews', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' })

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status !== 'OK') {
      return res.status(400).json({ error: data.status, message: data.error_message })
    }

    const { name, rating, user_ratings_total, reviews } = data.result
    res.json({ name, rating, user_ratings_total, reviews: reviews || [] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' })
  }
})

app.listen(PORT, () => console.log(`Reviews server running on http://localhost:${PORT}`))
