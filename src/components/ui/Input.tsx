import React, { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#172033] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B]">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white text-[#172033] placeholder-[#94A3B8] text-sm rounded-xl border transition-all duration-150 px-3.5 py-2 outline-none
              ${icon ? 'pl-9' : ''}
              ${error 
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                : 'border-[#E2E8F0] focus:border-[#635BDB] focus:ring-2 focus:ring-[#635BDB]/15 hover:border-[#CBD5E1]'
              }
              disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-[#64748B]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

