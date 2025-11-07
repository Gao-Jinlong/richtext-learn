import { ReactNode } from 'react'

interface PanelHeaderProps {
  title: string
  icon: ReactNode
  actions?: ReactNode
  className?: string
}

export const PanelHeader = ({ title, icon, actions, className = "" }: PanelHeaderProps) => {
  return (
    <div className={`border-b border-gray-200 bg-gray-50 px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}