import { apiGet } from '@/lib/api-server'
import type { Profissional } from '@/lib/types'
import { PerfilView } from './perfil-view'

export default async function PerfilPage() {
  const [me, professionals] = await Promise.all([
    apiGet<{ id: number }>('/users/me').catch(() => null),
    apiGet<Profissional[]>('/professionals').catch(() => [] as Profissional[]),
  ])
  const profissional = me ? (professionals.find(p => p.id === me.id) ?? null) : null
  return <PerfilView initial={profissional} />
}
