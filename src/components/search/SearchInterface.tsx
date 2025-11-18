// src/components/search/SearchInterface.tsx
/**
 * Main search interface component with manual search trigger
 *
 * Features:
 * - Manual search via button click or Enter key
 * - Keyboard shortcuts (Esc, Cmd/Ctrl+K)
 * - Example queries for quick testing
 * - Loading and error states
 * - Clear search functionality
 */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, Loader2, X } from 'lucide-react'
import { SearchResult } from './SearchResult'

interface SearchResultData {
  id: string
  template: string
  templateName: string
  naturalLanguageQuery: string
  parsedConstraint: string
  parameters: Record<string, any>
  description: string
  confidence: number
  alternatives?: SearchResultData[]
}

export default function SearchInterface() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchExecuted, setSearchExecuted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setSearchExecuted(false)
      return
    }

    setLoading(true)
    setError(null)
    setSearchExecuted(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError('Failed to perform search. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleClearSearch = () => {
    setQuery('')
    setResults([])
    setSearchExecuted(false)
    setError(null)
    inputRef.current?.focus()
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    performSearch(example)
  }

  // Set up keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc clears search
      if (e.key === 'Escape') {
        handleClearSearch()
      }
      // Cmd/Ctrl+K focuses search input
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const exampleQueries = [
    'Ensure all rivalry games on a weekend on ESPN',
    'No cases of 3 games in 3 nights for any NBA team',
    'Make sure teams do not play at home on either side of their bye week',
    'At least 2 primetime games on national TV for every team',
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="flex gap-2">
          <div className="relative group flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-colors group-focus-within:text-blue-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your scheduling constraint..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 text-base sm:text-lg text-gray-900 placeholder:text-gray-400 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              disabled={loading}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors touch-manipulation"
                title="Clear search (Esc)"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 touch-manipulation active:scale-95"
            title="Search (Enter)"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Search status */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching...
              </span>
            ) : (
              <>
                <span className="hidden sm:inline">Press Enter or click Search to find matching constraints</span>
                <span className="sm:hidden">Click Search or press Enter</span>
              </>
            )}
          </span>
          <span className="hidden sm:block">
            Press <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> to clear
          </span>
        </div>
      </form>

      {/* Example Queries */}
      {!searchExecuted && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm font-semibold text-blue-900">
              Try these examples:
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="group text-left text-xs sm:text-sm text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-all hover:shadow-sm touch-manipulation active:scale-95"
              >
                <span className="line-clamp-2">&ldquo;{example}&rdquo;</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      )}

      {/* No Results */}
      {!loading && searchExecuted && results.length === 0 && !error && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-12 text-center animate-fadeIn">
          <div className="max-w-md mx-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              No matching constraints found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Try rephrasing your query or use different keywords.
            </p>
            <button
              onClick={handleClearSearch}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium touch-manipulation active:scale-95 transition-transform"
            >
              Clear and try again
            </button>
          </div>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3 sm:space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-bold flex-shrink-0">
                {results.length}
              </div>
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">
                {results.length === 1 ? 'Best match' : `Top ${results.length} matches`}
              </h2>
            </div>
            <span className="text-xs sm:text-sm text-gray-600 truncate">
              for &ldquo;{query}&rdquo;
            </span>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <SearchResult
                key={result.id}
                result={result}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
