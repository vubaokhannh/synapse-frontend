import React, { useState } from 'react'
import { 
  Play, 
  Zap, 
  Clock, 
  Globe, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Search, 
  TrendingUp, 
  Activity, 
  Check, 
  Sparkles,
  Bot,
  Filter,
  PieChart as PieChartIcon,
  Plus
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Card, Button, Badge, Modal, Input } from '../components/ui'
import { AppHeader } from '../components/layout/AppHeader'
import { useNavigate } from 'react-router-dom'

export interface WorkflowItem {
  id: string
  name: string
  description: string
  triggerType: 'webhook' | 'cron' | 'event'
  triggerLabel: string
  nodesCount: number
  status: 'active' | 'draft'
  lastRunStatus: 'success' | 'failed' | 'never'
  lastRunTime: string
  executionCount: number
}

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'Lead Webhook to CRM & Slack',
    description: 'Nhận lead từ landing page, lọc dữ liệu và đồng bộ vào HubSpot',
    triggerType: 'webhook',
    triggerLabel: 'POST /v1/incoming-lead',
    nodesCount: 4,
    status: 'active',
    lastRunStatus: 'success',
    lastRunTime: '2 phút trước',
    executionCount: 642,
  },
  {
    id: 'wf-2',
    name: 'Daily Sales Report AI Summary',
    description: 'Truy vấn Postgres lúc 08:00 AM và dùng GPT tóm tắt KPI',
    triggerType: 'cron',
    triggerLabel: 'Cron (08:00 AM)',
    nodesCount: 5,
    status: 'active',
    lastRunStatus: 'success',
    lastRunTime: '1 giờ trước',
    executionCount: 28,
  },
  {
    id: 'wf-3',
    name: 'Customer Support Escalation',
    description: 'Phát hiện khiếu nại nghiêm trọng và tự động phân luồng tới kỹ sư',
    triggerType: 'event',
    triggerLabel: 'Stripe Webhook',
    nodesCount: 3,
    status: 'active',
    lastRunStatus: 'failed',
    lastRunTime: '3 giờ trước',
    executionCount: 114,
  },
  {
    id: 'wf-4',
    name: 'GitHub Issue Auto-Triage & Assign',
    description: 'Tự động phân loại nhãn và gán reviewer cho các issue mới',
    triggerType: 'webhook',
    triggerLabel: 'GitHub issues.opened',
    nodesCount: 3,
    status: 'active',
    lastRunStatus: 'success',
    lastRunTime: '5 giờ trước',
    executionCount: 215,
  },
  {
    id: 'wf-5',
    name: 'New User Onboarding Campaign',
    description: 'Gửi chuỗi email hướng dẫn tự động sau khi đăng ký tài khoản',
    triggerType: 'event',
    triggerLabel: 'Supabase auth.insert',
    nodesCount: 4,
    status: 'active',
    lastRunStatus: 'success',
    lastRunTime: '10 phút trước',
    executionCount: 421,
  },
  {
    id: 'wf-6',
    name: 'Weekly Database Backup & S3 Archive',
    description: 'Tạo snapshot dữ liệu định kỳ mỗi Chủ Nhật và upload lên AWS S3',
    triggerType: 'cron',
    triggerLabel: 'Cron (CN 00:00)',
    nodesCount: 3,
    status: 'draft',
    lastRunStatus: 'never',
    lastRunTime: 'Chưa chạy',
    executionCount: 0,
  },
]

const EXECUTION_TIMELINE_DATA = [
  { date: '07/11 (T2)', success: 178, failed: 2 },
  { date: '08/11 (T3)', success: 241, failed: 4 },
  { date: '09/11 (T4)', success: 209, failed: 1 },
  { date: '10/11 (T5)', success: 284, failed: 6 },
  { date: '11/11 (T6)', success: 257, failed: 3 },
  { date: '12/11 (T7)', success: 119, failed: 1 },
  { date: '13/11 (CN)', success: 152, failed: 3 },
]

