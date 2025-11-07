import { useState, useEffect, useCallback } from 'react'
import { markdownToHtml } from '../lib/markdown'

export const useMarkdownProcessor = (
  initialMarkdown: string = '',
  debounceMs: number = 300,
) => {
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const [htmlPreview, setHtmlPreview] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMarkdownChange = useCallback((value: string) => {
    setMarkdown(value)
  }, [])

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
    const timeoutId = setTimeout(processMarkdown, debounceMs)
    return () => clearTimeout(timeoutId)
  }, [markdown, debounceMs])

  // Initial processing
  useEffect(() => {
    markdownToHtml(markdown).then(setHtmlPreview)
  }, [])

  const clearMarkdown = useCallback(() => {
    setMarkdown('')
  }, [])

  return {
    markdown,
    htmlPreview,
    isProcessing,
    handleMarkdownChange,
    clearMarkdown,
    setMarkdown,
  }
}
