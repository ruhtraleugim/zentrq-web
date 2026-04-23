import { SidebarCliente } from '@/components/layout/sidebar-cliente'

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarCliente />
      <main className="flex-1 overflow-y-auto bg-surface p-6">
        {children}
      </main>
    </div>
  )
}
