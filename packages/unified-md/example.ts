import fs from "node:fs/promises";
import { remark } from "remark";
import remarkGemoji from "./GemojiPlugin";

const document = await fs.readFile("input.md", "utf8");

const file = await remark().use(remarkGemoji).process(document);

await fs.writeFile("output.md", String(file));
