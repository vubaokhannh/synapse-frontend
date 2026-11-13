import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Play, 
  Save, 
  Undo2, 
  Redo2, 
  Download, 
  Check, 
  Edit3, 
  Maximize2
} from 'lucide-react'
import { Button } from '../ui/Button'

export interface BuilderHeaderProps {
  workflowName: string
  onNameChange: (newName: string) => void
  isActive: boolean
  onToggleActive: () => void
  onSave: () => void
  onExecute: () => void
  onUndo?: () => void
  onRedo?: () => void
  isExecuting?: boolean
  isSaved?: boolean
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  workflowName,
  onNameChange,
  isActive,
  onToggleActive,
  onSave,
  onExecute,
  onUndo,
  onRedo,
  isExecuting = false,
  isSaved = true,
}) => {
  const navigate = useNavigate()
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)

  return (
    <header className="h-16 shrink-0 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between select-none z-20">
      {/* Left: Back & Editable Workflow Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>

        <div className="h-6 w-[1px] bg-[#E2E8F0] shrink-0" />

        {/* Workflow Title & Status */}
        <div className="flex items-center gap-3 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={workflowName}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false)
              }}
              onChange={(e) => onNameChange(e.target.value)}
              className="text-sm font-bold text-[#172033] bg-[#F8FAFC] border border-[#635BDB] px-2.5 py-1 rounded-xl outline-none"
            />
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-2 group cursor-pointer px-2 py-1 -ml-2 rounded-xl hover:bg-slate-100/80 transition-colors"
              title="Click to rename"
            >
              <span className="text-sm font-bold text-[#172033] truncate max-w-[240px]">
                {workflowName}
              </span>
              <Edit3 className="w-3.5 h-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {/* Active / Draft toggle switch */}
          <button
            onClick={onToggleActive}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
              isActive
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                : 'bg-slate-100 text-[#64748B] border-[#E2E8F0]'
            }`}
            title="Click to switch Active/Draft"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span>{isActive ? 'Active' : 'Draft'}</span>
          </button>
        </div>
      </div>

      {/* Center: Canvas View & History Controls */}
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center border border-[#E2E8F0] rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            onClick={onUndo}
            className="p-2 text-[#64748B] hover:text-[#172033] hover:bg-slate-50 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-[#E2E8F0]" />
          <button
            onClick={onRedo}
            className="p-2 text-[#64748B] hover:text-[#172033] hover:bg-slate-50 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-xl font-mono">
          <Maximize2 className="w-3.5 h-3.5 text-[#94A3B8]" />
          <span>Canvas: 100%</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Saved status text */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748B]">
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>All changes saved</span>
            </>
          ) : (
            <span className="text-amber-600 font-medium">Unsaved changes</span>
          )}
        </div>

        {/* Export JSON */}
        <button
          className="hidden md:flex p-2 rounded-xl text-[#64748B] hover:text-[#172033] hover:bg-slate-100 transition-colors"
          title="Export Workflow JSON"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Save button */}
        <Button
          variant="outline"
          size="sm"
          icon={<Save className="w-4 h-4" />}
          onClick={onSave}
        >
          Save
        </Button>

        {/* Execute Pipeline Primary Action */}
        <Button
          size="sm"
          isLoading={isExecuting}
          icon={<Play className="w-4 h-4 fill-white" />}
          onClick={onExecute}
          className="shadow-md shadow-[#635BDB]/25"
        >
          {isExecuting ? 'Running Pipeline...' : 'Execute'}
        </Button>
      </div>
    </header>
  )
}
