'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Job } from '@/lib/types'
import { JobCard } from '@/components/jobs/job-card'
import { PainelLateral } from '@/components/layout/painel-lateral'
import { Badge, JobStatusBadge } from '@/components/ui/badge'
import { ProposalForm } from '@/components/proposals/proposal-form'

interface Props {
  jobs: Job[]
  selectedJobId: number | null
  selectedJob: Job | null
}

export function ProfissionalJobsView({ jobs, selectedJobId, selectedJob }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const sorted = [...jobs].sort((a, b) => {
    if (a.type === 'URGENT' && b.type !== 'URGENT') return -1
    if (b.type === 'URGENT' && a.type !== 'URGENT') return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const closePanel = useCallback(() => router.push(pathname), [router, pathname])

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Oportunidades</h1>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-secondary bg-white py-16 text-center">
          <p className="text-text-mid">Nenhuma oportunidade disponível na sua cidade.</p>
          <p className="mt-1 text-xs text-text-mid">Configure suas cidades em Perfil.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sorted.map(job => (
            <JobCard
              key={job.id}
              job={job}
              selected={job.id === selectedJobId}
              onClick={() => router.push(`${pathname}?jobId=${job.id}`)}
            />
          ))}
        </div>
      )}

      <PainelLateral open={!!selectedJob} onClose={closePanel}>
        {selectedJob && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex gap-2">
                {selectedJob.type === 'URGENT' && <Badge label="URGENTE" variant="urgent" />}
                <JobStatusBadge status={selectedJob.status} />
              </div>
              <h2 className="mt-2 text-base font-semibold text-text-dark">{selectedJob.title}</h2>
              <p className="mt-1 text-xs text-text-mid">{selectedJob.city.name} · {new Date(selectedJob.createdAt).toLocaleDateString('pt-BR')}</p>
              <p className="mt-2 text-sm text-text-dark">{selectedJob.description}</p>
            </div>
            <hr className="border-surface-secondary" />
            <ProposalForm jobId={selectedJob.id} />
          </div>
        )}
      </PainelLateral>
    </div>
  )
}
