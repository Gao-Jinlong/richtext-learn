import { forwardRef } from 'react'
import { FileText } from 'lucide-react'
import { PanelHeader } from './PanelHeader'
import { ContentEditable, ContentEditableRef } from './ContentEditable'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
}

const placeholderText = `Write your markdown here...

# Hello World

This is a **markdown** editor with live preview.

\`\`\`javascript
console.log('Hello, unified!');
\`\`\`

- [ ] Try editing this text
- [x] See changes in real-time`

export const MarkdownEditor = forwardRef<ContentEditableRef, MarkdownEditorProps>(
  ({ value, onChange, onClear, placeholder, ...props }, ref) => {
    return (
      <section className="flex h-full w-1/2 flex-1 flex-col border-r border-gray-200 bg-white">
        <PanelHeader
          title="Markdown Source"
          icon={<FileText className="h-4 w-4 text-gray-600" />}
          actions={
            onClear && (
              <button
                className="cursor-pointer text-xs text-gray-500 hover:text-gray-700"
                onClick={onClear}
                title="Clear content"
                type="button"
              >
                Clear
              </button>
            )
          }
        />
        <div className="relative flex-1 overflow-auto">
          <ContentEditable
            ref={ref}
            initialValue={value}
            onChange={onChange}
            placeholder={placeholder || placeholderText}
            className="h-full w-full resize-none border-none bg-transparent p-6 font-mono text-sm leading-relaxed shadow-none"
            {...props}
          />
        </div>
      </section>
    )
  },
)

MarkdownEditor.displayName = 'MarkdownEditor'
