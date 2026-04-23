import type { Job } from '@/lib/types'
import { Badge, JobStatusBadge } from '@/components/ui/badge'

interface JobCardProps {
  job: Job
  selected: boolean
  onClick: () => void
}

export function JobCard({ job, selected, onClick }: JobCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-colors hover:border-brand-base/30 ${
        selected ? 'border-brand-base bg-brand-base/5' : 'border-surface-secondary bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-text-dark line-clamp-1">{job.title}</span>
        <div className="flex shrink-0 gap-1">
          {job.type === 'URGENT' && <Badge label="URGENTE" variant="urgent" />}
          <JobStatusBadge status={job.status} />
        </div>
      </div>
      <p className="mt-1 text-xs text-text-mid">{job.city.name} · {new Date(job.createdAt).toLocaleDateString('pt-BR')}</p>
    </button>
  )
}
