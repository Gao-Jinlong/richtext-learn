interface EditorFooterProps {
  features?: string[]
  poweredBy?: string
}

export const EditorFooter = ({
  features = ['GitHub Flavored Markdown', 'Syntax Highlighting', 'Auto-save'],
  poweredBy = 'Powered by unified + remark + rehype'
}: EditorFooterProps) => {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-2">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{poweredBy}</span>
        <div className="flex items-center gap-4">
          {features.map((feature, index) => (
            <span key={feature}>
              {feature}
              {index < features.length - 1 && <span className="mx-1">•</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}