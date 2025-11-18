// scripts/seed-constraints.ts
/**
 * Database seeding script for constraint examples
 *
 * Process:
 * 1. Load constraint examples from data file
 * 2. Generate OpenAI embeddings for each example
 * 3. Clear existing data from database
 * 4. Insert constraints with embeddings
 * 5. Verify successful insertion
 */
import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { constraintExamples } from '../src/data/constraint-examples'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

// Initialize Supabase and OpenAI clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const openaiApiKey = process.env.OPENAI_API_KEY!

if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  console.error('- OPENAI_API_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const openai = new OpenAI({ apiKey: openaiApiKey })

interface ConstraintWithEmbedding {
  id: string
  template: string
  template_name: string
  natural_language_query: string
  parsed_constraint: string
  parameters: any
  description: string
  embedding: number[]
}

async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    })
    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}

async function seedConstraints() {
  console.log('Starting constraint seeding process...\n')

  // Generate embeddings for all constraint examples
  console.log('Step 1: Generating embeddings with OpenAI...')
  const constraintsWithEmbeddings: ConstraintWithEmbedding[] = []

  for (let i = 0; i < constraintExamples.length; i++) {
    const example = constraintExamples[i]
    console.log(`  [${i + 1}/${constraintExamples.length}] Generating embedding for: "${example.naturalLanguageQuery}"`)

    try {
      const embedding = await generateEmbedding(example.naturalLanguageQuery)
      constraintsWithEmbeddings.push({
        id: example.id,
        template: example.template,
        template_name: example.templateName,
        natural_language_query: example.naturalLanguageQuery,
        parsed_constraint: example.parsedConstraint,
        parameters: example.parameters,
        description: example.description,
        embedding,
      })

      // Brief delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`  Failed to generate embedding for ${example.id}`)
      throw error
    }
  }

  console.log(`Generated ${constraintsWithEmbeddings.length} embeddings\n`)

  // Clear existing constraints before seeding
  console.log('Step 2: Clearing existing constraints...')
  const { error: deleteError } = await supabase
    .from('constraints')
    .delete()
    .neq('id', '') // Delete all rows

  if (deleteError) {
    console.warn('  Warning while clearing existing data:', deleteError.message)
  } else {
    console.log('  Cleared existing constraints\n')
  }

  // Insert constraints with generated embeddings
  console.log('Step 3: Inserting constraints into database...')

  for (let i = 0; i < constraintsWithEmbeddings.length; i++) {
    const constraint = constraintsWithEmbeddings[i]
    console.log(`  [${i + 1}/${constraintsWithEmbeddings.length}] Inserting: ${constraint.id}`)

    const { error } = await supabase
      .from('constraints')
      .insert([constraint])

    if (error) {
      console.error(`  Failed to insert ${constraint.id}:`, error.message)
      throw error
    }
  }

  console.log(`Inserted ${constraintsWithEmbeddings.length} constraints\n`)

  // Verify successful data insertion
  console.log('Step 4: Verifying inserted data...')
  const { data, error: countError } = await supabase
    .from('constraints')
    .select('id, template, natural_language_query', { count: 'exact' })

  if (countError) {
    console.error('  Error verifying data:', countError.message)
  } else {
    console.log(`  Total constraints in database: ${data?.length || 0}`)

    // Display distribution by template type
    const template1Count = data?.filter(c => c.template === 'template1').length || 0
    const template2Count = data?.filter(c => c.template === 'template2').length || 0
    const template3Count = data?.filter(c => c.template === 'template3').length || 0

    console.log(`     - Template 1 (Game Scheduling): ${template1Count}`)
    console.log(`     - Template 2 (Sequence): ${template2Count}`)
    console.log(`     - Template 3 (Team Pattern): ${template3Count}`)
  }

  console.log('\nSeeding complete!')
  console.log('\nSample queries to try:')
  console.log('  - "Ensure rivalry games are on weekends"')
  console.log('  - "No back to back to back games"')
  console.log('  - "Teams need primetime games on national TV"')
}

// Execute seeding process
seedConstraints()
  .then(() => {
    console.log('\nScript completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\nScript failed:', error)
    process.exit(1)
  })
