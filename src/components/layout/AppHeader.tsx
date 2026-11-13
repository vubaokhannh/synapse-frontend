import React from 'react'
import { Search, Bell, ChevronsUpDown } from 'lucide-react'

export interface AppHeaderProps {
  title?: string
  subtitle?: string
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'Dashboard',
}) => {
  return (
    <header className="h-16 shrink-0 bg-white/95 backdrop-blur-sm border-b border-[#E2E8F0] px-8 flex items-center justify-between sticky top-0 z-20 select-none w-full">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#64748B]">Workspace</span>
          <span className="text-[#CBD5E1]">/</span>
          <h1 className="text-sm font-bold text-[#172033] tracking-tight">{title}</h1>
        </div>
      </div>

      <div className="hidden md:flex items-center">
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-white rounded-xl px-3.5 py-1.5 w-72 text-xs text-[#94A3B8] transition-all cursor-pointer shadow-2xs group">
          <Search className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#635BDB] transition-colors" />
          <span className="flex-1 text-left">Search workflows, runs...</span>
          <kbd className="text-[10px] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded-md font-mono text-[#64748B] shadow-3xs">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-xl text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#635BDB] ring-2 ring-white" />
        </button>

        <div className="h-5 w-[1px] bg-[#E2E8F0]" />

        <div
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]"
          title="Vu Bao Khanh (admin@synapse.io)"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#635BDB] to-indigo-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              VK
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-[#172033] leading-tight">Vu Bao Khanh</p>
            <p className="text-[10px] text-[#64748B] leading-tight">admin@synapse.io</p>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-[#94A3B8] hidden lg:block" />
        </div>
      </div>
    </header>
  )
}
