import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyBusiness, unverifyBusiness } from '@/lib/services/verification'
import type { APIResponse, VerificationResponse } from '@/types'

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json<APIResponse<VerificationResponse>>({
                success: false,
                error: 'Unauthorized. Admin authentication required.'
            }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const { businessId, verified } = body

        // Validate request
        if (!businessId || typeof verified !== 'boolean') {
            return NextResponse.json<APIResponse<VerificationResponse>>({
                success: false,
                error: 'Business ID and verified status are required'
            }, { status: 400 })
        }

        // Perform verification or unverification
        const business = verified
            ? await verifyBusiness(businessId, user.id)
            : await unverifyBusiness(businessId)

        return NextResponse.json<APIResponse<VerificationResponse>>({
            success: true,
            data: {
                success: true,
                business
            },
            message: `Business ${verified ? 'verified' : 'unverified'} successfully`
        })
    } catch (error) {
        console.error('Verification API error:', error)
        return NextResponse.json<APIResponse<VerificationResponse>>({
            success: false,
            error: 'Failed to update verification status'
        }, { status: 500 })
    }
}
