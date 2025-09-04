import fs from "node:fs/promises";
import { rehype } from "rehype";
import rehypeSlug from "./plugin";

const document = await fs.readFile("./add-id-to-hype/input.html", "utf8");

const file = await rehype()
  .data("settings", { fragment: true })
  .use(rehypeSlug)
  .process(document);

await fs.writeFile("./add-id-to-hype/output.html", String(file));
