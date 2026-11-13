import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export const AppLayout: React.FC = () => {
  return (
    <div className="h-screen w-screen bg-[#F8FAFC] text-[#172033] flex overflow-hidden font-sans">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  )
}
