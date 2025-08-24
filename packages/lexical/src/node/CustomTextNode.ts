import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $applyNodeReplacement,
  $getNodeByKey,
  TextNode,
  type EditorConfig,
  type MutationListener,
} from "lexical";

export class CustomTextNode extends TextNode {
  static getType(): string {
    return "custom-text";
  }

  static clone(node: CustomTextNode): CustomTextNode {
    return new CustomTextNode(node.__text, node.__key);
  }

  createDOM(config: EditorConfig) {
    const el = super.createDOM(config);
    // el.style.color = "red";
    el.style.backgroundColor = "rgb(0, 0, 255, 0.2)";
    el.style.color = "white";
    return el;
  }
}

export function $createCustomTextNode() {
  return $applyNodeReplacement(new CustomTextNode());
}

// 监听特定类型节点更新
export function useCustomTextNodeUpdate(callback: MutationListener) {
  const [editor] = useLexicalComposerContext();

  return editor.registerMutationListener(CustomTextNode, callback, {
    skipInitialization: false,
  });
}

export function CustomTextNodeListenerPlugin() {
  useCustomTextNodeUpdate((node) => {
    console.log("🚀 ~ CustomTextNodeListenerPlugin ~ node:", node);
  });

  return null;
}
