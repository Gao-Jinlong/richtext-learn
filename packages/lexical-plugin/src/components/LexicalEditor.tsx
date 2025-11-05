import { RichTextExtension } from "@lexical/rich-text";
import { configExtension, defineExtension } from "lexical";
import TreeViewPlugin from "@/lib/lexical/plugin/TreeViewPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { useMemo } from "react";
import {
  AutoFocusExtension,
  HorizontalRuleExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import modernTheme from "@/lib/lexical/theme/ModernEditorTheme";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import MarkdownExtension from "@/lib/lexical/extensions/MarkdownExtension";
import { PLAYGROUND_TRANSFORMERS } from "@/lib/lexical/plugin/MarkdownTransformers";
import { TailwindExtension } from "@lexical/tailwind";

function onError(error: Error) {
  console.error("Lexical Editor Error:", error);
}

export function LexicalEditor() {
  const extension = useMemo(() => {
    return defineExtension({
      name: "LexicalEditor",
      namespace: "LexicalEditor",
      dependencies: [
        RichTextExtension,
        AutoFocusExtension,
        HistoryExtension,
        TailwindExtension,
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
    });
  }, []);

  return (
    <LexicalExtensionComposer extension={extension}>
      <div className="editor-wrapper">
        {/* <MarkdownPlugin /> */}
        <TreeViewPlugin />
      </div>
    </LexicalExtensionComposer>
  );
}
