interface EditorHeaderProps {
  markdown: string
}

export const EditorHeader = ({ markdown }: EditorHeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Unified Markdown Editor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Edit markdown with live preview powered by unified
          </p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{markdown.length} characters</span>
            <span>•</span>
            <span>{markdown.split('\n').length} lines</span>
          </div>
        </div>
      </div>
    </header>
  )
}