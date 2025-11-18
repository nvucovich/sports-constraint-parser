// src/app/(protected)/search/page.tsx
import SearchInterface from '@/components/search/SearchInterface'

export const metadata = {
  title: 'Search - Sports Constraint Parser',
  description: 'Search for sports scheduling constraints using natural language',
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Constraint Search
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Search for scheduling constraints using natural language.
        </p>
      </div>

      <SearchInterface />
    </div>
  )
}