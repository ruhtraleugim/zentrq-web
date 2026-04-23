'use client'

import { useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Job, Proposal } from '@/lib/types'
import { JobCard } from '@/components/jobs/job-card'
import { JobPanel } from '@/components/jobs/job-panel'
import { PainelLateral } from '@/components/layout/painel-lateral'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Props {
  jobs: Job[]
  selectedJobId: number | null
  selectedProposalId: number | null
  selectedJob: Job | null
  proposals: Proposal[]
}

export function ClienteJobsView({ jobs, selectedJobId, selectedProposalId, selectedJob, proposals }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const selectJob = useCallback((id: number) => {
    router.push(`${pathname}?jobId=${id}`)
  }, [router, pathname])

  const closePanel = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-dark">Meus Serviços</h1>
        <Link href="/cliente/jobs/criar">
          <Button size="sm">+ Novo Serviço</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-secondary bg-white py-20 text-center">
          <p className="text-text-mid">Nenhum serviço ainda</p>
          <Link href="/cliente/jobs/criar" className="mt-4">
            <Button>Criar meu primeiro serviço</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              selected={job.id === selectedJobId}
              onClick={() => selectJob(job.id)}
            />
          ))}
        </div>
      )}

      <PainelLateral open={!!selectedJob} onClose={closePanel}>
        {selectedJob && (
          <JobPanel
            job={selectedJob}
            proposals={proposals}
            selectedProposalId={selectedProposalId}
            onClose={closePanel}
          />
        )}
      </PainelLateral>
    </div>
  )
}
