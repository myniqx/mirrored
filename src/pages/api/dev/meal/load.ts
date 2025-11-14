import type { NextApiRequest, NextApiResponse } from 'next'

type LoadResponse = {
  text: string
  subtext?: string | null
} | {
  error?: string
}

/**
 * DEV ONLY: Load specific verse from meal
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoadResponse>,
) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Only available in development mode' })
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { mealId, surah, ayah } = req.query

    if (!mealId || !surah || !ayah) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Dynamic import
    const meal = await import(`@/constants/meal/${mealId}.json`)

    const verse = meal.default[surah as string]?.[ayah as string]

    if (!verse) {
      return res.status(404).json({ error: 'Verse not found' })
    }

    return res.status(200).json(verse)
  } catch (error) {
    console.error('Error loading meal:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
