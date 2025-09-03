import { findAndReplace } from "mdast-util-find-and-replace";
import { nameToEmoji } from "gemoji";
export default function remarkGemoji() {
  return function (tree) {
    findAndReplace(tree, [
      /:(\+1|[-\w]+):/g,
      function (_, $1) {
        return Object.hasOwn(nameToEmoji, $1) ? nameToEmoji[$1] : false;
      },
    ]);
  };
}
