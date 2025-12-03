'use client'

import Link from 'next/link'
import { Share2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VerifiedBadge } from '@/components/ui/verified-badge'
import type { Business } from '@/types'

interface BusinessHeaderProps {
    business: Business
    onShare?: () => void
}

export function BusinessHeader({ business, onShare }: BusinessHeaderProps) {
    const handleShare = async () => {
        if (onShare) {
            onShare()
            return
        }

        // Use Web Share API if available
        if (navigator.share) {
            try {
                await navigator.share({
                    title: business.name,
                    text: `Check out ${business.name} on VerifySL`,
                    url: window.location.href
                })
            } catch (err) {
                // User cancelled or share failed
                console.error('Share failed:', err)
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    return (
        <div className="space-y-4">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/search" className="hover:text-foreground transition-colors">
                    Search
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{business.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {business.name}
                    </h1>
                    <div className="flex items-center gap-3">
                        {business.verified && business.verifiedAt && (
                            <VerifiedBadge
                                businessId={business.id}
                                verifiedAt={business.verifiedAt}
                                size="lg"
                                showDate
                            />
                        )}
                        <span className="text-sm text-muted-foreground">
                            Reg: {business.registrationNumber}
                        </span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Share business profile"
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                </Button>
            </div>
        </div>
    )
}
