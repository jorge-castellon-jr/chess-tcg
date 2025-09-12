import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'
import { importCardsFromSet } from '@/utils/endpoints'

// Get the current directory for path resolution
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * POST /api/import-cards
 * Imports cards from CSV files in a specified set directory
 */
export async function POST(request: NextRequest) {
  try {
    // Only allow in development mode for safety
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 404 }
      )
    }

    // Parse request body
    const body = await request.json()
    
    if (!body.setName || typeof body.setName !== 'string') {
      return NextResponse.json(
        { error: 'setName is required and must be a string' },
        { status: 400 }
      )
    }

    const { setName } = body

    // Get payload instance
    const payload = await getPayload({ config })

    // Resolve paths
    const exportsPath = path.resolve(process.cwd(), 'exports')
    const logsPath = path.resolve(process.cwd(), 'logs')

    console.log(`Starting import for set: ${setName}`)
    console.log(`Exports path: ${exportsPath}`)
    console.log(`Logs path: ${logsPath}`)

    // Import cards using the utility function
    const result = await importCardsFromSet(
      payload,
      setName,
      exportsPath,
      logsPath
    )

    if (result.success) {
      console.log(`Successfully imported set: ${setName}`, result.stats)
      return NextResponse.json({
        success: true,
        message: result.message,
        stats: result.stats
      }, { status: 200 })
    } else {
      console.error('Error importing set:', result.details)
      return NextResponse.json(
        { 
          success: false,
          error: result.error,
          details: result.details
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Unexpected error in import-cards endpoint:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Disable body size limit for CSV imports (optional)
export const runtime = 'nodejs'
export const maxDuration = 300 // 5 minutes for large imports
