import { NextRequest, NextResponse } from 'next/server'
import { getBusinessById } from '@/lib/services/search'
import type { APIResponse, Business } from '@/types'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Validate business ID
        if (!id || id.trim().length === 0) {
            return NextResponse.json<APIResponse<Business>>({
                success: false,
                error: 'Business ID is required'
            }, { status: 400 })
        }

        // Get business by ID
        const business = await getBusinessById(id)

        if (!business) {
            return NextResponse.json<APIResponse<Business>>({
                success: false,
                error: 'Business not found'
            }, { status: 404 })
        }

        return NextResponse.json<APIResponse<Business>>({
            success: true,
            data: business,
            message: 'Business retrieved successfully'
        })
    } catch (error) {
        console.error('Get business API error:', error)
        return NextResponse.json<APIResponse<Business>>({
            success: false,
            error: 'Failed to retrieve business'
        }, { status: 500 })
    }
}
