'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid credentials')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <svg className="inline-block w-16 h-16 mb-4" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="10" width="80" height="80" rx="8" stroke="#2563eb" strokeWidth="4" fill="none" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="45" x2="60" y2="45" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="60" x2="50" y2="60" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
            <circle cx="72" cy="68" r="14" stroke="#2563eb" strokeWidth="3" fill="none" />
            <line x1="82" y1="78" x2="90" y2="86" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h1 className="text-2xl font-bold text-white">Compex ERP</h1>
          <p className="text-slate-400 mt-1">EMS & PCB Manufacturing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="admin@compex.in"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-8">
          Compex Solution &mdash; Gandhinagar, India
        </p>
      </div>
    </div>
  )
}
