import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { registerCustomState } from "./customState";

const CustomStatePlugin = () => {
  // TODO: 自定义状态
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    registerCustomState(editor);
  }, [editor]);

  return null;
};

export default CustomStatePlugin;
