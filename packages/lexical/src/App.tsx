import "./App.css";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
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
import {
  $createCustomTextNode,
  CustomTextNode,
  CustomTextNodeListenerPlugin,
  useCustomTextNodeUpdate,
} from "./node/CustomTextNode";
import { ParagraphNode, TextNode } from "lexical";
import CustomStatePlugin from "./plugins/CustomState/CustomStatePlugin";
import { CustomStateViewPlugin } from "./plugins/CustomState/CustomStateViewPlugin";

const placeholder = "Enter some rich text...";
function App() {
  const editorConfig: InitialConfigType = {
    namespace: "Node Replacement Demo",
    nodes: [
      ParagraphNode,
      TextNode,
      CustomTextNode,
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
          <CustomStatePlugin />
          <CustomStateViewPlugin />
          <CustomTextNodeListenerPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default App;
