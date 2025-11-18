// src/components/search/SearchResult.tsx
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Code } from 'lucide-react'

interface SearchResultProps {
  result: {
    id: string
    template: string
    templateName: string
    naturalLanguageQuery: string
    parsedConstraint: string
    parameters: Record<string, any>
    description: string
    confidence: number
    alternatives?: any[]
  }
  rank: number
}

export function SearchResult({ result, rank }: SearchResultProps) {
  const [expanded, setExpanded] = useState(false)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200'
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-orange-100 text-orange-800 border-orange-200'
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Confidence'
    if (confidence >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'template1':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'template2':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'template3':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 sm:hover:scale-[1.01] animate-fadeIn">
      {/* Header */}
      <div className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full font-semibold text-xs sm:text-sm flex-shrink-0">
              {rank}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTemplateColor(result.template)} truncate max-w-full`}>
                <span className="hidden sm:inline">{result.templateName}</span>
                <span className="sm:hidden">{result.templateName.replace('Template ', 'T')}</span>
              </span>
            </div>
          </div>
          <div className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getConfidenceColor(result.confidence)} flex-shrink-0`}>
            <span className="hidden sm:inline">{getConfidenceLabel(result.confidence)} ({Math.round(result.confidence * 100)}%)</span>
            <span className="sm:hidden">{Math.round(result.confidence * 100)}%</span>
          </div>
        </div>

        {/* Original Query Match */}
        <div className="mb-4">
          <div className="flex items-start gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Original Query Match
              </p>
              <p className="text-sm text-gray-700 italic">
                "{result.naturalLanguageQuery}"
              </p>
            </div>
          </div>
        </div>

        {/* Parsed Constraint */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Parsed Constraint
          </p>
          <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
            {result.parsedConstraint}
          </p>
        </div>

        {/* Description */}
        {result.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {result.description}
            </p>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium transition-all sm:hover:gap-3 touch-manipulation active:scale-95"
        >
          <Code className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{expanded ? 'Hide' : 'View'} Extracted Parameters</span>
          <span className="sm:hidden">{expanded ? 'Hide' : 'View'} Parameters</span>
          {expanded ? (
            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      {/* Expanded Parameters Section */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-5 animate-slideDown">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 sm:mb-3">
            Extracted Parameters
          </p>
          <div className="bg-white rounded border border-gray-200">
            <pre className="p-3 sm:p-4 text-xs text-gray-900 overflow-x-auto">
              <code className="text-gray-900">{JSON.stringify(result.parameters, null, 2)}</code>
            </pre>
          </div>

          {/* Alternatives Section */}
          {result.alternatives && result.alternatives.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Alternative Interpretations
              </p>
              <div className="space-y-2">
                {result.alternatives.map((alt: any, index: number) => (
                  <div
                    key={index}
                    className="bg-amber-50 border border-amber-300 rounded-lg p-4"
                  >
                    <p className="text-sm font-medium text-amber-900 mb-2">
                      Alternative {index + 1}
                    </p>
                    <p className="text-sm text-amber-800 mb-2">{alt.description}</p>
                    {alt.parameters && (
                      <details className="mt-2">
                        <summary className="text-xs text-amber-700 cursor-pointer hover:text-amber-900 font-medium">
                          View alternative parameters
                        </summary>
                        <div className="mt-2 bg-white rounded border border-amber-200 p-2">
                          <pre className="text-xs text-gray-900 overflow-x-auto">
                            <code>{JSON.stringify(alt.parameters, null, 2)}</code>
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
