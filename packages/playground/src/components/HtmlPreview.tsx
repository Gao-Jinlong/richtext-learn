import { Eye } from 'lucide-react'
import { PanelHeader } from './PanelHeader'

interface HtmlPreviewProps {
  html: string
  isProcessing?: boolean
  className?: string
}

export const HtmlPreview = ({
  html,
  isProcessing = false,
  className = '',
}: HtmlPreviewProps) => {
  return (
    <section className={`flex w-1/2 flex-1 flex-col bg-white ${className}`}>
      <PanelHeader
        title="Preview"
        icon={<Eye className="h-4 w-4 text-gray-600" />}
        actions={
          isProcessing && (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-500">Processing...</span>
            </div>
          )
        }
      />
      <div
        className="prose prose-gray prose-headings:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 max-w-none flex-1 overflow-auto p-6"
        dangerouslySetInnerHTML={{
          __html:
            html ||
            '<p class="text-gray-400 italic">Start typing to see preview...</p>',
        }}
      />
    </section>
  )
}
