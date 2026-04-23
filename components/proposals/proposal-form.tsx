'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/contexts/toast-context'

interface Props {
  jobId: number
}

type FormState = 'idle' | 'loading' | 'success'

export function ProposalForm({ jobId }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ price: '', estimatedTime: '' })
  const [sent, setSent] = useState<{ price: string; estimatedTime: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validate price before sending
    const parsedPrice = parseFloat(form.price.replace(',', '.'))
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      addToast('Informe um valor válido', 'error')
      return
    }

    setState('loading')
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          price: parsedPrice,
          estimatedTime: form.estimatedTime,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast(err.message ?? 'Erro ao enviar proposta', 'error')
        setState('idle')
        return
      }
      setSent({ price: form.price, estimatedTime: form.estimatedTime })
      setState('success')
      router.refresh()
    } catch {
      addToast('Sem conexão', 'error')
      setState('idle')
    }
  }

  if (state === 'success' && sent) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
        Proposta enviada · R$ {sent.price}
        {sent.estimatedTime && ` · Prazo: ${sent.estimatedTime}`}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-sm font-medium text-text-dark">Enviar proposta</h3>
      <Input
        label="Valor (R$)"
        type="text"
        inputMode="decimal"
        value={form.price}
        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
        placeholder="0,00"
        required
      />
      <Input
        label="Prazo estimado"
        value={form.estimatedTime}
        onChange={e => setForm(f => ({ ...f, estimatedTime: e.target.value }))}
        placeholder="Ex: 3 dias"
      />
      <Button type="submit" loading={state === 'loading'} disabled={state === 'loading'} size="sm">
        Enviar Proposta
      </Button>
    </form>
  )
}
