'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { markdownToHtml } from '../lib/markdown'

// TODO: 使用 unified 和 remark 和 rehype 实现 markdown 到 HTML 的转换
export function UnifiedEditor() {
  const [markdown, setMarkdown] = useState(`# Markdown Editor

Welcome to the **Unified Markdown Editor**!

## Features

- ✅ Real-time preview
- ✅ GitHub Flavored Markdown support
- ✅ Syntax highlighting
- ✅ Clean interface

## Examples

### Code Blocks

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Lists

1. First item
2. Second item
   - Nested item
   - Another nested item

### Links and Images

[Visit GitHub](https://github.com)

> **Note**: This is a blockquote
>
> You can have multiple lines

---

### Tables

| Feature | Status |
|---------|--------|
| Editor | ✅ |
| Preview | ✅ |
| Export | 🚧 |

### Task Lists

- [x] Basic editing
- [ ] Live preview
- [ ] Export to PDF
- [ ] Custom themes`)

  const [htmlPreview, setHtmlPreview] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value)
    },
    [],
  )

  // Process markdown whenever it changes
  useEffect(() => {
    const processMarkdown = async () => {
      setIsProcessing(true)
      try {
        const html = await markdownToHtml(markdown)
        setHtmlPreview(html)
      } catch (error) {
        console.error('Error processing markdown:', error)
        setHtmlPreview(`<div class="prose prose-gray max-w-none">
          <p class="text-red-500">Error processing markdown. Check console for details.</p>
        </div>`)
      } finally {
        setIsProcessing(false)
      }
    }

    // Debounce processing to avoid excessive re-renders
    const timeoutId = setTimeout(processMarkdown, 300)
    return () => clearTimeout(timeoutId)
  }, [markdown])

  // Initial processing
  useEffect(() => {
    markdownToHtml(markdown).then(setHtmlPreview)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full flex-1 flex-col bg-gray-50">
      {/* Header */}
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

      {/* Editor and Preview */}
      <main className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <section className="flex w-1/2 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <h2 className="text-sm font-medium text-gray-700">
                  Markdown Source
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMarkdown('')}
                  className="text-xs text-gray-500 transition-colors hover:text-gray-700"
                  title="Clear content"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              value={markdown}
              onChange={handleMarkdownChange}
              className="focus:ring-opacity-50 absolute inset-0 h-full w-full resize-none bg-transparent p-6 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Write your markdown here...

# Hello World

This is a **markdown** editor with live preview.

```javascript
console.log('Hello, unified!');
```

- [ ] Try editing this text
- [x] See changes in real-time"
              spellCheck={false}
            />
          </div>
        </section>

        {/* Preview Panel */}
        <section className="flex w-1/2 flex-col bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <h2 className="text-sm font-medium text-gray-700">Preview</h2>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-500">Processing...</span>
                </div>
              )}
            </div>
          </div>
          <div
            className="prose prose-gray prose-headings:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 max-w-none flex-1 overflow-auto p-6"
            dangerouslySetInnerHTML={{
              __html:
                htmlPreview ||
                '<p class="text-gray-400 italic">Start typing to see preview...</p>',
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Powered by unified + remark + rehype</span>
          <div className="flex items-center gap-4">
            <span>GitHub Flavored Markdown</span>
            <span>•</span>
            <span>Syntax Highlighting</span>
            <span>•</span>
            <span>Auto-save</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
