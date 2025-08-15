/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  $applyNodeReplacement,
  type EditorConfig,
  ParagraphNode,
} from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  $config() {
    return this.config("custom-paragraph", { extends: ParagraphNode });
  }
  createDOM(config: EditorConfig) {
    const el = super.createDOM(config);
    el.style.backgroundColor = "rgb(255, 0, 0, 0.2)";
    return el;
  }
}

export function $createCustomParagraphNode() {
  return $applyNodeReplacement(new CustomParagraphNode());
}
