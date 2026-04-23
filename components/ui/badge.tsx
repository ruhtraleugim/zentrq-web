type BadgeVariant = 'default' | 'urgent' | 'success' | 'warning' | 'danger' | 'neutral'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-brand-base/10 text-brand-base',
  urgent: 'bg-brand-accent/10 text-brand-accent font-semibold',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-600',
  neutral: 'bg-surface-secondary text-text-mid',
}

export function Badge({ label, variant = 'default' }: { label: string; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${variants[variant]}`}>
      {label}
    </span>
  )
}

export function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    OPEN: 'success',
    IN_NEGOTIATION: 'warning',
    ACCEPTED: 'default',
    IN_PROGRESS: 'default',
    COMPLETED: 'neutral',
    CANCELED: 'danger',
  }
  const labels: Record<string, string> = {
    OPEN: 'Aberto',
    IN_NEGOTIATION: 'Em negociação',
    ACCEPTED: 'Aceito',
    IN_PROGRESS: 'Em andamento',
    COMPLETED: 'Concluído',
    CANCELED: 'Cancelado',
  }
  return <Badge label={labels[status] ?? status} variant={map[status] ?? 'neutral'} />
}

export function ProposalStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    PENDING: 'warning',
    ACCEPTED: 'success',
    REJECTED: 'danger',
  }
  const labels: Record<string, string> = {
    PENDING: 'Pendente',
    ACCEPTED: 'Aceita',
    REJECTED: 'Rejeitada',
  }
  return <Badge label={labels[status] ?? status} variant={map[status] ?? 'neutral'} />
}
