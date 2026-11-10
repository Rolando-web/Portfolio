import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageRoot = path.join(root, "assets", "images");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(imageRoot).filter((file) => /\.png$/i.test(file));
let saved = 0;

for (const file of files) {
  const meta = await sharp(file).metadata();
  const before = fs.statSync(file).size;
  const targetWidth = Math.min(meta.width || 1440, 1440);
  const temp = `${file}.tmp`;

  await sharp(file)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(temp);

  const after = fs.statSync(temp).size;
  if (after < before) {
    fs.renameSync(temp, file);
    saved += before - after;
    console.log(
      `${path.relative(root, file)}  ${meta.width}x${meta.height}  ${Math.round(
        before / 1024
      )}KB -> ${Math.round(after / 1024)}KB`
    );
  } else {
    fs.unlinkSync(temp);
    console.log(
      `${path.relative(root, file)}  ${meta.width}x${meta.height}  ${Math.round(
        before / 1024
      )}KB (kept)`
    );
  }
}

console.log(`\nSaved ${Math.round(saved / 1024)}KB across ${files.length} images.`);
