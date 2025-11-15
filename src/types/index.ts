// src/types/index.ts

export type TemplateType = 'template_1' | 'template_2' | 'template_3'

export interface ConstraintTemplate {
  id: string
  name: string
  description: string
  structure: string
}

export interface ParsedParameters {
  min?: number
  max?: number
  games?: string[]
  matchups?: string[]
  byes?: string[]
  rounds?: string[]
  venues?: string[]
  networks?: string[]
  teams?: string[]
  k?: number
  m?: number
  gameType?: 'home' | 'away' | 'bye' | 'active'
  sequence?: string[][]
}

export interface ConstraintExample {
  id: string
  natural_query: string
  template_type: TemplateType
  parsed_parameters: ParsedParameters
  embedding?: number[]
  created_at?: string
}

export interface SearchResult {
  template: string
  templateType: TemplateType
  confidence: number
  parsedConstraint: string
  parameters: ParsedParameters
  alternatives: AlternativeInterpretation[]
}

export interface AlternativeInterpretation {
  template: string
  templateType: TemplateType
  confidence: number
  parsedConstraint: string
  parameters: ParsedParameters
}

export interface SemanticSearchResult {
  id: string
  natural_query: string
  template_type: TemplateType
  parsed_parameters: ParsedParameters
  similarity: number
}

// Database types
export interface Database {
  public: {
    Tables: {
      constraint_examples: {
        Row: {
          id: string
          natural_query: string
          template_type: TemplateType
          parsed_parameters: ParsedParameters
          embedding: string // pgvector stores as string
          created_at: string
        }
        Insert: {
          id?: string
          natural_query: string
          template_type: TemplateType
          parsed_parameters: ParsedParameters
          embedding: string
          created_at?: string
        }
        Update: {
          id?: string
          natural_query?: string
          template_type?: TemplateType
          parsed_parameters?: ParsedParameters
          embedding?: string
          created_at?: string
        }
      }
    }
  }
}