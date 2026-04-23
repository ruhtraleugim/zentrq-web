'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import type { AuthUser } from '@/lib/types'

function VerifyContent() {
  const router = useRouter()
  const { setUser } = useAuth()
  const params = useSearchParams()
  const email = params.get('email') ?? ''

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const authRes = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp }),
      })
      if (!authRes.ok) {
        const err = await authRes.json().catch(() => ({}))
        setError(err.message ?? 'Código inválido ou expirado')
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

  async function handleResend() {
    setResending(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setResent(true)
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <h1 className="mb-2 text-xl font-semibold text-text-dark">Verificar email</h1>
      <p className="mb-6 text-sm text-text-mid">
        Enviamos um código de 6 dígitos para <strong>{email}</strong>
      </p>
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <Input
          label="Código"
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="text-center text-lg tracking-widest"
          maxLength={6}
          required
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Verificar
        </Button>
      </form>
      <div className="mt-4 text-center">
        {resent ? (
          <p className="text-xs text-green-600">Novo código enviado!</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-xs text-brand-base hover:underline disabled:opacity-50"
          >
            {resending ? 'Enviando...' : 'Reenviar código'}
          </button>
        )}
      </div>
    </>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <VerifyContent />
    </Suspense>
  )
}
