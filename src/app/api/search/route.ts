// src/app/api/search/route.ts
/**
 * Search API endpoint for semantic constraint matching
 *
 * Architecture:
 * 1. Receive natural language query from client
 * 2. Generate embedding vector using OpenAI
 * 3. Perform vector similarity search in Supabase
 * 4. Enhance results with GPT-4 parameter extraction
 * 5. Calculate combined confidence scores
 * 6. Return ranked results to client
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SearchResult {
  id: string
  template: string
  template_name: string
  natural_language_query: string
  parsed_constraint: string
  parameters: any
  description: string
  similarity: number
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Verify user authentication before processing
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate query embedding using OpenAI text-embedding-ada-002
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // Perform vector similarity search using Supabase pgvector
    // Uses cosine distance for semantic matching
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_constraints', {
        query_embedding: queryEmbedding,
        match_threshold: 0.4, // Lower threshold to get more results
        match_count: 5,
      })

    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json(
        { error: 'Search failed', details: searchError.message },
        { status: 500 }
      )
    }

    // Enhance each result with GPT-4 for parameter extraction
    // Combines vector similarity with GPT confidence assessment
    const enhancedResults = await Promise.all(
      (searchResults as SearchResult[]).map(async (result) => {
        try {
          // Extract structured parameters using GPT-4
          // Provide confidence assessment and identify ambiguities
          const extractionPrompt = `You are a sports scheduling constraint parser.

User Query: "${query}"

Matched Template Example: "${result.natural_language_query}"
Template Type: ${result.template_name}
Base Parameters: ${JSON.stringify(result.parameters, null, 2)}

Your task:
1. Extract specific parameters from the user query that match this template
2. Provide a confidence score (0.0-1.0) for how well the query matches this template
3. If the query could be interpreted in multiple ways, provide alternative interpretations

Return a JSON object with:
{
  "confidence": <number between 0.0 and 1.0>,
  "extractedParameters": <parameters extracted from user query>,
  "alternatives": [
    {
      "description": "Brief description of alternative interpretation",
      "parameters": <alternative parameters object>
    }
  ]
}

IMPORTANT:
- Be strict with confidence scores. Only give high scores (>0.8) if the match is very clear.
- If the query is ambiguous or could match multiple templates/interpretations, include alternatives array with at least 1-2 alternatives.
- If the query is crystal clear and has only one possible interpretation, return an empty alternatives array.
- Examples of ambiguous queries: vague team references, unclear date ranges, missing specificity
- Each alternative should explain WHY it's a valid interpretation`

          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert at extracting structured parameters from natural language sports scheduling constraints. Always respond with valid JSON only.',
              },
              {
                role: 'user',
                content: extractionPrompt,
              },
            ],
            temperature: 0.3,
            response_format: { type: 'json_object' },
          })

          const gptResponse = JSON.parse(completion.choices[0].message.content || '{}')

          // Combine confidence scores: 60% vector similarity + 40% GPT assessment
          // This weighting prioritizes semantic matching while incorporating GPT intelligence
          const vectorConfidence = result.similarity
          const gptConfidence = gptResponse.confidence || 0.5
          const finalConfidence = (vectorConfidence * 0.6) + (gptConfidence * 0.4)

          return {
            id: result.id,
            template: result.template,
            templateName: result.template_name,
            naturalLanguageQuery: result.natural_language_query,
            parsedConstraint: result.parsed_constraint,
            parameters: gptResponse.extractedParameters || result.parameters,
            description: result.description,
            confidence: finalConfidence,
            alternatives: gptResponse.alternatives || [],
          }
        } catch (error) {
          console.error('Error enhancing result with GPT:', error)
          // Fallback to basic result if GPT enhancement fails
          return {
            id: result.id,
            template: result.template,
            templateName: result.template_name,
            naturalLanguageQuery: result.natural_language_query,
            parsedConstraint: result.parsed_constraint,
            parameters: result.parameters,
            description: result.description,
            confidence: result.similarity,
            alternatives: [],
          }
        }
      })
    )

    // Sort by confidence
    enhancedResults.sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      query,
      results: enhancedResults,
      count: enhancedResults.length,
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
