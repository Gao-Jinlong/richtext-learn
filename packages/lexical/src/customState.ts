import { mergeRegister } from "@lexical/utils";
import {
  $getPreviousSelection,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  $setState,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  createState,
  type LexicalEditor,
  type LexicalNode,
  type ValueOrUpdater,
} from "lexical";
import { isEqual } from "es-toolkit";
import { $forEachSelectedTextNode } from "@lexical/selection";

export type CustomObject = {
  count: number;
};

export const CUSTOM_STATE_COMMAND = createCommand<
  CustomObject | ((prevStyles: CustomObject) => CustomObject)
>("CUSTOM_STATE_COMMAND");
export const NO_CUSTOM_STATE: CustomObject = Object.freeze({ count: 0 });

export const customState = createState("custom", {
  isEqual,
  parse: (v: unknown) =>
    typeof v === "string" ? JSON.parse(v) : NO_CUSTOM_STATE,
  unparse: (v: CustomObject) => JSON.stringify(v),
});
export function $setCustomState<T extends LexicalNode>(
  node: T,
  valueOrUpdater: ValueOrUpdater<CustomObject>
) {
  return $setState(node, customState, valueOrUpdater);
}
export function $patchCustomState(
  customObjectOrCallback:
    | CustomObject
    | ((prevStyles: CustomObject) => CustomObject)
) {
  let selection = $getSelection();
  if (!selection) {
    const prevSelection = $getPreviousSelection();
    if (!prevSelection) {
      return false;
    }
    selection = prevSelection.clone();
    $setSelection(selection);
  }
  const customCallback =
    typeof customObjectOrCallback === "function"
      ? customObjectOrCallback
      : (prevStyles: CustomObject) => ({
          ...prevStyles,
          ...customObjectOrCallback,
        });

  if ($isRangeSelection(selection) && selection.isCollapsed()) {
    // 没有任何选中文本
    const node = selection.focus.getNode();
    if ($isTextNode(node)) {
      $setCustomState(node, customCallback);
    }
  } else {
    $forEachSelectedTextNode((node) => $setCustomState(node, customCallback));
  }
}

export function registerCustomState(editor: LexicalEditor) {
  return mergeRegister(
    editor.registerCommand(
      CUSTOM_STATE_COMMAND,
      (payload) => {
        console.log("CUSTOM_STATE_COMMAND", payload);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    )
  );
}
