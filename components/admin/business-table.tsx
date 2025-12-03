'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import type { Business } from '@/types'

interface BusinessTableProps {
    businesses: Business[]
    adminId: string
    showVerified?: boolean
}

export function BusinessTable({ businesses, adminId, showVerified = false }: BusinessTableProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [localBusinesses, setLocalBusinesses] = useState(businesses)

    const handleVerify = async (businessId: string, verified: boolean) => {
        setLoadingId(businessId)

        try {
            const response = await fetch('/api/admin/businesses/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessId, verified })
            })

            if (!response.ok) {
                throw new Error('Verification failed')
            }

            const data = await response.json()

            // Update local state
            setLocalBusinesses(prev =>
                prev.map(b => b.id === businessId ? data.data.business : b)
            )

            // Show success message
            alert(`Business ${verified ? 'verified' : 'unverified'} successfully`)
        } catch (error) {
            console.error('Verification error:', error)
            alert('Failed to update verification status')
        } finally {
            setLoadingId(null)
        }
    }

    if (localBusinesses.length === 0) {
        return (
            <div className="border shadow-sm rounded-lg p-4">
                <p className="text-muted-foreground text-center py-10">
                    No businesses to display
                </p>
            </div>
        )
    }

    return (
        <div className="border shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Business Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Registration Number
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            {showVerified && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    Verified Date
                                </th>
                            )}
                            <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                        {localBusinesses.map((business) => (
                            <tr key={business.id} className="hover:bg-muted/20">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/business/${business.id}`}
                                            className="font-medium hover:underline"
                                            target="_blank"
                                        >
                                            {business.name}
                                        </Link>
                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {business.registrationNumber}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {business.owner}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {business.verified && business.verifiedAt ? (
                                        <VerifiedBadge
                                            businessId={business.id}
                                            verifiedAt={business.verifiedAt}
                                            size="sm"
                                        />
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                {showVerified && (
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                                        {business.verifiedAt
                                            ? format(new Date(business.verifiedAt), 'PP')
                                            : '-'
                                        }
                                    </td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        {!business.verified ? (
                                            <Button
                                                size="sm"
                                                variant="default"
                                                onClick={() => handleVerify(business.id, true)}
                                                disabled={loadingId === business.id}
                                            >
                                                {loadingId === business.id ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        Processing
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Verify
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleVerify(business.id, false)}
                                                disabled={loadingId === business.id}
                                            >
                                                {loadingId === business.id ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        Processing
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Unverify
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
