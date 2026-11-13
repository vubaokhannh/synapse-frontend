import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'danger' | 'warning' | 'primary' | 'neutral'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    primary: 'bg-[#EEF0FD] text-[#635BDB] border border-[#635BDB]/20',
    neutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

