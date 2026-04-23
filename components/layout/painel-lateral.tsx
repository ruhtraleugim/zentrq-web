'use client'

import { useEffect, ReactNode } from 'react'

interface PainelLateralProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function PainelLateral({ open, onClose, children }: PainelLateralProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay — fecha ao clicar fora */}
      <div
        className="fixed inset-0 z-20 bg-black/20"
        onClick={onClose}
        aria-hidden
      />
      {/* Painel */}
      <div className="fixed right-0 top-0 z-30 flex h-full w-96 flex-col overflow-y-auto border-l border-surface-secondary bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-surface-secondary px-4 py-3">
          <span className="text-sm font-medium text-text-dark">Detalhes</span>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-mid hover:bg-surface hover:text-text-dark"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  )
}
