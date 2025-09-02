import fs from "node:fs/promises";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import { read, write } from "to-vfile";
import { reporter } from "vfile-reporter";
import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import retextIndefiniteArticle from "retext-indefinite-article";

const file = await read("example.md");

await unified()
  .use(remarkParse)
  // @ts-expect-error: fine
  .use(remarkRetext, unified().use(retextEnglish).use(retextIndefiniteArticle))
  .use(remarkToc)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeDocument, { title: "Pluto" })
  .use(rehypeFormat)
  .use(rehypeStringify)
  .process(file);

console.error(reporter(file));
file.extname = ".html";
await write(file);
