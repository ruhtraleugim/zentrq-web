'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Role } from '@/lib/types'

function RegisterContent() {
  const router = useRouter()
  const params = useSearchParams()
  const roleParam = params.get('role') as Role | null

  const [form, setForm] = useState({ name: '', email: '', password: '', role: roleParam ?? ('CLIENTE' as Role) })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = err.detail ?? err.message ?? 'Erro ao cadastrar'
        setError(msg)
        return
      }
      router.push(`/verify?email=${encodeURIComponent(form.email)}`)
    } catch {
      setError('Sem conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Criar conta</h1>

      <div className="mb-4 flex rounded-lg border border-surface-secondary p-1">
        {(['CLIENTE', 'PROFISSIONAL'] as Role[]).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setForm(f => ({ ...f, role: r }))}
            className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
              form.role === r ? 'bg-brand-base text-white' : 'text-text-mid hover:text-text-dark'
            }`}
          >
            {r === 'CLIENTE' ? 'Cliente' : 'Profissional'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <Input label="Senha" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} minLength={6} required />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-mid">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand-base hover:underline">Entrar</Link>
      </p>
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
