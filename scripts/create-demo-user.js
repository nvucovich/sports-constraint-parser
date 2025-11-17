// scripts/create-demo-user.mjs
/**
 * Script to create a demo user in Supabase
 * Run this after setting up your database
 * 
 * Usage: node scripts/create-demo-user.mjs
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createDemoUser() {
  console.log('Creating demo user...')

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'demo@example.com',
    password: 'demo123456',
    email_confirm: true, // Auto-confirm email
  })

  if (error) {
    console.error('❌ Error creating demo user:', error.message)
    process.exit(1)
  }

  console.log('✅ Demo user created successfully!')
  console.log('📧 Email: demo@example.com')
  console.log('🔑 Password: demo123456')
  console.log('\nYou can now use these credentials to log in!')
}

createDemoUser()
