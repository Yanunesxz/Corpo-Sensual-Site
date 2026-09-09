/**
 * Prepara a foto de uma referência para o site: enquadra em 4:5 (1200x1500),
 * fundo na cor do estúdio, e salva em public/images/produtos/<ref>.jpg.
 *
 *   node scripts/foto-produto.mjs <ref> <arquivo> [--recorte] [--cortar-topo=0.2]
 *
 * <arquivo>       JPG/PNG. Fotos de estúdio (fundo branco) entram como estão.
 * --recorte       para PNG com fundo transparente (pasta FUNDO TRANSPARENTE):
 *                 apara as bordas e centraliza com margem sobre fundo branco.
 * --cortar-topo=F remove a fração F do topo (ex.: 0.2 para páginas de catálogo
 *                 em PDF renderizadas em PNG, que trazem o texto da referência).
 *
 * Exemplos:
 *   node scripts/foto-produto.mjs 0810 "\\\\192.168.0.2\\#Corpo Sensual\\CATALOGO\\FOTOS\\...\\0810.jpg"
 *   node scripts/foto-produto.mjs 0848 "REF 0848.png" --recorte
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const [ref, input, ...flags] = process.argv.slice(2);
if (!ref || !input) {
  console.error("uso: node scripts/foto-produto.mjs <ref> <arquivo> [--recorte] [--cortar-topo=0.2]");
  process.exit(1);
}
const recorte = flags.includes("--recorte");
const cortarTopo = Number(flags.find((f) => f.startsWith("--cortar-topo="))?.split("=")[1] ?? 0);

const W = 1200;
const H = 1500;
const outDir = "public/images/produtos";
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${ref}.jpg`);

async function corDoFundo(buffer) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const i = (y * info.width + x) * info.channels;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const pts = [px(5, 5), px(info.width - 6, 5), px(5, info.height - 6), px(info.width - 6, info.height - 6), px(Math.floor(info.width / 2), 5)];
  const med = (k) => pts.map((c) => c[k]).sort((a, b) => a - b)[2];
  return { r: med(0), g: med(1), b: med(2) };
}

// rotate() sem argumento corrige a orientação gravada pela câmera (EXIF).
let img = sharp(input).rotate();
if (cortarTopo > 0) {
  const m = await img.metadata();
  img = img.extract({ left: 0, top: Math.round(m.height * cortarTopo), width: m.width, height: Math.round(m.height * (1 - cortarTopo)) });
}
if (recorte) img = img.trim().flatten({ background: "#ffffff" });

const prep = await img.png().toBuffer();
const bg = recorte ? { r: 255, g: 255, b: 255 } : await corDoFundo(prep);
const margem = recorte ? 0.08 : 0.02;
const inner = await sharp(prep)
  .resize({ width: Math.round(W * (1 - 2 * margem)), height: Math.round(H * (1 - 2 * margem)), fit: "inside" })
  .toBuffer();
const im = await sharp(inner).metadata();
const left = Math.round((W - im.width) / 2);
const top = Math.round((H - im.height) / 2);
await sharp(inner)
  .extend({ top, bottom: H - im.height - top, left, right: W - im.width - left, background: bg })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(out);

console.log(`${out}  ${W}x${H}  ${Math.round(statSync(out).size / 1024)} KB  fundo rgb(${bg.r},${bg.g},${bg.b})`);
