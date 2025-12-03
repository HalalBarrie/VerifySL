'use client'

import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { cn, formatDateDistance } from '@/lib/utils'

interface VerifiedBadgeProps {
    businessId: string
    verifiedAt: Date | null
    size?: 'sm' | 'md' | 'lg'
    showDate?: boolean
    className?: string
}

const sizeMap = {
    sm: {
        icon: 'h-3 w-3',
        text: 'text-xs',
        gap: 'gap-1'
    },
    md: {
        icon: 'h-4 w-4',
        text: 'text-sm',
        gap: 'gap-1.5'
    },
    lg: {
        icon: 'h-5 w-5',
        text: 'text-base',
        gap: 'gap-2'
    }
}

export function VerifiedBadge({
    businessId,
    verifiedAt,
    size = 'md',
    showDate = false,
    className
}: VerifiedBadgeProps) {
    if (!verifiedAt) {
        return null
    }

    const sizes = sizeMap[size]
    const dateText = formatDateDistance(new Date(verifiedAt))

    return (
        <Link
            href={`/business/${businessId}`}
            className={cn(
                'inline-flex items-center rounded-full bg-[hsl(var(--success))] px-2.5 py-0.5',
                'text-white hover:bg-[hsl(var(--success))]/90 transition-colors',
                'dark:bg-[hsl(var(--success))] dark:text-white dark:hover:bg-[hsl(var(--success))]/90',
                sizes.gap,
                className
            )}
            title={showDate ? `Verified ${dateText}` : 'Verified business'}
            aria-label={`Verified business${showDate ? ` ${dateText}` : ''}`}
        >
            <BadgeCheck className={sizes.icon} aria-hidden="true" />
            <span className={cn('font-medium', sizes.text)}>
                Verified
            </span>
            {showDate && (
                <span className={cn('font-normal opacity-80', sizes.text)}>
                    {dateText}
                </span>
            )}
        </Link>
    )
}
