import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { Payload } from 'payload'
import { Keyword } from '@/payload-types'

/**
 * CSV row structure from parsed CSV files
 */
interface CsvRow {
  Name: string
  Effect?: string
  Class?: 'Neutral' | 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades'
  Type?: 'Piece' | 'Tactic'
  PieceType?: 'Basic' | 'Queen' | 'King'
  Cost?: string | number
  ATK?: string | number
  DEF?: string | number
  Material?: string | number
  CustomLimit?: string | boolean
  Limit?: '1' | '2' | '3'
  [key: string]: unknown // Allow additional CSV columns
}

/**
 * Card data structure for creating cards in Payload
 */
interface CardData {
  name: string
  set: number
  effect?: string
  keywords?: number[]
  class: 'Neutral' | 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades'
  type: 'Piece' | 'Tactic'
  pieceType?: 'Basic' | 'Queen' | 'King'
  customLimit?: boolean
  limit?: '1' | '2' | '3'
  Cost?: number | null
  ATK?: number | null
  DEF?: number | null
  Material?: number | null
}

/**
 * Result of processing a single card row
 */
interface ProcessCardResult {
  success: boolean
  reason?: string
  skipped?: boolean
}

/**
 * Determine card class based on name
 */
function determineCardClass(
  name: string
): 'Neutral' | 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades' {
  const lowerName = name.toLowerCase()

  // Check for suit indicators in the name
  if (lowerName.includes('heart')) return 'Hearts'
  if (lowerName.includes('diamond')) return 'Diamonds'
  if (lowerName.includes('club')) return 'Clubs'
  if (lowerName.includes('spade')) return 'Spades'

  // Default to Neutral if no suit found
  return 'Neutral'
}

/**
 * Determine piece type based on card name
 */
function determinePieceType(name: string): 'Basic' | 'Queen' | 'King' | null {
  const lowerName = name.toLowerCase()

  if (lowerName.includes('queen')) return 'Queen'
  if (lowerName.includes('king')) return 'King'

  // Default to Basic for piece cards, null will be handled by caller
  return 'Basic'
}

/**
 * Find matching keywords in effect text
 */
async function findMatchingKeywords(
  payload: Payload,
  effectText: string | null
): Promise<number[]> {
  if (!effectText) return []

  try {
    // Get all keywords from the database
    const keywordsResult = await payload.find({
      collection: 'keywords',
      limit: 1000, // Get all keywords
      pagination: false,
    })

    const matchingKeywordIds: number[] = []
    const lowerEffectText = effectText.toLowerCase()

    // Check each keyword to see if it appears in the effect text
    for (const keyword of keywordsResult.docs) {
      const keywordName = keyword.name.toLowerCase()
      if (lowerEffectText.includes(keywordName)) {
        matchingKeywordIds.push(keyword.id)
      }
    }

    return matchingKeywordIds
  } catch (error) {
    console.error('Error finding matching keywords:', error)
    return []
  }
}

/**
 * Get list of folder names in the exports directory
 */
export async function getSetFolders(exportsPath: string) {
  try {
    const items = await fs.promises.readdir(exportsPath, {
      withFileTypes: true,
    })
    const folders = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
    return { success: true, folders: folders || [] }
  } catch (error) {
    console.error('Error reading exports directory:', error)
    return {
      success: false,
      error: 'Could not read exports directory',
      details: error instanceof Error ? error.message : String(error),
      folders: [],
    }
  }
}

/**
 * Process a single CSV row and create a card
 */
