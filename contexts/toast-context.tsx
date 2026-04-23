'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++nextId
    setToasts(prev => {
      const updated = [...prev, { id, message, type }]
      return updated.slice(-3)
    })
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastList toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastList({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: number) => void }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          onClick={() => removeToast(t.id)}
          className={`cursor-pointer rounded-lg px-4 py-3 text-sm text-white shadow-lg transition-all ${
            t.type === 'error' ? 'bg-red-600' :
            t.type === 'success' ? 'bg-green-600' :
            'bg-brand-base'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
