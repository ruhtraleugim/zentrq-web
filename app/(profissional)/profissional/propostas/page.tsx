import { apiGet } from '@/lib/api-server'
import type { Proposal } from '@/lib/types'
import { ProposalStatusBadge } from '@/components/ui/badge'

export default async function MinhasPropostasPage() {
  const proposals = await apiGet<Proposal[]>('/proposals/me').catch(() => [] as Proposal[])

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Minhas Propostas</h1>

      {proposals.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-secondary bg-white py-16 text-center">
          <p className="text-text-mid">Nenhuma proposta enviada ainda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {proposals.map(p => (
            <div key={p.id} className="rounded-xl border border-surface-secondary bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-dark">Proposta #{p.id}</span>
                <ProposalStatusBadge status={p.status} />
              </div>
              <div className="mt-1 flex gap-4 text-xs text-text-mid">
                <span>R$ {Number(p.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                {p.estimatedTime && <span>Prazo: {p.estimatedTime}</span>}
                <span>{new Date(p.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
