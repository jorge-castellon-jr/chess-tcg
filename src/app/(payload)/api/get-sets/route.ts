import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getSetFolders } from '@/utils/endpoints'

/**
 * GET /api/get-sets
 * Returns a list of folder names in the exports directory
 */
export async function GET(_request: NextRequest) {
  try {
    // Resolve the exports path relative to the project root
    const exportsPath = path.resolve(process.cwd(), 'exports')
    
    const result = await getSetFolders(exportsPath)
    
    if (result.success) {
      return NextResponse.json({ 
        sets: result.folders,
        count: result.folders.length 
      }, { status: 200 })
    } else {
      console.error('Error fetching sets:', result.details)
      return NextResponse.json(
        { 
          error: result.error,
          details: result.details 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error in get-sets endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Optional: Add OPTIONS handler for CORS if needed
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
