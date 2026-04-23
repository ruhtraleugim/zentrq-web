'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

const nav = [
  { href: '/cliente/jobs', label: 'Meus Serviços' },
  { href: '/cliente/jobs/criar', label: 'Novo Serviço' },
]

export function SidebarCliente() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="flex h-full w-56 flex-col border-r border-surface-secondary bg-white">
      <div className="px-4 py-5">
        <span className="text-lg font-semibold text-brand-base">ZentrQ</span>
      </div>
      <nav className="flex-1 px-2 py-2">
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? 'bg-brand-base/10 text-brand-base'
                : 'text-text-mid hover:bg-surface hover:text-text-dark'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-surface-secondary px-4 py-4">
        <p className="text-xs text-text-mid">{user?.name}</p>
        <button onClick={logout} className="mt-1 text-xs text-red-500 hover:underline">
          Sair
        </button>
      </div>
    </aside>
  )
}
