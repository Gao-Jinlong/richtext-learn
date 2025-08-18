import "./App.css";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { ParagraphNode, TextNode } from "lexical";
import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import {
  $createCustomParagraphNode,
  CustomParagraphNode,
} from "./node/CustomParagraphNode";
import { $createCustomTextNode, CustomTextNode } from "./node/CustomTextNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { registerStyleState } from "./styleState";
import { useEffect } from "react";

const placeholder = "Enter some rich text...";

function StyleStatePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => registerStyleState(editor), [editor]);
  return null;
}

function App() {
  const editorConfig: InitialConfigType = {
    namespace: "Node Replacement Demo",
    nodes: [
      ParagraphNode,
      TextNode,
      CustomParagraphNode,
      {
        replace: ParagraphNode,
        with: () => $createCustomParagraphNode(),
        withKlass: CustomParagraphNode,
      },
      {
        replace: TextNode,
        with: () => $createCustomTextNode(),
        withKlass: CustomTextNode,
      },
    ],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <TreeViewPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default App;