const TRIGGER_DISTRIBUTION = [
  { name: 'Webhooks', value: 875, color: '#635BDB' },
  { name: 'Cron / Schedule', value: 342, color: '#38BDF8' },
  { name: 'Events & DB', value: 203, color: '#A855F7' },
]

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all')
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d'>('7d')
  const [runningWfId, setRunningWfId] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newWfName, setNewWfName] = useState('')
  const [newWfDesc, setNewWfDesc] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('blank')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleToggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id === id) {
          const nextStatus = wf.status === 'active' ? 'draft' : 'active'
          showToast(`Đã chuyển "${wf.name}" sang trạng thái ${nextStatus.toUpperCase()}`)
          return { ...wf, status: nextStatus }
        }
        return wf
      })
    )
  }

  const handleDuplicate = (wf: WorkflowItem) => {
    const newWf: WorkflowItem = {
      ...wf,
      id: `wf-${Date.now()}`,
      name: `${wf.name} (Copy)`,
      status: 'draft',
      executionCount: 0,
      lastRunStatus: 'never',
      lastRunTime: 'Chưa chạy',
    }
    setWorkflows([newWf, ...workflows])
    showToast(`Đã nhân bản thành công "${wf.name}"`)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa workflow "${name}"?`)) {
      setWorkflows((prev) => prev.filter((wf) => wf.id !== id))
      showToast(`Đã xóa workflow "${name}"`)
    }
  }

  const handleRunNow = (id: string, name: string) => {
    setRunningWfId(id)
    setTimeout(() => {
      setRunningWfId(null)
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === id
            ? {
                ...wf,
                executionCount: wf.executionCount + 1,
                lastRunStatus: 'success',
                lastRunTime: 'Vừa xong',
              }
            : wf
        )
      )
      showToast(`Thực thi thành công pipeline "${name}" trong 235ms (200 OK)`)
    }, 800)
  }

  const handleCreateSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault()
    const trimmedName = newWfName.trim()
    if (!trimmedName) return

    const templateConfigs: Record<string, { label: string; type: 'webhook' | 'cron' | 'event'; nodes: number; desc: string }> = {
      blank: { label: 'POST /v1/custom-webhook', type: 'webhook', nodes: 2, desc: 'Workflow tùy chỉnh mới khởi tạo' },
      webhook: { label: 'POST /v1/incoming-lead', type: 'webhook', nodes: 4, desc: 'Webhook tích hợp CRM và thông báo' },
      cron: { label: 'Cron (Hàng ngày 08:00 AM)', type: 'cron', nodes: 5, desc: 'Báo cáo tự động định kỳ bằng AI' },
      condition: { label: 'Rule Engine Filter', type: 'event', nodes: 3, desc: 'Phân luồng và kiểm tra điều kiện If/Else' },
    }

    const config = templateConfigs[selectedTemplate] || templateConfigs.blank

    const newWf: WorkflowItem = {
      id: `wf-${Date.now()}`,
      name: trimmedName,
      description: newWfDesc.trim() || config.desc,
      triggerType: config.type,
      triggerLabel: config.label,
      nodesCount: config.nodes,
      status: 'active',
      lastRunStatus: 'never',
      lastRunTime: 'Vừa tạo',
      executionCount: 0,
    }

    setWorkflows([newWf, ...workflows])
    setFilterStatus('all')
    setSearchTerm('')
    setIsCreateModalOpen(false)
    setNewWfName('')
    setNewWfDesc('')
    showToast(`✓ Đã tạo thành công workflow "${newWf.name}"`)
  }

  const filteredWorkflows = workflows.filter((wf) => {
    const matchesSearch =
      wf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wf.triggerLabel.toLowerCase().includes(searchTerm.toLowerCase())
    if (filterStatus === 'all') return matchesSearch
    return matchesSearch && wf.status === filterStatus
  })

  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w) => w.status === 'active').length
  const draftWorkflows = workflows.filter((w) => w.status === 'draft').length
  const totalExecutions = workflows.reduce((acc, cur) => acc + cur.executionCount, 0)

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8FAFC] w-full">
      <AppHeader title="Dashboard" />

      <div className="w-full px-8 py-7 space-y-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-wider">Tổng Workflows</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#635BDB] flex items-center justify-center">
                  <GitBranch className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#172033]">{totalWorkflows}</span>
                <Badge variant="primary" size="sm">+2 tuần này</Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span><strong className="text-emerald-600 font-semibold">{activeWorkflows}</strong> Active</span>
              <span>•</span>
              <span><strong className="text-slate-700 font-semibold">{draftWorkflows}</strong> Draft</span>
              <span>•</span>
              <span>Cloud Sync</span>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-wider">Lượt thực thi</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#172033]">{totalExecutions.toLocaleString()}</span>
                <Badge variant="success" size="sm">+18.4%</Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>Đạt đỉnh 140 req/phút</span>
              <span className="text-emerald-600 font-medium">Auto-scaling</span>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-wider">Tỉ lệ thành công</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-emerald-600">98.6%</span>
                <Badge variant="success" size="sm">Rất tốt</Badge>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-1.5 rounded-full bg-rose-100 flex overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '98.6%' }} />
                <div className="bg-rose-500 h-full" style={{ width: '1.4%' }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  1,400 Success
                </span>
                <span className="flex items-center gap-1 text-rose-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  20 Failed
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[#64748B]">
                <span className="text-xs font-semibold uppercase tracking-wider">Độ trễ trung bình</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#172033]">320ms</span>
                <Badge variant="neutral" size="sm">Nhanh</Badge>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>p95: 580ms</span>
              <span>•</span>
              <span>p99: 940ms</span>
              <span>•</span>
              <span>Edge Ready</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 !p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-[#635BDB] flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033]">Execution Volume</h3>
                  <p className="text-xs text-[#64748B]">Lưu lượng thực thi theo thời gian thực</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] text-xs">
                <button
                  onClick={() => setChartTimeframe('7d')}
                  className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                    chartTimeframe === '7d'
                      ? 'bg-white text-[#172033] shadow-xs'
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setChartTimeframe('30d')}
                  className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                    chartTimeframe === '30d'
                      ? 'bg-white text-[#172033] shadow-xs'
                      : 'text-[#64748B] hover:text-[#172033]'
                  }`}
                >
                  30 Days
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={EXECUTION_TIMELINE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BDB" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#635BDB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-[#E2E8F0] rounded-xl p-3 shadow-xl text-left text-xs min-w-[140px]">
                            <p className="font-bold text-[#172033] mb-1.5">{label}</p>
                            <div className="space-y-1 font-mono">
                              <div className="flex items-center justify-between text-emerald-600">
                                <span>Thành công:</span>
                                <span className="font-bold">{payload[0]?.value}</span>
                              </div>
                              <div className="flex items-center justify-between text-rose-500">
                                <span>Thất bại:</span>
                                <span className="font-bold">{payload[1]?.value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="success"
                    name="Thành công"
                    stroke="#635BDB"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSuccess)"
                  />
                  <Area
                    type="monotone"
                    dataKey="failed"
                    name="Thất bại"
                    stroke="#F43F5E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorFailed)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4 mt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-[#635BDB]" />
                  Successful Executions
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded-full bg-rose-500" />
                  Failed Runs
                </span>
              </div>
            </div>
          </Card>

          <Card className="!p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <PieChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033]">Trigger Breakdown</h3>
                  <p className="text-xs text-[#64748B]">Phân bổ nguồn kích hoạt</p>
                </div>
              </div>
            </div>

            <div className="h-48 w-full flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0]
                        return (
                          <div className="bg-white border border-[#E2E8F0] rounded-xl p-2.5 shadow-xl text-left text-xs">
                            <span className="font-semibold text-[#172033] block">{data.name}</span>
                            <span className="text-[#635BDB] font-mono font-bold">{data.value} requests</span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Pie
                    data={TRIGGER_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {TRIGGER_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E2E8F0]">
              {TRIGGER_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-[#64748B]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-semibold text-[#172033]">{item.value} runs</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#172033]">Workflows</h3>
              <p className="text-xs text-[#64748B]">Quản lý danh sách các pipelines đang có</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-64">
                <Input
                  icon={<Search className="w-3.5 h-3.5" />}
                  placeholder="Tìm theo tên, trigger..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="!py-1.5 !text-xs"
                />
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8F0] shadow-2xs">
                {(['all', 'active', 'draft'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      filterStatus === status
                        ? 'bg-[#635BDB] text-white shadow-3xs'
                        : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100'
                    }`}
                  >
                    {status === 'all'
                      ? `All (${workflows.length})`
                      : status === 'active'
                      ? `Active (${activeWorkflows})`
                      : `Draft (${draftWorkflows})`}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-sm shadow-[#635BDB]/25 hover:shadow-md hover:shadow-[#635BDB]/30 transition-all font-semibold"
              >
                Create Workflow
              </Button>
            </div>
          </div>

          <Card className="!p-0 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  <tr>
                    <th className="py-3.5 px-6">Workflow Name</th>
                    <th className="py-3.5 px-6">Trigger Type</th>
                    <th className="py-3.5 px-6">Nodes</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Last Execution</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredWorkflows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-xs text-[#94A3B8]">
                        Không tìm thấy workflow nào.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkflows.map((wf) => {
                      const isRunning = runningWfId === wf.id

                      return (
                        <tr key={wf.id} className="hover:bg-[#F8FAFC]/80 transition-colors group">
                          <td className="py-4 px-6 max-w-sm">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${
                                  wf.triggerType === 'webhook'
                                    ? 'bg-amber-50 text-amber-600 border border-amber-200/50'
                                    : wf.triggerType === 'cron'
                                    ? 'bg-sky-50 text-sky-600 border border-sky-200/50'
                                    : 'bg-purple-50 text-purple-600 border border-purple-200/50'
                                }`}
                              >
                                {wf.triggerType === 'webhook' ? (
                                  <Zap className="w-4 h-4" />
                                ) : wf.triggerType === 'cron' ? (
                                  <Clock className="w-4 h-4" />
                                ) : (
                                  <Globe className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span
                                  onClick={() => navigate('/builder')}
                                  className="font-bold text-sm text-[#172033] hover:text-[#635BDB] cursor-pointer transition-colors block truncate"
                                >
                                  {wf.name}
                                </span>
                                <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                                  {wf.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span className="text-xs font-mono px-2 py-1 rounded-lg bg-slate-100 text-[#475569] border border-[#E2E8F0]">
                              {wf.triggerLabel}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-xs text-[#64748B]">
                            <span className="font-semibold text-[#172033]">{wf.nodesCount}</span> nodes
                          </td>

                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(wf.id)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                  wf.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}
                                title="Bật / Tắt"
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    wf.status === 'active' ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <span className="text-xs font-medium text-[#64748B]">
                                {wf.status === 'active' ? 'Active' : 'Draft'}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                {wf.lastRunStatus === 'success' ? (
                                  <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                                    Success
                                  </Badge>
                                ) : wf.lastRunStatus === 'failed' ? (
                                  <Badge variant="danger" size="sm" icon={<XCircle className="w-3.5 h-3.5" />}>
                                    Failed
                                  </Badge>
                                ) : (
                                  <Badge variant="neutral" size="sm">
                                    Never
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-[#94A3B8]">
                                {wf.lastRunTime} ({wf.executionCount} runs)
                              </p>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                isLoading={isRunning}
                                icon={<Play className="w-3.5 h-3.5 text-[#635BDB]" />}
                                onClick={() => handleRunNow(wf.id, wf.name)}
                              >
                                Run
                              </Button>

                              <button
                                onClick={() => navigate('/builder')}
                                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
                                title="Edit"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDuplicate(wf)}
                                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDelete(wf.id, wf.name)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Workflow"
        subtitle="Khởi tạo luồng tự động hóa mới từ đầu hoặc chọn theo mẫu"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              form="create-workflow-form"
              onClick={handleCreateSubmit}
              disabled={!newWfName.trim()}
            >
              Create Workflow
            </Button>
          </>
        }
      >
        <form id="create-workflow-form" onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Tên Workflow *"
            placeholder="Ví dụ: Stripe Payment to Discord & Email"
            value={newWfName}
            onChange={(e) => setNewWfName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              placeholder="Mô tả mục đích và luồng xử lý của workflow này..."
              value={newWfDesc}
              onChange={(e) => setNewWfDesc(e.target.value)}
              className="w-full bg-white text-[#172033] placeholder-[#94A3B8] text-sm rounded-xl border border-[#E2E8F0] focus:border-[#635BDB] focus:ring-2 focus:ring-[#635BDB]/15 hover:border-[#CBD5E1] p-3 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-2">
              Chọn Starter Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'blank',
                  title: 'Blank Canvas',
                  desc: 'Bắt đầu từ trang trắng',
                  icon: <Sparkles className="w-4 h-4 text-[#635BDB]" />,
                },
                {
                  id: 'webhook',
                  title: 'Webhook to CRM',
                  desc: 'Tích hợp POST Webhook',
                  icon: <Zap className="w-4 h-4 text-amber-500" />,
                },
                {
                  id: 'cron',
                  title: 'Daily AI Summary',
                  desc: 'Cron + OpenAI report',
                  icon: <Bot className="w-4 h-4 text-sky-500" />,
                },
                {
                  id: 'condition',
                  title: 'Lead Filtering',
                  desc: 'Phân nhánh If/Else',
                  icon: <Filter className="w-4 h-4 text-purple-500" />,
                },
              ].map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all text-left flex items-start gap-2.5 ${
                    selectedTemplate === template.id
                      ? 'border-[#635BDB] bg-[#EEF0FD]/60 shadow-xs ring-1 ring-[#635BDB]'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                    {template.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#172033]">{template.title}</p>
                    <p className="text-[11px] text-[#64748B]">{template.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#172033] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
