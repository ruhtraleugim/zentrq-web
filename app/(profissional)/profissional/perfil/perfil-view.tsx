'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Profissional, State, City, Skill } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/contexts/toast-context'

export function PerfilView({ initial }: { initial: Profissional | null }) {
  const router = useRouter()
  const { addToast } = useToast()

  const [available, setAvailable] = useState(initial?.isAvailableNow ?? false)
  const [toggling, setToggling] = useState(false)

  const [states, setStates] = useState<State[]>([])
  const [allSkills, setAllSkills] = useState<Skill[]>([])
  const [selectedStateId, setSelectedStateId] = useState<string>('')
  const [stateCities, setStateCities] = useState<City[]>([])

  const [cep, setCep] = useState(initial?.cep ?? '')
  const [cityIds, setCityIds] = useState<number[]>(initial?.citiesServed.map(c => c.id) ?? [])
  const [skillIds, setSkillIds] = useState<number[]>(initial?.skills.map(s => s.id) ?? [])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/states').then(r => r.json()).then(setStates).catch(() => {})
    fetch('/api/skills').then(r => r.json()).then(setAllSkills).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedStateId) { setStateCities([]); return }
    fetch(`/api/states/${selectedStateId}/cities`).then(r => r.json()).then(setStateCities).catch(() => {})
  }, [selectedStateId])

  function toggleCity(id: number) {
    setCityIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  function toggleSkill(id: number) {
    setSkillIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  async function toggleAvailability() {
    const prev = available
    setAvailable(!prev)
    setToggling(true)
    try {
      const res = await fetch('/api/professionals/availability', { method: 'PUT' })
      if (!res.ok) {
        setAvailable(prev)
        addToast('Erro ao atualizar disponibilidade', 'error')
      } else {
        addToast(!prev ? 'Disponível agora' : 'Indisponível', 'success')
        router.refresh()
      }
    } catch {
      setAvailable(prev)
      addToast('Sem conexão', 'error')
    } finally {
      setToggling(false)
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (cityIds.length === 0) { addToast('Selecione ao menos uma cidade', 'error'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/professionals/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep, cityIds, skillIds }),
      })
      if (!res.ok) {
        addToast('Erro ao salvar perfil', 'error')
        return
      }
      addToast('Perfil atualizado!', 'success')
      router.refresh()
    } catch {
      addToast('Sem conexão', 'error')
    } finally {
      setSaving(false)
    }
  }

  const selectedCities = initial?.citiesServed ?? []

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold text-text-dark">Meu Perfil</h1>

      {/* Availability toggle */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-surface-secondary bg-white p-4">
        <div>
          <p className="text-sm font-medium text-text-dark">Disponível agora</p>
          <p className="text-xs text-text-mid">Ativo para receber jobs urgentes</p>
        </div>
        <button
          onClick={toggleAvailability}
          disabled={toggling}
          aria-label={available ? 'Desativar disponibilidade' : 'Ativar disponibilidade'}
          aria-pressed={available}
          className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${available ? 'bg-brand-base' : 'bg-surface-secondary'}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${available ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Profile form */}
      <form onSubmit={saveProfile} className="flex flex-col gap-4">
        <Input
          label="CEP"
          value={cep}
          onChange={e => setCep(e.target.value)}
          placeholder="00000-000"
          required
        />

        {/* City picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-dark">Cidades atendidas</label>

          {/* Currently selected cities */}
          {cityIds.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cityIds.map(id => {
                const name =
                  stateCities.find(c => c.id === id)?.name ??
                  selectedCities.find(c => c.id === id)?.name ??
                  `Cidade ${id}`
                return (
                  <span key={id} className="flex items-center gap-1 rounded-full bg-brand-base/10 px-2 py-0.5 text-xs text-brand-base">
                    {name}
                    <button type="button" onClick={() => toggleCity(id)} className="leading-none hover:text-red-500">×</button>
                  </span>
                )
              })}
            </div>
          )}

          <div className="flex gap-2">
            <select
              value={selectedStateId}
              onChange={e => setSelectedStateId(e.target.value)}
              className="flex-1 rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-base"
            >
              <option value="">Estado</option>
              {states.map(s => (
                <option key={s.id} value={s.id}>{s.uf}</option>
              ))}
            </select>
            <select
              value=""
              onChange={e => { if (e.target.value) toggleCity(Number(e.target.value)) }}
              disabled={!selectedStateId || stateCities.length === 0}
              className="flex-1 rounded-lg border border-surface-secondary px-3 py-2 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-base disabled:opacity-50"
            >
              <option value="">{selectedStateId ? 'Adicionar cidade' : 'Selecione o estado'}</option>
              {stateCities.filter(c => !cityIds.includes(c.id)).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          {cityIds.length === 0 && <span className="text-xs text-text-mid">Selecione ao menos uma cidade</span>}
        </div>

        {/* Skill picker */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-dark">Especialidades</label>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggleSkill(skill.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  skillIds.includes(skill.id)
                    ? 'border-brand-base bg-brand-base text-white'
                    : 'border-surface-secondary text-text-mid hover:border-brand-base/50 hover:text-text-dark'
                }`}
              >
                {skill.name}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={saving} disabled={saving}>
          Salvar perfil
        </Button>
      </form>

      {initial && (
        <div className="mt-6 rounded-lg border border-surface-secondary bg-white p-4 text-sm text-text-mid">
          <p>⭐ Rating: {(initial.rating ?? 0).toFixed(1)} · {initial.jobsCompleted} serviços concluídos</p>
        </div>
      )}
    </div>
  )
}
