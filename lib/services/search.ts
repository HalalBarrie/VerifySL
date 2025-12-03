import { prisma } from '@/lib/prisma'
import type { Business, SearchResult } from '@/types'

/**
 * Search for businesses by name (fuzzy match)
 * @param query - The search query
 * @param limit - Maximum number of results (default: 20)
 * @returns SearchResult with businesses and suggestions
 */
export async function searchByName(
    query: string,
    limit: number = 20
): Promise<SearchResult> {
    try {
        // Fuzzy search using case-insensitive contains
        const businesses = await prisma.business.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: limit,
            orderBy: [
                { verified: 'desc' }, // Verified businesses first
                { name: 'asc' }
            ]
        })

        // Get suggestions if results are limited
        const suggestions = await getSuggestions(query, businesses.length < 5)

        return {
            businesses,
            total: businesses.length,
            suggestions
        }
    } catch (error) {
        console.error('Error searching by name:', error)
        throw new Error('Failed to search businesses by name')
    }
}

/**
 * Search for a business by registration number (exact match)
 * @param registrationNumber - The registration number to search for
 * @returns SearchResult with matching business
 */
export async function searchByRegistrationNumber(
    registrationNumber: string
): Promise<SearchResult> {
    try {
        const business = await prisma.business.findUnique({
            where: {
                registrationNumber: registrationNumber.toUpperCase()
            }
        })

        return {
            businesses: business ? [business] : [],
            total: business ? 1 : 0,
            suggestions: []
        }
    } catch (error) {
        console.error('Error searching by registration number:', error)
        throw new Error('Failed to search business by registration number')
    }
}

/**
 * Get search suggestions for alternative queries
 * @param query - The original search query
 * @param shouldFetch - Whether to fetch suggestions
 * @returns Array of suggested business names
 */
async function getSuggestions(
    query: string,
    shouldFetch: boolean
): Promise<string[]> {
    if (!shouldFetch || query.length < 3) {
        return []
    }

    try {
        // Get similar businesses by partial name match
        const suggestions = await prisma.business.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query.substring(0, 3),
                            mode: 'insensitive'
                        }
                    },
                    {
                        businessType: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            select: {
                name: true
            },
            take: 5,
            distinct: ['name']
        })

        return suggestions.map(s => s.name)
    } catch (error) {
        console.error('Error getting suggestions:', error)
        return []
    }
}

/**
 * Get a business by ID
 * @param id - The business ID
 * @returns Business object or null
 */
export async function getBusinessById(id: string): Promise<Business | null> {
    try {
        const business = await prisma.business.findUnique({
            where: { id }
        })

        return business
    } catch (error) {
        console.error('Error getting business by ID:', error)
        throw new Error('Failed to get business')
    }
}

/**
 * Get all businesses with pagination
 * @param page - Page number (1-indexed)
 * @param limit - Results per page
 * @returns Array of businesses and total count
 */
export async function getAllBusinesses(
    page: number = 1,
    limit: number = 20
): Promise<{ businesses: Business[], total: number }> {
    try {
        const skip = (page - 1) * limit

        const [businesses, total] = await Promise.all([
            prisma.business.findMany({
                skip,
                take: limit,
                orderBy: [
                    { verified: 'desc' },
                    { updatedAt: 'desc' }
                ]
            }),
            prisma.business.count()
        ])

        return { businesses, total }
    } catch (error) {
        console.error('Error getting all businesses:', error)
        throw new Error('Failed to get businesses')
    }
}
