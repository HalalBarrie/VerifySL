import QRCode from 'qrcode'
import type { QRCodeOptions } from '@/types'

/**
 * Generate QR code for a business profile
 * @param businessId - The business ID
 * @param options - QR code generation options
 * @returns QR code as data URL or SVG string
 */
export async function generateQRCode(
    businessId: string,
    options: QRCodeOptions = {}
): Promise<string> {
    try {
        const profileUrl = getProfileUrl(businessId)
        const { width = 300, height = 300, format = 'png' } = options

        if (format === 'svg') {
            return await QRCode.toString(profileUrl, {
                type: 'svg',
                width,
                errorCorrectionLevel: 'M'
            })
        }

        // Return as data URL for PNG
        return await QRCode.toDataURL(profileUrl, {
            width,
            height,
            errorCorrectionLevel: 'M',
            margin: 2
        })
    } catch (error) {
        console.error('Error generating QR code:', error)
        throw new Error('Failed to generate QR code')
    }
}

/**
 * Generate QR code as buffer (for API responses)
 * @param businessId - The business ID
 * @param width - QR code width
 * @returns Buffer containing PNG image
 */
export async function generateQRCodeBuffer(
    businessId: string,
    width: number = 300
): Promise<Buffer> {
    try {
        const profileUrl = getProfileUrl(businessId)

        return await QRCode.toBuffer(profileUrl, {
            width,
            errorCorrectionLevel: 'M',
            margin: 2
        })
    } catch (error) {
        console.error('Error generating QR code buffer:', error)
        throw new Error('Failed to generate QR code buffer')
    }
}

/**
 * Get the public profile URL for a business
 * @param businessId - The business ID
 * @returns Full profile URL
 */
export function getProfileUrl(businessId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/business/${businessId}`
}

/**
 * Validate if a QR code can be generated
 * @param businessId - The business ID to check
 * @returns Boolean indicating if QR code generation is valid
 */
export function canGenerateQRCode(businessId: string): boolean {
    return businessId.length > 0 && /^[a-f0-9-]{36}$/.test(businessId)
}
