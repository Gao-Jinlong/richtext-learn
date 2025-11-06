import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

// Create a unified processor for markdown to HTML conversion
const processor = unified()
  .use(remarkParse) // Parse markdown into MDAST
  .use(remarkGfm) // Support GitHub Flavored Markdown
  .use(remarkRehype, { allowDangerousHtml: true }) // Convert MDAST to HAST
  .use(rehypeHighlight) // Syntax highlighting for code blocks
  .use(rehypeStringify, { allowDangerousHtml: true }) // Convert HAST to HTML

export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await processor.process(markdown)
    return result.toString()
  } catch (error) {
    console.error('Error processing markdown:', error)
    // Fallback to basic HTML conversion if processing fails
    return `<div class="prose prose-gray max-w-none">
      <pre><code>${markdown}</code></pre>
      <p class="text-red-500">Error processing markdown. Check console for details.</p>
    </div>`
  }
}