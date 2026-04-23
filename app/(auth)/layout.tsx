import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <Link href="/" className="mb-8 text-xl font-semibold text-brand-base tracking-tight">
        ZentrQ
      </Link>
      <div className="w-full max-w-sm rounded-xl border border-surface-secondary bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  )
}
