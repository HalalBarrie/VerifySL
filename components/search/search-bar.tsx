'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface SearchBarProps {
    onSearch: (query: string, type: 'name' | 'registrationNumber') => void
    isLoading?: boolean
    defaultType?: 'name' | 'registrationNumber'
}

export function SearchBar({ onSearch, isLoading = false, defaultType = 'name' }: SearchBarProps) {
    const [query, setQuery] = useState('')
    const [searchType, setSearchType] = useState<'name' | 'registrationNumber'>(defaultType)

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query.trim(), searchType)
        }
    }, [query, searchType, onSearch])

    const handleClear = useCallback(() => {
        setQuery('')
    }, [])

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Search Type Toggle */}
            <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="search-name"
                        name="searchType"
                        value="name"
                        checked={searchType === 'name'}
                        onChange={() => setSearchType('name')}
                        className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <Label htmlFor="search-name" className="cursor-pointer">
                        Business Name
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="radio"
                        id="search-reg"
                        name="searchType"
                        value="registrationNumber"
                        checked={searchType === 'registrationNumber'}
                        onChange={() => setSearchType('registrationNumber')}
                        className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
                    />
                    <Label htmlFor="search-reg" className="cursor-pointer">
                        Registration Number
                    </Label>
                </div>
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={
                            searchType === 'name'
                                ? 'Search by business name...'
                                : 'Enter registration number...'
                        }
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 pr-10 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-input transition-all"
                        aria-label={`Search by ${searchType === 'name' ? 'business name' : 'registration number'}`}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                <Button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? 'Searching...' : 'Search'}
                </Button>
            </div>
        </form>
    )
}
