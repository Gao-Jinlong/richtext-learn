import fs from "node:fs/promises";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";

const document = await fs.readFile("example.md", "utf8");
const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(document);

console.log(String(file));
