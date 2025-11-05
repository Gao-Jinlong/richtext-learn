import { HeadingNode, RichTextExtension } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { QuoteNode } from '@lexical/rich-text'
import {
  configExtension,
  defineExtension,
  ParagraphNode,
  TextNode,
} from 'lexical'
import MarkdownPlugin from '@/lib/lexical/plugin/MarkdownPlugin'
import TreeViewPlugin from '@/lib/lexical/plugin/TreeViewPlugin'
import { LexicalExtensionComposer } from '@lexical/react/LexicalExtensionComposer'
import { useMemo } from 'react'
import { AutoFocusExtension, HorizontalRuleExtension } from '@lexical/extension'
import { HistoryExtension } from '@lexical/history'
import modernTheme from '@/lib/lexical/theme/ModernEditorTheme'
import { ReactExtension } from '@lexical/react/ReactExtension'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { EquationNode } from '@/lib/lexical/node/EquationNode'
import MarkdownExtension from '@/lib/lexical/extensions/MarkdownExtension'
import { PLAYGROUND_TRANSFORMERS } from '@/lib/lexical/plugin/MarkdownTransformers'

function onError(error: Error) {
  console.error('Lexical Editor Error:', error)
}

export function LexicalEditor() {
  const extension = useMemo(() => {
    return defineExtension({
      name: 'LexicalEditor',
      namespace: 'LexicalEditor',
      dependencies: [
        RichTextExtension,
        AutoFocusExtension,
        HistoryExtension,
        HorizontalRuleExtension,
        // defineExtension({
        //   name: 'MyMarkdownExtension',
        //   namespace: 'MyMarkdownExtension',
        //   dependencies: [MarkdownExtension],
        //   config: {
        //     transformers: PLAYGROUND_TRANSFORMERS,
        //   },
        //   nodes: () => [EquationNode],
        // }),
        configExtension(MarkdownExtension, {
          transformers: PLAYGROUND_TRANSFORMERS,
        }),
        configExtension(ReactExtension, {
          contentEditable: <ContentEditable className="editor-content" />,
        }),
      ],
      nodes: () => [],
      theme: modernTheme,
      onError,
    })
  }, [])

  return (
    <LexicalExtensionComposer extension={extension}>
      <div className="editor-wrapper">
        {/* <MarkdownPlugin /> */}
        <TreeViewPlugin />
      </div>
    </LexicalExtensionComposer>
  )
}
