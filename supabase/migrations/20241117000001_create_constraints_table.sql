-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create constraints table
CREATE TABLE IF NOT EXISTS constraints (
  id TEXT PRIMARY KEY,
  template TEXT NOT NULL CHECK (template IN ('template1', 'template2', 'template3')),
  template_name TEXT NOT NULL,
  natural_language_query TEXT NOT NULL,
  parsed_constraint TEXT NOT NULL,
  parameters JSONB NOT NULL,
  description TEXT,
  embedding vector(1536), -- OpenAI ada-002 produces 1536-dimensional embeddings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on template for faster filtering
CREATE INDEX IF NOT EXISTS idx_constraints_template ON constraints(template);

-- Create index on embedding for vector similarity search
CREATE INDEX IF NOT EXISTS idx_constraints_embedding ON constraints
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create function to search constraints by semantic similarity
CREATE OR REPLACE FUNCTION search_constraints(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  template TEXT,
  template_name TEXT,
  natural_language_query TEXT,
  parsed_constraint TEXT,
  parameters JSONB,
  description TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.template,
    c.template_name,
    c.natural_language_query,
    c.parsed_constraint,
    c.parameters,
    c.description,
    1 - (c.embedding <=> query_embedding) AS similarity
  FROM constraints c
  WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_constraints_updated_at
  BEFORE UPDATE ON constraints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE constraints ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all constraints
CREATE POLICY "Allow authenticated users to read constraints"
  ON constraints
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert constraints (for seeding)
CREATE POLICY "Allow authenticated users to insert constraints"
  ON constraints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
