import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Workflow,
  History,
  Settings,
  KeyRound,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  ExternalLink
} from 'lucide-react'

export const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none group relative ${isActive
      ? 'bg-[#EEF0FD] text-[#635BDB]'
      : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC]'
    }`

  return (
    <aside
      className={`bg-white border-r border-[#E2E8F0] flex flex-col justify-between transition-all duration-200 select-none shrink-0 z-30 h-full ${collapsed ? 'w-16' : 'w-60'
        }`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-16 border-b border-[#E2E8F0] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-[#635BDB] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#635BDB]/25">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-base tracking-tight text-[#172033]">
                Synapse
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors hidden md:block"
            title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <div>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-1.5 text-left">
                Main
              </p>
            )}
            <nav className="space-y-1">
              <NavLink to="/" end className={navItemClass} title="Dashboard">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="flex-1 text-left">Dashboard</span>}
              </NavLink>

              <NavLink to="/builder" className={navItemClass} title="Workflows">
                <Workflow className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-left">Workflows</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] font-mono font-semibold">
                      6
                    </span>
                  </div>
                )}
              </NavLink>

              <NavLink to="/executions" className={navItemClass} title="Executions">
                <History className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-left">Executions</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                )}
              </NavLink>
            </nav>
          </div>

          <div>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-3 mb-1.5 text-left">
                Configuration
              </p>
            )}
            <nav className="space-y-1">
              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''
                  }`}
                title="Credentials"
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="flex-1 text-left">Credentials</span>}
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''
                  }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="flex-1 text-left">Settings</span>}
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''
                  }`}
                title="Documentation"
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="text-left">Docs & API</span>
                    <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  )
}
