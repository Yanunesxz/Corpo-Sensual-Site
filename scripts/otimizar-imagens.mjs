/**
 * Reduz as imagens de public/images para no máximo 1600px de largura,
 * recomprimindo JPEG e PNG. Rode depois de adicionar fotos novas:
 *
 *   npm run imagens
 *
 * Arquivos já pequenos são mantidos como estão.
 */
import sharp from "sharp";
import { readdirSync, statSync, renameSync, unlinkSync } from "node:fs";
import { join, extname } from "node:path";

const dir = "public/images";
const MAX_WIDTH = 1600;
const KEEP_BELOW_BYTES = 400_000;

const kb = (n) => `${Math.round(n / 1024)} KB`;

for (const file of readdirSync(dir)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const path = join(dir, file);
  const before = statSync(path).size;
  const meta = await sharp(path).metadata();
  const width = meta.width ?? 0;

  if (width <= MAX_WIDTH && before < KEEP_BELOW_BYTES) {
    console.log(`${file}: mantido (${width}x${meta.height}, ${kb(before)})`);
    continue;
  }

  const tmp = `${path}.tmp`;
  const pipeline = sharp(path).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });
  if (ext === ".png") await pipeline.png({ compressionLevel: 9 }).toFile(tmp);
  else if (ext === ".webp") await pipeline.webp({ quality: 82 }).toFile(tmp);
  else await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(tmp);

  const after = statSync(tmp).size;
  if (after >= before) {
    // Recomprimir não ajudou: mantém o original.
    unlinkSync(tmp);
    const dica = ext === ".png" && !meta.hasAlpha ? " (foto em PNG: salve como JPG para ficar bem menor)" : "";
    console.log(`${file}: mantido (${width}x${meta.height}, ${kb(before)})${dica}`);
    continue;
  }
  renameSync(tmp, path);

  const meta2 = await sharp(path).metadata();
  console.log(`${file}: ${width}x${meta.height} ${kb(before)} -> ${meta2.width}x${meta2.height} ${kb(after)}`);
}
