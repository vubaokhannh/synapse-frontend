import React, { useState } from 'react'
import { 
  Search, 
  X, 
  Zap, 
  Globe, 
  GitBranch, 
  Bot, 
  Mail, 
  Clock, 
  Database, 
  GripVertical, 
  Plus, 
  HelpCircle,
  Layers
} from 'lucide-react'

export interface AvailableNodeItem {
  type: string
  category: 'trigger' | 'action' | 'logic' | 'ai'
  label: string
  description: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

export const AVAILABLE_NODES: AvailableNodeItem[] = [
  // Triggers
  {
    type: 'webhookTrigger',
    category: 'trigger',
    label: 'Webhook Trigger',
    description: 'Lắng nghe sự kiện HTTP POST/GET từ Stripe, GitHub...',
    icon: <Zap className="w-4 h-4" />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    type: 'scheduleTrigger',
    category: 'trigger',
    label: 'Cron / Schedule',
    description: 'Chạy định kỳ tự động theo giờ, ngày hoặc cron expression',
    icon: <Clock className="w-4 h-4" />,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
  // Actions
  {
    type: 'httpRequest',
    category: 'action',
    label: 'HTTP Request',
    description: 'Gửi request REST/JSON tới bất kỳ external API nào',
    icon: <Globe className="w-4 h-4" />,
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    type: 'sendEmail',
    category: 'action',
    label: 'Send Email',
    description: 'Gửi email thông báo tự động (SMTP / Resend)',
    icon: <Mail className="w-4 h-4" />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    type: 'databaseQuery',
    category: 'action',
    label: 'Database / SQL',
    description: 'Truy vấn Postgres, Supabase hoặc lưu trữ dữ liệu',
    icon: <Database className="w-4 h-4" />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  // Logic
  {
    type: 'conditionNode',
    category: 'logic',
    label: 'If / Else Filter',
    description: 'Kiểm tra điều kiện và rẽ nhánh luồng dữ liệu (True / False)',
    icon: <GitBranch className="w-4 h-4" />,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  // AI
  {
    type: 'aiPrompt',
    category: 'ai',
    label: 'AI / LLM Assistant',
    description: 'Dùng GPT/Claude để phân tích, tóm tắt và trích xuất dữ liệu',
    icon: <Bot className="w-4 h-4" />,
    iconBg: 'bg-[#EEF0FD]',
    iconColor: 'text-[#635BDB]',
  },
]

interface NodeSidebarProps {
  onAddNode?: (nodeType: string) => void
}

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ onAddNode }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<'all' | 'trigger' | 'action' | 'logic' | 'ai'>('all')

  const filteredNodes = AVAILABLE_NODES.filter((node) => {
    const matchesCategory = activeCategory === 'all' || node.category === activeCategory
    const matchesSearch =
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 select-none h-full z-10">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#EEF0FD] text-[#635BDB] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#172033]">Node Library</h3>
          </div>
          <span className="text-[11px] font-semibold text-[#64748B] px-2 py-0.5 rounded-full bg-slate-100">
            {AVAILABLE_NODES.length} nodes
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search triggers, actions, AI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8FAFC] text-xs text-[#172033] placeholder-[#94A3B8] rounded-xl border border-[#E2E8F0] focus:border-[#635BDB] focus:bg-white pl-8.5 pr-8 py-2 outline-none transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#172033]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-[11px] font-medium text-[#64748B]">
          {[
            { id: 'all', label: 'All' },
            { id: 'trigger', label: '⚡ Triggers' },
            { id: 'action', label: '⚙️ Actions' },
            { id: 'logic', label: '🔀 Logic' },
            { id: 'ai', label: '🤖 AI' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#635BDB] text-white font-semibold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-[#64748B] hover:text-[#172033]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredNodes.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            Không tìm thấy node nào khớp với "{searchTerm}"
          </div>
        ) : (
          filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              onClick={() => onAddNode && onAddNode(node.type)}
              className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#635BDB] hover:shadow-xs cursor-grab active:cursor-grabbing transition-all group text-left"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl ${node.iconBg} ${node.iconColor} flex items-center justify-center shrink-0 border border-black/5 shadow-2xs`}
                >
                  {node.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-[#172033] group-hover:text-[#635BDB] transition-colors truncate">
                      {node.label}
                    </p>
                  </div>
                  <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                    {node.description}
                  </p>
                </div>
              </div>

              {/* Action / Drag handle indicator */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddNode && onAddNode(node.type)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-[#635BDB] hover:bg-[#EEF0FD] transition-all"
                  title="Click to add"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <GripVertical className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#94A3B8]" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Hint */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2 text-[11px] text-[#64748B]">
        <HelpCircle className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        <span>Kéo node thả vào canvas hoặc click nút (+)</span>
      </div>
    </aside>
  )
}

