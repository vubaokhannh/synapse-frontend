import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm text-left transition-all duration-150
        ${hoverable ? 'hover:border-[#CBD5E1] hover:shadow-md' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

