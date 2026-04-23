import { apiGet } from '@/lib/api-server'
import type { Job } from '@/lib/types'
import { ProfissionalJobsView } from './jobs-view'

export default async function ProfissionalJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string }>
}) {
  const { jobId } = await searchParams
  // /jobs/me with a PROFISSIONAL token returns jobs filtered by citiesServed (backend branches on instanceof Profissional)
  const jobs = await apiGet<Job[]>('/jobs/me').catch(() => [] as Job[])

  const jobIdNum = jobId ? parseInt(jobId, 10) : NaN
  const selectedJob = !isNaN(jobIdNum) ? (jobs.find(j => j.id === jobIdNum) ?? null) : null

  return (
    <ProfissionalJobsView
      jobs={jobs}
      selectedJobId={!isNaN(jobIdNum) ? jobIdNum : null}
      selectedJob={selectedJob}
    />
  )
}
