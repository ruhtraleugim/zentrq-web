'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/toast-context'

export default function AvaliarPage() {
  const router = useRouter()
  const params = useParams()
  const jobId = Number(params.id)
  const { addToast } = useToast()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) {
      addToast('Selecione uma avaliação', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, rating, comment }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast(err.message ?? 'Erro ao avaliar', 'error')
        return
      }
      addToast('Avaliação enviada!', 'success')
      router.push('/cliente/jobs')
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="mb-2 text-xl font-semibold text-text-dark">Avaliar Profissional</h1>
      <p className="mb-6 text-sm text-text-mid">Como foi a execução do serviço?</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Stars */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={`text-2xl transition-transform hover:scale-110 ${
                n <= rating ? 'text-yellow-400' : 'text-surface-secondary'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-dark">Comentário (opcional)</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-base"
            rows={3}
            maxLength={2000}
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" loading={loading} disabled={loading || rating === 0}>
            Enviar avaliação
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Pular
          </Button>
        </div>
      </form>
    </div>
  )
}
