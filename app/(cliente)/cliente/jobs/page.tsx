import { apiGet } from '@/lib/api-server'
import type { Job, Proposal } from '@/lib/types'
import { ClienteJobsView } from './jobs-view'

export default async function ClienteJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string; proposalId?: string }>
}) {
  const { jobId, proposalId } = await searchParams
  // /jobs/me returns the authenticated client's own jobs (backend checks role and filters by clientId)
  const jobs = await apiGet<Job[]>('/jobs/me').catch(() => [] as Job[])

  let selectedJob: Job | null = null
  let proposals: Proposal[] = []

  const jobIdNum = jobId ? parseInt(jobId, 10) : NaN
  if (!isNaN(jobIdNum)) {
    selectedJob = jobs.find(j => j.id === jobIdNum) ?? null
    if (selectedJob) {
      proposals = await apiGet<Proposal[]>(`/jobs/${jobIdNum}/proposals`).catch(() => [])
    }
  }

  const proposalIdNum = proposalId ? parseInt(proposalId, 10) : NaN

  return (
    <ClienteJobsView
      jobs={jobs}
      selectedJobId={!isNaN(jobIdNum) ? jobIdNum : null}
      selectedProposalId={!isNaN(proposalIdNum) ? proposalIdNum : null}
      selectedJob={selectedJob}
      proposals={proposals}
    />
  )
}