async function processCardRow(
  payload: Payload,
  row: CsvRow,
  setId: number,
  logPath: string
): Promise<ProcessCardResult> {
  console.log('processCardRow', row.Name)
  try {
    // Check if card already exists
    const cardExists = await payload.find({
      collection: 'cards',
      where: { name: { equals: row.Name } },
    })

    if (cardExists.docs.length > 0) {
      const errorMessage = `Card "${row.Name}" already exists. Skipping.\n`
      await fs.promises.appendFile(logPath, errorMessage)
      return { success: false, reason: 'Card already exists', skipped: true }
    }

    // Map CSV columns to card fields
    const cardData: CardData = {
      name: row.Name,
      set: setId,
      class: 'Neutral', // Will be overridden below
      type: 'Piece', // Will be overridden below
    }

    // Add optional fields if they exist in the CSV
    if (row.Effect) cardData.effect = row.Effect

    // Determine class - use CSV value if present, otherwise auto-detect from name
    if (row.Class) {
      cardData.class = row.Class
    } else {
      cardData.class = determineCardClass(row.Name)
    }

    if (row.Type) cardData.type = row.Type

    // Determine piece type - use CSV value if present, otherwise auto-detect from name
    if (row.PieceType) {
      cardData.pieceType = row.PieceType
    } else if (cardData.type === 'Piece') {
      cardData.pieceType = determinePieceType(row.Name)
    }

    if (row.Cost !== undefined && row.Cost !== '')
      cardData.Cost = parseInt(row.Cost) || null
    if (row.ATK !== undefined && row.ATK !== '')
      cardData.ATK = parseInt(row.ATK) || null
    if (row.DEF !== undefined && row.DEF !== '')
      cardData.DEF = parseInt(row.DEF) || null
    if (row.Material !== undefined && row.Material !== '')
      cardData.Material = parseInt(row.Material) || null
    if (row.CustomLimit)
      cardData.customLimit =
        row.CustomLimit === 'true' || row.CustomLimit === '1'
    if (row.Limit) cardData.limit = row.Limit

    // Find and add matching keywords based on effect text
    const matchingKeywords = await findMatchingKeywords(
      payload,
      cardData.effect
    )
    if (matchingKeywords.length > 0) {
      cardData.keywords = matchingKeywords
    }
    if (row.Material !== undefined && row.Material !== '')
      cardData.Material = parseInt(row.Material) || null
    if (row.CustomLimit)
      cardData.customLimit =
        row.CustomLimit === 'true' || row.CustomLimit === '1'
    if (row.Limit) cardData.limit = row.Limit

    await payload.create({
      collection: 'cards',
      data: cardData,
    })

    return { success: true }
  } catch (error) {
    const errorMessage = `Error processing card "${row.Name}": ${error instanceof Error ? error.message : String(error)}\n`
    await fs.promises.appendFile(logPath, errorMessage)
    return {
      success: false,
      reason: error instanceof Error ? error.message : String(error),
      skipped: false,
    }
  }
}

/**
 * Process a CSV file and import all cards
 */
async function processCsvFile(
  payload: Payload,
  filePath: string,
  setId: number,
  logPath: string
): Promise<{ processed: number; errors: number; skipped: number }> {
  return new Promise((resolve, reject) => {
    const results = { processed: 0, errors: 0, skipped: 0 }
    const records: CsvRow[] = []

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (record) => {
        records.push(record)
      })
      .on('end', async () => {
        try {
          // Process records sequentially to avoid overwhelming the database
          for (const record of records) {
            const result = await processCardRow(payload, record, setId, logPath)
            if (result.success) {
              results.processed++
            } else if (result.skipped) {
              results.skipped++
            } else {
              results.errors++
            }
          }
          resolve(results)
        } catch (error) {
          reject(error)
        }
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

/**
 * Import cards from CSV files in a set directory
 */
export async function importCardsFromSet(
  payload: Payload,
  setName: string,
  exportsPath: string,
  logsPath: string
) {
  const setPath = path.join(exportsPath, setName)
  const logPath = path.join(logsPath, 'migration-errors.log')

  try {
    // Ensure logs directory exists
    await fs.promises.mkdir(path.dirname(logPath), { recursive: true })

    // Find or create the set
    const existingSet = await payload.find({
      collection: 'sets',
      where: { name: { equals: setName } },
    })

    let setId: number

    if (existingSet.docs.length > 0) {
      setId = existingSet.docs[0].id
    } else {
      const newSet = await payload.create({
        collection: 'sets',
        data: { name: setName, releaseDate: new Date().toISOString() },
      })
      setId = newSet.id
    }

    // Get all CSV files in the set directory
    const items = await fs.promises.readdir(setPath)
    const csvFiles = items.filter((file) => file.endsWith('.csv'))

    if (csvFiles.length === 0) {
      return {
        success: false,
        error: `No CSV files found in ${setName} directory`,
      }
    }

    let totalProcessed = 0
    let totalErrors = 0
    let totalSkipped = 0

    // Process each CSV file
    for (const csvFile of csvFiles) {
      const filePath = path.join(setPath, csvFile)
      const results = await processCsvFile(payload, filePath, setId, logPath)

      totalProcessed += results.processed
      totalErrors += results.errors
      totalSkipped += results.skipped

      // Log progress for this file
      const logMessage = `File ${csvFile}: ${results.processed} processed, ${results.errors} errors, ${results.skipped} skipped\n`
      await fs.promises.appendFile(logPath, logMessage)
    }

    return {
      success: true,
      message: `Import completed for set "${setName}"`,
      stats: {
        filesProcessed: csvFiles.length,
        cardsProcessed: totalProcessed,
        errors: totalErrors,
        skipped: totalSkipped,
      },
    }
  } catch (error) {
    const errorMessage = `Error importing set "${setName}": ${error instanceof Error ? error.message : String(error)}\n`
    await fs.promises.appendFile(logPath, errorMessage)

    return {
      success: false,
      error: `Error importing set "${setName}"`,
      details: error instanceof Error ? error.message : String(error),
    }
  }
}
