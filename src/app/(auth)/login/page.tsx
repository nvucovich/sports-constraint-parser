// src/app/(auth)/login/page.tsx
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Login - Sports Constraint Parser',
  description: 'Sign in to your account',
}

export default async function LoginPage() {
  // Check if user is already logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/search')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 touch-manipulation"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mt-8 bg-white py-6 sm:py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm mode="login" />
        </div>
      </div>
    </div>
  )
}
