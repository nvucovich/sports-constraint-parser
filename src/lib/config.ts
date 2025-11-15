// src/lib/config.ts
/**
 * Environment configuration and validation
 */

export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
} as const

/**
 * Validate that all required environment variables are set
 */
export function validateEnv() {
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
  }

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env.local file.'
    )
  }
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}