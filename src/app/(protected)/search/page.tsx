// src/app/(protected)/search/page.tsx
export const metadata = {
  title: 'Search - Sports Constraint Parser',
  description: 'Search for constraint templates',
}

export default function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Constraint Search
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Search interface coming in Phase 3! 🚀
        </p>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-500">
            Authentication is working! You are now logged in and can access protected routes.
          </p>
        </div>
      </div>
    </div>
  )
}