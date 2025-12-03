'use client'

import Link from 'next/link'
import { MapPin, User, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import type { Business } from '@/types'

interface BusinessCardProps {
    business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
    return (
        <Link href={`/business/${business.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{business.name}</CardTitle>
                        {business.verified && business.verifiedAt && (
                            <VerifiedBadge
                                businessId={business.id}
                                verifiedAt={business.verifiedAt}
                                size="sm"
                            />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        <span>
                            <span className="font-medium">Reg:</span> {business.registrationNumber}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" aria-hidden="true" />
                        <span>
                            <span className="font-medium">Owner:</span> {business.owner}
                        </span>
                    </div>

                    {business.address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" aria-hidden="true" />
                            <span className="truncate">{business.address}</span>
                        </div>
                    )}

                    {business.businessType && (
                        <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted">
                                {business.businessType}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
