import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from 'lexical'
import type { JSX } from 'react'
import React from 'react'
import KatexRenderer from '../ui/KatexRenderer'

export type SerializedEquationNode = Spread<
  {
    equation: string
    inline: boolean
  },
  SerializedLexicalNode
>

const EquationComponent = React.lazy(() => import('./EquationComponent'))

export class EquationNode extends DecoratorNode<JSX.Element> {
  __equation: string
  __inline: boolean
  static getType(): string {
    return 'equation'
  }
  static clone(node: EquationNode): EquationNode {
    return new EquationNode(node.__equation, node.__inline, node.__key)
  }

  constructor(equation: string, inline?: boolean, key?: string) {
    super(key)
    this.__equation = equation
    this.__inline = inline ?? false
  }
  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(serializedNode.equation, serializedNode.inline)
  }
  createDOM(config: EditorConfig): HTMLElement {
    const element = this.__inline
      ? document.createElement('span')
      : document.createElement('div')
    element.className = config.theme.equation ?? 'editor-equation'
    return element
  }
  updateDOM(
    _prevNode: unknown,
    _dom: HTMLElement,
    _config: EditorConfig,
  ): boolean {
    return this.__inline !== (_prevNode as EquationNode).__inline
  }
  exportJSON(): SerializedEquationNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: this.getType(),
      version: 1,
    }
  }
  getTextContent(): string {
    return this.__equation
  }
  getEquation(): string {
    return this.__equation
  }
  setEquation(equation: string): void {
    const writable = this.getWritable()
    writable.__equation = equation
  }
  decorate(): null | JSX.Element {
    return (
      // TODO 实现渲染模块
      <div style={{ backgroundColor: 'red' }}>
        <KatexRenderer
          equation={this.getEquation()}
          inline={this.__inline}
          onDoubleClick={() => {}}
          key={this.getKey()}
        />
      </div>
    )
  }
}

export function $createEquationNode(
  equation: string,
  inline?: boolean,
): EquationNode {
  const equationNode = new EquationNode(equation, inline)
  return $applyNodeReplacement(equationNode)
}

export function $isEquationNode(
  node: LexicalNode | null | undefined,
): node is EquationNode {
  return node instanceof EquationNode
}
