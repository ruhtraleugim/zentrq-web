import { SidebarProfissional } from '@/components/layout/sidebar-profissional'

export default function ProfissionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarProfissional />
      <main className="flex-1 overflow-y-auto bg-surface p-6">
        {children}
      </main>
    </div>
  )
}
