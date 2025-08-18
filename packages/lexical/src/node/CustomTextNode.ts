import { $applyNodeReplacement, TextNode, type EditorConfig } from "lexical";

export class CustomTextNode extends TextNode {
  $config() {
    return this.config("custom-text", { extends: TextNode });
  }

  createDOM(config: EditorConfig) {
    const el = super.createDOM(config);
    el.style.color = "red";
    return el;
  }
}

export function $createCustomTextNode() {
  return $applyNodeReplacement(new CustomTextNode());
}
