import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { convertMealText } from '@/utils/mealConverter'
import pageContents from '@/constants/quran/pageContents.json'

type ConvertRequest = {
  mealId: string
  scope: 'page' | 'all'
  pageNumber?: number
  dryRun?: boolean // Preview mode
}

type ConvertResponse = {
  success?: boolean
  error?: string
  stats?: {
    totalVerses: number
    convertedVerses: number
    skippedVerses: number
  }
  preview?: Array<{
    surah: number
    ayah: number
    before: string
    after: string
  }>
}

/**
 * DEV ONLY: Bulk convert meal verses to markdown
 * This endpoint is only available in development mode
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConvertResponse>,
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
    const {
      mealId,
      scope,
      pageNumber,
      dryRun = false,
    } = req.body as ConvertRequest

    // Validation
    if (!mealId || !scope) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (scope === 'page' && !pageNumber) {
      return res
        .status(400)
        .json({ error: 'Page number required for page scope' })
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

    // Create backup before conversion (unless dry run)
    if (!dryRun) {
      const backupPath = filePath.replace('.json', `.backup-${Date.now()}.json`)
      fs.writeFileSync(backupPath, fileContent, 'utf8')
    }

    // Get verses to convert
    let versesToConvert: Array<[number, number]> = []

    if (scope === 'page' && pageNumber) {
      // Get verses from page
      const pageVersesRaw =
        (pageContents as Record<number, number[][]>)[pageNumber] || []
      versesToConvert = pageVersesRaw
        .filter(([, ayah]: number[]) => ayah !== 0) // Skip surah headers
        .map(([surah, ayah]: number[]) => [surah, ayah] as [number, number])
    } else if (scope === 'all') {
      // Get all verses from meal
      for (const surahKey in meal) {
        const surah = parseInt(surahKey)
        for (const ayahKey in meal[surahKey]) {
          const ayah = parseInt(ayahKey)
          versesToConvert.push([surah, ayah])
        }
      }
    }

    // Stats
    let totalVerses = versesToConvert.length
    let convertedVerses = 0
    let skippedVerses = 0
    const preview: Array<{
      surah: number
      ayah: number
      before: string
      after: string
    }> = []

    // Convert verses
    for (const [surah, ayah] of versesToConvert) {
      const verseData = meal[surah]?.[ayah]

      if (!verseData) {
        skippedVerses++
        continue
      }

      const beforeText = verseData.text || ''
      const beforeSubtext = verseData.subtext || ''

      const afterText = convertMealText(beforeText)
      const afterSubtext = beforeSubtext ? convertMealText(beforeSubtext) : ''

      // Check if anything changed
      if (beforeText === afterText && beforeSubtext === afterSubtext) {
        skippedVerses++
        continue
      }

      if (dryRun) {
        // Add to preview (limit to first 10)
        if (preview.length < 10) {
          preview.push({
            surah,
            ayah,
            before: beforeText,
            after: afterText,
          })
        }
      } else {
        // Update verse
        meal[surah][ayah] = {
          text: afterText,
          subtext: afterSubtext || null,
        }
      }

      convertedVerses++
    }

    // Write back to file (unless dry run)
    if (!dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(meal, null, 2), 'utf8')
    }

    return res.status(200).json({
      success: true,
      stats: {
        totalVerses,
        convertedVerses,
        skippedVerses,
      },
      preview: dryRun ? preview : undefined,
    })
  } catch (error) {
    console.error('Error converting meal:', error)
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    })
  }
}
