import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { WorkflowBuilderPage } from './pages/WorkflowBuilderPage'
import { ExecutionHistoryPage } from './pages/ExecutionHistoryPage'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="builder" element={<WorkflowBuilderPage />} />
          <Route path="workflows/:id" element={<WorkflowBuilderPage />} />
          <Route path="executions" element={<ExecutionHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
