import { NextRequest, NextResponse } from 'next/server'
import { searchByName, searchByRegistrationNumber } from '@/lib/services/search'
import type { APIResponse, SearchResult } from '@/types'

// Mark this route as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get('query')
        const type = searchParams.get('type') || 'name'
        const limit = parseInt(searchParams.get('limit') || '20')

        // Validate query parameter
        if (!query || query.trim().length === 0) {
            return NextResponse.json<APIResponse<SearchResult>>({
                success: false,
                error: 'Query parameter is required'
            }, { status: 400 })
        }

        // Validate type parameter
        if (type !== 'name' && type !== 'registrationNumber') {
            return NextResponse.json<APIResponse<SearchResult>>({
                success: false,
                error: 'Type must be either "name" or "registrationNumber"'
            }, { status: 400 })
        }

        let result: SearchResult

        // Perform search based on type
        if (type === 'registrationNumber') {
            result = await searchByRegistrationNumber(query.trim())
        } else {
            result = await searchByName(query.trim(), limit)
        }

        return NextResponse.json<APIResponse<SearchResult>>({
            success: true,
            data: result,
            message: `Found ${result.total} business(es)`
        })
    } catch (error) {
        console.error('Search API error:', error)
        return NextResponse.json<APIResponse<SearchResult>>({
            success: false,
            error: 'Failed to search businesses'
        }, { status: 500 })
    }
}
