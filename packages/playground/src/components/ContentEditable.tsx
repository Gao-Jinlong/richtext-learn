import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useEffectEvent,
} from 'react'

export interface ContentEditableRef {
  getValue(): string
  setValue(value: string): void
  clear(): void
  focus(): void
  blur(): void
  getSelectedText(): string
  getSelection(): { start: number; end: number } | null
  setSelection(start: number, end: number): void
  isEmpty(): boolean
  getWordCount(): number
}

interface ContentEditableProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  initialValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export const ContentEditable = forwardRef<
  ContentEditableRef,
  ContentEditableProps
>(({ initialValue = '', onChange, placeholder, className, ...props }, ref) => {
  const [content, setContent] = useState(initialValue)
  const isComposingRef = useRef(false)
  const pendingUpdateRef = useRef<number | null>(null)

  // 合并 refs
  const mergedRef = useRef<HTMLDivElement>(null)

  // 设置初始值
  useEffect(() => {
    if (mergedRef.current && initialValue !== undefined) {
      mergedRef.current.textContent = initialValue
      setContent(initialValue)
    }
  }, []) // 仅在挂载时执行

  // 处理外部 initialValue 的变化（用于重置等场景）
  useEffect(() => {
    if (initialValue !== undefined && initialValue !== content) {
      // 只有当内容确实不同时才更新
      if (mergedRef.current && mergedRef.current.textContent !== initialValue) {
        mergedRef.current.textContent = initialValue
        setContent(initialValue)
      }
    }
  }, [initialValue])

  // 处理输入事件
  const handleInput = () => {
    if (!isComposingRef.current && mergedRef.current) {
      // 取消之前待处理的更新
      if (pendingUpdateRef.current !== null) {
        cancelAnimationFrame(pendingUpdateRef.current)
      }

      // 使用 requestAnimationFrame 延迟更新，避免频繁触发
      pendingUpdateRef.current = requestAnimationFrame(() => {
        const newValue = mergedRef.current?.textContent || ''
        setContent(newValue)
        onChange?.(newValue)
        pendingUpdateRef.current = null
      })
    }
  }
  const handleCompositionStart = useEffectEvent(() => {
    isComposingRef.current = true
  })
  const handleCompositionEnd = useEffectEvent(() => {
    isComposingRef.current = false
    handleInput()
  })

  // 处理粘贴事件，只粘贴纯文本
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()

    // 获取剪贴板中的纯文本内容
    const text = e.clipboardData.getData('text/plain')

    if (text && mergedRef.current) {
      // 获取当前光标位置
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)

        // 删除当前选中内容
        range.deleteContents()

        // 插入纯文本
        const textNode = document.createTextNode(text)
        range.insertNode(textNode)

        // 将光标移动到插入文本的末尾
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)

        // 触发输入事件以更新 value
        const newValue = mergedRef.current.textContent || ''
        setContent(newValue)
        onChange?.(newValue)
      }
    }
  }
  // 处理键盘事件（保持类似 textarea 的行为）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      (e.key === 'a' || e.key === 'A') &&
      (e.ctrlKey || e.metaKey) &&
      mergedRef.current
    ) {
      // Ctrl+A 或 Cmd+A 选中编辑器所有内容
      e.preventDefault()
      const selection = window.getSelection()
      if (selection) {
        const range = document.createRange()
        range.selectNodeContents(mergedRef.current)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      return
    } else if (e.key === 'Tab' && mergedRef.current) {
      // Tab 键处理
      e.preventDefault()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const textNode = document.createTextNode('  ')
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }

  // 暴露受控方法
  useImperativeHandle(
    ref,
    () => ({
      getValue: () => mergedRef.current?.textContent || '',

      setValue: (newValue: string) => {
        if (mergedRef.current) {
          // 保存当前光标位置
          const selection = window.getSelection()
          const range = selection?.getRangeAt(0)

          mergedRef.current.textContent = newValue
          setContent(newValue)

          // 尝试恢复光标位置
          if (range && selection && mergedRef.current.childNodes.length > 0) {
            try {
              selection.removeAllRanges()
              selection.addRange(range)
            } catch {
              // 如果恢复失败，将光标移到末尾
              const newRange = document.createRange()
              newRange.selectNodeContents(mergedRef.current)
              newRange.collapse(false)
              selection.removeAllRanges()
              selection.addRange(newRange)
            }
          }

          onChange?.(newValue)
        }
      },

      clear: () => {
        if (mergedRef.current) {
          mergedRef.current.textContent = ''
          setContent('')
          onChange?.('')
        }
      },

      focus: () => {
        mergedRef.current?.focus()
      },

      blur: () => {
        mergedRef.current?.blur()
      },

      getSelectedText: () => {
        const selection = window.getSelection()
        return selection?.toString() || ''
      },

      getSelection: () => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0 || !mergedRef.current) {
          return null
        }

        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(mergedRef.current)
        preCaretRange.setEnd(range.startContainer, range.startOffset)
        const start = preCaretRange.toString().length

        preCaretRange.setEnd(range.endContainer, range.endOffset)
        const end = preCaretRange.toString().length

        return { start, end }
      },

      setSelection: (start: number, end: number) => {
        if (!mergedRef.current) return

        const text = mergedRef.current.textContent || ''
        const clampedStart = Math.max(0, Math.min(start, text.length))
        const clampedEnd = Math.max(clampedStart, Math.min(end, text.length))

        const selection = window.getSelection()
        if (selection && mergedRef.current.firstChild) {
          const range = document.createRange()
          const textNode = mergedRef.current.firstChild as Text

          try {
            range.setStart(textNode, clampedStart)
            range.setEnd(textNode, clampedEnd)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch {
            // 如果设置失败，将光标移到末尾
            range.selectNodeContents(mergedRef.current)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
      },

      isEmpty: () => {
        const text = mergedRef.current?.textContent || ''
        return text.trim().length === 0
      },

      getWordCount: () => {
        const text = mergedRef.current?.textContent || ''
        return text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      },
    }),
    [content, onChange],
  )

  return (
    <div
      ref={mergedRef}
      contentEditable
      className={`whitespace-pre-wrap focus:outline-none [&:empty:before]:text-gray-400 [&:empty:before]:content-[attr(data-placeholder)] ${className || ''}`}
      style={{ minHeight: '100%' }}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      data-placeholder={placeholder}
      spellCheck={false}
      {...props}
    />
  )
})

ContentEditable.displayName = 'ContentEditable'
