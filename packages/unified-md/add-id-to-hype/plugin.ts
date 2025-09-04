import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import Slugger from "github-slugger";

export default function rehypeSlug() {
  return function (tree) {
    const slugger = new Slugger();

    visit(tree, "element", function (node) {
      if (
        !node.properties.id &&
        ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName)
      ) {
        const value = toString(node);
        const id = slugger.slug(value);
        console.log(id);
        node.properties.id = id;
      }
    });
  };
}
