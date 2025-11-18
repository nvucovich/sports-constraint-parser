// src/types/index.ts
// Centralized TypeScript type definitions for the entire application

import { User } from '@supabase/supabase-js'

// ============================================================================
// Constraint Types
// ============================================================================

export type TemplateType = 'template1' | 'template2' | 'template3'

export interface ConstraintExample {
  id: string
  template: TemplateType
  templateName: string
  naturalLanguageQuery: string
  parsedConstraint: string
  parameters: Record<string, any>
  description: string
}

export interface ConstraintWithEmbedding extends ConstraintExample {
  embedding: number[]
  created_at?: string
  updated_at?: string
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchQuery {
  query: string
}

export interface SearchResultData {
  id: string
  template: string
  templateName: string
  naturalLanguageQuery: string
  parsedConstraint: string
  parameters: Record<string, any>
  description: string
  confidence: number
  alternatives?: AlternativeInterpretation[]
}

export interface AlternativeInterpretation {
  description: string
  parameters?: Record<string, any>
}

export interface SearchResponse {
  query: string
  results: SearchResultData[]
  count: number
}

export interface DatabaseSearchResult {
  id: string
  template: string
  template_name: string
  natural_language_query: string
  parsed_constraint: string
  parameters: any
  description: string
  similarity: number
}

// ============================================================================
// API Types
// ============================================================================

export interface APIError {
  error: string
  details?: string
}

export interface APISuccess<T = any> {
  data: T
  message?: string
}

// ============================================================================
// Auth Types
// ============================================================================

export type AuthMode = 'login' | 'signup'

export interface AuthFormProps {
  mode: AuthMode
}

export interface NavigationProps {
  user: User
}

// ============================================================================
// Component Props
// ============================================================================

export interface SearchResultProps {
  result: SearchResultData
  rank: number
}

// ============================================================================
// OpenAI Types
// ============================================================================

export interface OpenAIEmbeddingResponse {
  object: string
  data: Array<{
    object: string
    embedding: number[]
    index: number
  }>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

export interface GPTParameterExtractionResponse {
  confidence: number
  extractedParameters: Record<string, any>
  alternatives: AlternativeInterpretation[]
}

// ============================================================================
// Database Types
// ============================================================================

export interface SupabaseConstraint {
  id: string
  template: TemplateType
  template_name: string
  natural_language_query: string
  parsed_constraint: string
  parameters: any
  description: string
  embedding: number[]
  created_at: string
  updated_at: string
}

export interface SearchConstraintsParams {
  query_embedding: number[]
  match_threshold?: number
  match_count?: number
}

// ============================================================================
// Utility Types
// ============================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// ============================================================================
// Error Boundary Types
// ============================================================================

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}
