import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  }

  const variantStyles = {
    primary: 'bg-[#635BDB] text-white hover:bg-[#534AC9] focus:ring-[#635BDB]/50 shadow-sm shadow-[#635BDB]/20',
    secondary: 'bg-[#EEF0FD] text-[#635BDB] hover:bg-[#E0E4FC] focus:ring-[#635BDB]/30',
    outline: 'bg-white border border-[#E2E8F0] text-[#172033] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] focus:ring-[#635BDB]/20 shadow-sm',
    ghost: 'bg-transparent text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] focus:ring-transparent',
    danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 focus:ring-rose-500/30',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-0.5 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}

