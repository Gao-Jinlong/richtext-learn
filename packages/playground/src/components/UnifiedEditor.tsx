'use client'

import { useMarkdownProcessor } from '../hooks/useMarkdownProcessor'
import { MarkdownEditor } from './MarkdownEditor'
import { HtmlPreview } from './HtmlPreview'
import { EditorHeader } from './EditorHeader'
import { EditorFooter } from './EditorFooter'

const DEFAULT_MARKDOWN = `# Markdown Editor

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
- [ ] Custom themes`

export function UnifiedEditor() {
  const {
    markdown,
    htmlPreview,
    isProcessing,
    handleMarkdownChange,
    clearMarkdown,
  } = useMarkdownProcessor(DEFAULT_MARKDOWN)

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
      <EditorHeader markdown={markdown} />

      {/* Editor and Preview */}
      <main className="box-border flex h-full flex-1 overflow-hidden border-gray-200">
        <MarkdownEditor
          value={markdown}
          onChange={handleMarkdownChange}
          onClear={clearMarkdown}
        />

        <HtmlPreview html={htmlPreview} isProcessing={isProcessing} />
      </main>

      <EditorFooter />
    </div>
  )
}
