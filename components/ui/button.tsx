import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from './spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' }
  const variants = {
    primary: 'bg-brand-base text-white hover:bg-brand-support',
    secondary: 'bg-surface-secondary text-text-dark hover:bg-surface',
    ghost: 'text-text-mid hover:text-text-dark hover:bg-surface-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
