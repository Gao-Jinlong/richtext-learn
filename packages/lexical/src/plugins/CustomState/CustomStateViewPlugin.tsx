import {
  createContext,
  use,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  $getNodeByKey,
  $getSelection,
  $getState,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  type EditorState,
  type LexicalEditor,
  type NodeKey,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getCustomState, customState, type CustomObject } from "./customState";

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
  const collectionState = useEditorCollectionState();
  const { editor, editorState, focusNodeKey } = collectionState;
  const editorRef = useRef(editor);
  const [obj, setObj] = useState<CustomObject | null>(null);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    editor.read(() => {
      if (focusNodeKey !== null) {
        const node = $getNodeByKey(focusNodeKey);
        if ($isTextNode(node)) {
          const obj = $getCustomState(node);
          setObj(obj);
        }
      }
    });
  }, [editor, focusNodeKey]);

  useEffect(() => {
    if (!focusNodeKey) return;

    return editor.registerUpdateListener(() => {
      editor.read(() => {
        const node = $getNodeByKey(focusNodeKey);
        if ($isTextNode(node)) {
          const obj = $getCustomState(node);
          setObj(obj);
        }
      });
    });
  }, [editor, focusNodeKey]);

  return (
    <div>
      <div>focusNodeKey: {focusNodeKey}</div>
      <div>editorState: {JSON.stringify(obj)}</div>
    </div>
  );
}

interface EditorCollectionState {
  editor: LexicalEditor;
  editorState: EditorState;
  focusNodeKey: null | NodeKey;
}

function editorCollectionReducer(
  state: EditorCollectionState,
  action: Partial<EditorCollectionState>
) {
  let nextState = { ...state, ...action };
  if (action.editor && action.editor !== state.editor) {
    nextState = {
      editor: action.editor,
      editorState: action.editorState!,
      focusNodeKey: null,
    };
  }

  nextState.focusNodeKey = nextFocusNodeKey(nextState);

  return nextState;
}

function nextFocusNodeKey(state: EditorCollectionState): null | NodeKey {
  return state.editorState.read(() => {
    const selection = $getSelection();
    return selection && $isRangeSelection(selection)
      ? selection.focus.getNode().getKey()
      : null;
  });
}

function useEditorCollectionState() {
  const [editor] = useLexicalComposerContext();
  const editorState = useEditorState();

  const [state, dispatch] = useReducer(editorCollectionReducer, {
    editor,
    editorState,
    focusNodeKey: null,
  });

  useEffect(() => {
    dispatch({ editor, editorState });
  }, [editor, editorState]);

  return state;
}
