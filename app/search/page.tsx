'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchBar } from '@/components/search/search-bar'
import { BusinessCard } from '@/components/business/business-card'
import { AlertCircle, Lightbulb } from 'lucide-react'
import type { Business, SearchResult } from '@/types'

export default function SearchPage() {
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<SearchResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async (query: string, type: 'name' | 'registrationNumber') => {
        setLoading(true)
        setError(null)
        setResults(null)

        try {
            const response = await fetch(
                `/api/businesses/search?query=${encodeURIComponent(query)}&type=${type}`
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Search failed')
            }

            setResults(data.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="/">
                    <span className="font-bold text-xl">VerifySL</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/"
                    >
                        Home
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="/admin/login"
                    >
                        Admin
                    </Link>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Page Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Search Businesses
                        </h1>
                        <p className="text-muted-foreground">
                            Find and verify businesses registered in Sierra Leone
                        </p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar onSearch={handleSearch} isLoading={loading} />

                    {/* Error State */}
                    {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-900 dark:text-red-100">
                                    Search Error
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-200">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-48 bg-muted animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    )}

                    {/* Results */}
                    {results && !loading && (
                        <div className="space-y-6">
                            {/* Results Header */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Found <span className="font-medium text-foreground">{results.total}</span>{' '}
                                    {results.total === 1 ? 'business' : 'businesses'}
                                </p>
                            </div>

                            {/* Business Cards */}
                            {results.businesses.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {results.businesses.map((business) => (
                                        <BusinessCard key={business.id} business={business} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 space-y-4">
                                    <p className="text-lg text-muted-foreground">
                                        No businesses found
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search query
                                    </p>
                                </div>
                            )}

                            {/* Suggestions */}
                            {results.suggestions.length > 0 && results.businesses.length === 0 && (
                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                    <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="font-medium text-blue-900 dark:text-blue-100">
                                            Did you mean?
                                        </p>
                                        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                                            {results.suggestions.map((suggestion, i) => (
                                                <li key={i}>• {suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    © 2024 VerifySL. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
