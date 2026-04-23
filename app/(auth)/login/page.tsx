'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import type { AuthUser } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const authRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!authRes.ok) {
        const err = await authRes.json().catch(() => ({}))
        setError(err.message ?? 'Credenciais inválidas')
        return
      }
      const { role } = await authRes.json()

      const meRes = await fetch('/api/auth/me')
      if (meRes.ok) {
        const user: AuthUser = await meRes.json()
        setUser(user)
      }

      router.push(role === 'PROFISSIONAL' ? '/profissional/jobs' : '/cliente/jobs')
    } catch {
      setError('Sem conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Entrar</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <Input label="Senha" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Entrar
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-text-mid">
        Não tem conta?{' '}
        <Link href="/register" className="text-brand-base hover:underline">Cadastrar</Link>
      </p>
    </>
  )
}
