'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Job, Proposal, JobStatus } from '@/lib/types'
import { JobStatusBadge, Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProposalCard } from '@/components/proposals/proposal-card'
import { useToast } from '@/contexts/toast-context'

interface Props {
  job: Job
  proposals: Proposal[]
  selectedProposalId: number | null
  onClose: () => void
}

const cancelableStatuses: JobStatus[] = ['OPEN', 'IN_NEGOTIATION', 'ACCEPTED']
const completableStatuses: JobStatus[] = ['IN_PROGRESS']
const actionableStatuses: JobStatus[] = ['IN_NEGOTIATION', 'ACCEPTED']

export function JobPanel({ job, proposals, selectedProposalId, onClose }: Props) {
  const router = useRouter()
  const { addToast } = useToast()
  const [canceling, setCanceling] = useState(false)
  const [completing, setCompleting] = useState(false)

  async function cancel() {
    setCanceling(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}/cancel`, { method: 'PATCH' })
      if (!res.ok) {
        addToast('Não foi possível cancelar', 'error')
        return
      }
      addToast('Serviço cancelado', 'success')
      router.refresh()
      onClose()
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setCanceling(false)
    }
  }

  async function complete() {
    setCompleting(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}/complete`, { method: 'PATCH' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast(err.message ?? 'Não foi possível concluir', 'error')
        return
      }
      addToast('Serviço concluído!', 'success')
      router.push(`/cliente/jobs/${job.id}/avaliar`)
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setCompleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Job header */}
      <div>
        <div className="flex items-center gap-2">
          {job.type === 'URGENT' && <Badge label="URGENTE" variant="urgent" />}
          <JobStatusBadge status={job.status} />
        </div>
        <h2 className="mt-2 text-base font-semibold text-text-dark">{job.title}</h2>
        <p className="mt-1 text-xs text-text-mid">{job.city.name} · {new Date(job.createdAt).toLocaleDateString('pt-BR')}</p>
        <p className="mt-2 text-sm text-text-dark">{job.description}</p>
      </div>

      {/* Job actions */}
      <div className="flex gap-2">
        {completableStatuses.includes(job.status) && (
          <Button size="sm" loading={completing} disabled={completing || canceling} onClick={complete}>
            Marcar como concluído
          </Button>
        )}
        {cancelableStatuses.includes(job.status) && (
          <Button size="sm" variant="danger" loading={canceling} disabled={canceling || completing} onClick={cancel}>
            Cancelar
          </Button>
        )}
      </div>

      {/* Proposals */}
      {proposals.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-text-dark">
            Propostas ({proposals.length})
          </h3>
          <div className="flex flex-col gap-2">
            {proposals.map(p => (
              <ProposalCard
                key={p.id}
                proposal={p}
                canAct={actionableStatuses.includes(job.status)}
                selected={p.id === selectedProposalId}
                onSelect={() => router.push(`/cliente/jobs?jobId=${job.id}&proposalId=${p.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {proposals.length === 0 && job.status === 'OPEN' && (
        <p className="text-sm text-text-mid">Aguardando propostas de profissionais.</p>
      )}
    </div>
  )
}
