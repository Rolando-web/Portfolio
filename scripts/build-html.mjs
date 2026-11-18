import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlRoot = path.join(root, "src", "html");
const templatePath = path.join(htmlRoot, "index.template.html");
const outputPath = path.join(root, "index.html");
const includePattern = /^([ \t]*)<!--\s*@include\s+([^\s]+)\s*-->[ \t]*$/gm;

function indentBlock(content, indent) {
  if (!indent) return content;
  return content
    .split("\n")
    .map((line) => (line ? indent + line : line))
    .join("\n");
}

/**
 * Compose the root index.html from src/html partials.
 * Run this after editing any file in src/html.
 */
export function buildHtml({ quiet = false } = {}) {
  const template = fs.readFileSync(templatePath, "utf8");
  const included = [];

  const output = template.replace(includePattern, (_, indent, relativePath) => {
    const file = path.resolve(htmlRoot, relativePath);

    if (!file.startsWith(htmlRoot + path.sep)) {
      throw new Error(`Include escapes src/html: ${relativePath}`);
    }
    if (!fs.existsSync(file)) {
      throw new Error(`Missing partial: ${relativePath}`);
    }

    included.push(relativePath);
    const content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").trimEnd();
    return indentBlock(content, indent);
  });

  if (output.includes("@include")) {
    throw new Error("Unresolved include remains in the generated HTML.");
  }

  fs.writeFileSync(outputPath, output.replace(/\n{3,}/g, "\n\n"), "utf8");

  if (!quiet) {
    console.log(`Built index.html from ${included.length} partials.`);
  }

  return { outputPath, included };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildHtml();
}
