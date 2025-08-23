import { createContext, use, useEffect, useReducer, useState } from "react";
import type { EditorState, LexicalEditor, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { CustomObject } from "./customState";

const EditorStateContext = createContext<EditorState | undefined>(undefined);
function useEditorState() {
  const editorState = use(EditorStateContext);
  if (editorState === undefined) {
    throw new Error("Missing EditorStateContext");
  }
  return editorState;
}

export function CustomStateViewPlugin() {
  const [editor] = useLexicalComposerContext();
  const [editorState, setEditorState] = useState(() => editor.getEditorState());

  useEffect(() => {
    editor.registerUpdateListener(() => {
      setEditorState(editor.getEditorState());
    });
  }, [editor]);

  return (
    <EditorStateContext.Provider value={editorState}>
      <CustomStateView />
    </EditorStateContext.Provider>
  );
}

function CustomStateView() {
  const collectionState = useEditorCollectionState;

  return <div></div>;
}

interface EditorCollectionState {
  customState: CustomObject;
}

function editorCollectionReducer(
  state: EditorCollectionState,
  action: Partial<EditorCollectionState>
) {
  let nextState = { ...state, ...action };
  if (action.editor && action.editor !== state.editor) {
    nextState = initEditorCollection(nextState);
  }
  nextState.focusNodeKey = nextFocusNodeKey(nextState);
  return nextState;
}

function useEditorCollectionState() {
  const [editor] = useLexicalComposerContext();
  const editorState = useEditorState();

  const [state, dispatch] = useReducer(editorCollectionReducer);
}
