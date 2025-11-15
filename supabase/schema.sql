-- supabase/schema.sql
-- This file contains the database schema for the sports constraint parser

-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create constraint_examples table
CREATE TABLE IF NOT EXISTS constraint_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    natural_query TEXT NOT NULL,
    template_type TEXT NOT NULL CHECK (template_type IN ('template_1', 'template_2', 'template_3')),
    parsed_parameters JSONB NOT NULL,
    embedding vector(1536), -- OpenAI text-embedding-3-small dimension
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on template_type for filtering
CREATE INDEX IF NOT EXISTS idx_template_type ON constraint_examples(template_type);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_created_at ON constraint_examples(created_at DESC);

-- Create vector similarity search index using HNSW (Hierarchical Navigable Small World)
-- This significantly speeds up similarity searches
CREATE INDEX IF NOT EXISTS idx_embedding ON constraint_examples 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Create a function for semantic search
CREATE OR REPLACE FUNCTION search_constraint_examples(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    natural_query TEXT,
    template_type TEXT,
    parsed_parameters JSONB,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        constraint_examples.id,
        constraint_examples.natural_query,
        constraint_examples.template_type,
        constraint_examples.parsed_parameters,
        1 - (constraint_examples.embedding <=> query_embedding) AS similarity
    FROM constraint_examples
    WHERE 1 - (constraint_examples.embedding <=> query_embedding) > match_threshold
    ORDER BY constraint_examples.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Create RLS (Row Level Security) policies
ALTER TABLE constraint_examples ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read constraint examples
CREATE POLICY "Allow authenticated users to read constraint examples"
ON constraint_examples
FOR SELECT
TO authenticated
USING (true);

-- Only allow service role to insert/update/delete (for seeding data)
CREATE POLICY "Allow service role to manage constraint examples"
ON constraint_examples
FOR ALL
TO service_role
USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON constraint_examples TO authenticated;
GRANT ALL ON constraint_examples TO service_role;