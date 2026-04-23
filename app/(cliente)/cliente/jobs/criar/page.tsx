'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/contexts/toast-context'
import type { JobType, State, City } from '@/lib/types'

export default function CriarJobPage() {
  const router = useRouter()
  const { addToast } = useToast()

  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [selectedStateId, setSelectedStateId] = useState<string>('')

  const [form, setForm] = useState({ title: '', description: '', cityId: 0, type: 'NORMAL' as JobType })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/states').then(r => r.json()).then(setStates).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedStateId) { setCities([]); return }
    fetch(`/api/states/${selectedStateId}/cities`)
      .then(r => r.json())
      .then(setCities)
      .catch(() => {})
  }, [selectedStateId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cityId) { addToast('Selecione uma cidade', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        addToast(err.message ?? 'Erro ao criar serviço', 'error')
        return
      }
      addToast('Serviço criado!', 'success')
      router.push('/cliente/jobs')
      router.refresh()
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Novo Serviço</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Título"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Reforma de banheiro"
          required
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-dark">Descrição</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark placeholder:text-text-mid focus:outline-none focus:ring-2 focus:ring-brand-base"
            rows={4}
            placeholder="Descreva o que precisa ser feito"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-dark">Estado</label>
          <select
            value={selectedStateId}
            onChange={e => { setSelectedStateId(e.target.value); setForm(f => ({ ...f, cityId: 0 })) }}
            className="rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-base"
            required
          >
            <option value="">Selecione um estado</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.uf})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-dark">Cidade</label>
          <select
            value={form.cityId || ''}
            onChange={e => setForm(f => ({ ...f, cityId: Number(e.target.value) }))}
            className="rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-base disabled:opacity-50"
            disabled={!selectedStateId || cities.length === 0}
            required
          >
            <option value="">{selectedStateId ? 'Selecione uma cidade' : 'Selecione o estado primeiro'}</option>
            {cities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-dark">Tipo</label>
          <div className="flex rounded-lg border border-surface-secondary p-1">
            {(['NORMAL', 'URGENT'] as JobType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                  form.type === t ? 'bg-brand-base text-white' : 'text-text-mid hover:text-text-dark'
                }`}
              >
                {t === 'NORMAL' ? 'Normal' : 'Urgente'}
              </button>
            ))}
          </div>
          {form.type === 'URGENT' && (
            <p className="text-xs text-brand-accent">Urgente: notifica apenas profissionais disponíveis agora</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} disabled={loading}>
            Publicar serviço
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
