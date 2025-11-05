import { defineExtension, ParagraphNode, TextNode } from 'lexical'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown'
import { EquationNode } from '../node/EquationNode'

const MarkdownExtension = defineExtension({
  name: 'MarkdownExtension',
  namespace: 'MarkdownExtension',
  dependencies: [],
  nodes: () => [
    ParagraphNode,
    TextNode,
    HeadingNode,
    LinkNode,
    AutoLinkNode,
    ListNode,
    QuoteNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    EquationNode,
  ],
  config: {
    transformers: TRANSFORMERS,
  },
  afterRegistration: (editor, config) => {
    return registerMarkdownShortcuts(editor, config.transformers)
  },
})

export default MarkdownExtension
