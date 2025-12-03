import { prisma } from '@/lib/prisma'
import type { Business } from '@/types'

/**
 * Verify a business
 * @param businessId - The business ID to verify
 * @param adminId - The admin ID performing the verification
 * @returns Updated business object
 */
export async function verifyBusiness(
    businessId: string,
    adminId: string
): Promise<Business> {
    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: {
                verified: true,
                verifiedAt: new Date(),
                verifiedBy: adminId
            }
        })

        return business
    } catch (error) {
        console.error('Error verifying business:', error)
        throw new Error('Failed to verify business')
    }
}

/**
 * Unverify a business
 * @param businessId - The business ID to unverify
 * @returns Updated business object
 */
export async function unverifyBusiness(businessId: string): Promise<Business> {
    try {
        const business = await prisma.business.update({
            where: { id: businessId },
            data: {
                verified: false,
                verifiedAt: null,
                verifiedBy: null
            }
        })

        return business
    } catch (error) {
        console.error('Error unverifying business:', error)
        throw new Error('Failed to unverify business')
    }
}

/**
 * Get verification status of a business
 * @param businessId - The business ID
 * @returns Verification details or null
 */
export async function getVerificationStatus(businessId: string): Promise<{
    verified: boolean
    verifiedAt: Date | null
    verifiedBy: string | null
} | null> {
    try {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: {
                verified: true,
                verifiedAt: true,
                verifiedBy: true
            }
        })

        return business
    } catch (error) {
        console.error('Error getting verification status:', error)
        throw new Error('Failed to get verification status')
    }
}

/**
 * Get all verified businesses
 * @param limit - Maximum number of results
 * @returns Array of verified businesses
 */
export async function getVerifiedBusinesses(limit?: number): Promise<Business[]> {
    try {
        const businesses = await prisma.business.findMany({
            where: { verified: true },
            orderBy: { verifiedAt: 'desc' },
            take: limit
        })

        return businesses
    } catch (error) {
        console.error('Error getting verified businesses:', error)
        throw new Error('Failed to get verified businesses')
    }
}

/**
 * Get all unverified businesses
 * @param limit - Maximum number of results
 * @returns Array of unverified businesses
 */
export async function getUnverifiedBusinesses(limit?: number): Promise<Business[]> {
    try {
        const businesses = await prisma.business.findMany({
            where: { verified: false },
            orderBy: { createdAt: 'desc' },
            take: limit
        })

        return businesses
    } catch (error) {
        console.error('Error getting unverified businesses:', error)
        throw new Error('Failed to get unverified businesses')
    }
}
