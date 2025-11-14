import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type SaveRequest = {
  mealId: string
  surah: string
  ayah: string
  data: {
    text: string
    subtext?: string | null
  }
}

type SaveResponse = {
  success?: boolean
  error?: string
}

/**
 * DEV ONLY: Save meal verse to JSON file
 * This endpoint is only available in development mode
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveResponse>,
) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Only available in development mode' })
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { mealId, surah, ayah, data } = req.body as SaveRequest

    // Validation
    if (!mealId || !surah || !ayah || !data) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // File path
    const filePath = path.join(
      process.cwd(),
      'src',
      'constants',
      'meal',
      `${mealId}.json`,
    )

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `Meal file not found: ${mealId}` })
    }

    // Read current file
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const meal = JSON.parse(fileContent)

    // Ensure surah exists
    if (!meal[surah]) {
      meal[surah] = {}
    }

    // Update verse
    meal[surah][ayah] = data

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(meal, null, 2), 'utf8')

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error saving meal:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
