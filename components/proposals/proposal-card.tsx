'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Proposal } from '@/lib/types'
import { ProposalStatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/contexts/toast-context'

interface Props {
  proposal: Proposal
  canAct: boolean // true if job is in a state where accept/reject makes sense
  selected: boolean
  onSelect: () => void
}

export function ProposalCard({ proposal, canAct, selected, onSelect }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)

  async function act(action: 'accept' | 'reject') {
    setLoading(action)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/${action}`, { method: 'POST' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast(err.message ?? 'Erro ao processar', 'error')
        return
      }
      if (action === 'accept') {
        const data = await res.json().catch(() => ({}))
        addToast('Proposta aceita! Redirecionando para pagamento...', 'success')
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
        } else {
          router.refresh()
        }
      } else {
        addToast('Proposta rejeitada', 'success')
        router.refresh()
      }
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left cursor-pointer rounded-lg border p-3 transition-colors ${
        selected ? 'border-brand-base bg-brand-base/5' : 'border-surface-secondary bg-white hover:border-brand-base/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-dark">{proposal.professionalName}</span>
        <ProposalStatusBadge status={proposal.status} />
      </div>
      <div className="mt-1 flex gap-4 text-xs text-text-mid">
        <span>R$ {Number(proposal.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        {proposal.estimatedTime && <span>Prazo: {proposal.estimatedTime}</span>}
      </div>

      {canAct && proposal.status === 'PENDING' && (
        <div className="mt-3 flex gap-2" onClick={e => e.stopPropagation()}>
          <Button
            size="sm"
            loading={loading === 'accept'}
            disabled={loading !== null}
            onClick={() => act('accept')}
          >
            Aceitar
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={loading === 'reject'}
            disabled={loading !== null}
            onClick={() => act('reject')}
          >
            Rejeitar
          </Button>
        </div>
      )}
    </button>
  )
}
