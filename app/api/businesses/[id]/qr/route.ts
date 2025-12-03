import { NextRequest, NextResponse } from 'next/server'
import { generateQRCodeBuffer, canGenerateQRCode } from '@/lib/services/qr'
import { getBusinessById } from '@/lib/services/search'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const searchParams = request.nextUrl.searchParams
        const width = parseInt(searchParams.get('width') || '300')

        // Validate business ID
        if (!id || !canGenerateQRCode(id)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid business ID'
            }, { status: 400 })
        }

        // Check if business exists
        const business = await getBusinessById(id)
        if (!business) {
            return NextResponse.json({
                success: false,
                error: 'Business not found'
            }, { status: 404 })
        }

        // Generate QR code
        const qrCodeBuffer = await generateQRCodeBuffer(id, width)

        // Return as PNG image
        return new NextResponse(new Uint8Array(qrCodeBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
                'Content-Disposition': `inline; filename="${business.name}-qr.png"`
            }
        })
    } catch (error) {
        console.error('QR code generation API error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to generate QR code'
        }, { status: 500 })
    }
}
