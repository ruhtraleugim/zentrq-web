import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-text-dark">{label}</label>}
      <input
        ref={ref}
        className={`rounded-lg border border-surface-secondary bg-white px-3 py-2 text-sm text-text-dark placeholder:text-text-mid focus:outline-none focus:ring-2 focus:ring-brand-base disabled:opacity-50 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  )
)
Input.displayName = 'Input'
