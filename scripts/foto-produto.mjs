/**
 * Prepara a foto de uma referência para o site: enquadra a peça em 4:5
 * (1400x1750) e salva em public/images/produtos/<ref>.jpg.
 *
 *   node scripts/foto-produto.mjs <ref> <arquivo> [--recorte] [--cortar-topo=0.2] [--margem=0.05]
 *
 * <arquivo>       JPG/PNG de estúdio.
 * --recorte       para PNG com fundo transparente (pasta FUNDO TRANSPARENTE):
 *                 apara a transparência e compõe sobre branco.
 * --cortar-topo=F remove a fração F do topo antes de tudo (ex.: 0.27 para
 *                 páginas de catálogo em PDF, que trazem referência e cores).
 * --margem=F      folga em volta da peça (padrão 0.05 = 5% da altura).
 *
 * Como funciona:
 * 1. Localiza a peça na foto (recorte automático do fundo uniforme).
 * 2. Abre esse recorte até 4:5 usando os PIXELS REAIS da foto em volta. É o que
 *    evita emenda em fotos cujo fundo tem degradê (o ensaio de inverno tem).
 * 3. Só quando não há foto suficiente em volta (retratos muito estreitos) é que
 *    completa com a cor do fundo do estúdio — aí o fundo é branco liso e a
 *    emenda não aparece.
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const [ref, input, ...flags] = process.argv.slice(2);
if (!ref || !input) {
  console.error("uso: node scripts/foto-produto.mjs <ref> <arquivo> [--recorte] [--cortar-topo=0.2] [--margem=0.05]");
  process.exit(1);
}
const recorte = flags.includes("--recorte");
const cortarTopo = Number(flags.find((f) => f.startsWith("--cortar-topo="))?.split("=")[1] ?? 0);
const margem = Number(flags.find((f) => f.startsWith("--margem="))?.split("=")[1] ?? 0.05);

const W = 1400;
const H = 1750;
const RATIO = W / H;
const outDir = "public/images/produtos";
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${ref}.jpg`);

/** Cor do fundo do estúdio, pela mediana dos cantos. */
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

// 1. Prepara a origem (corte de topo, aparo da borda e recorte de transparência).
let img = sharp(input).rotate(); // rotate() sem argumento corrige a orientação do EXIF
if (cortarTopo > 0) {
  const m = await img.metadata();
  img = img.extract({ left: 0, top: Math.round(m.height * cortarTopo), width: m.width, height: Math.round(m.height * (1 - cortarTopo)) });
}
if (!recorte) {
  // Apara 2,5% de cada lado: é onde aparecem tripé, refletor e a sombra da
  // parede do estúdio em algumas fotos. Não alcança a peça.
  const m = await img.metadata();
  const dx = Math.round(m.width * 0.025);
  const dy = Math.round(m.height * 0.025);
  img = img.extract({ left: dx, top: dy, width: m.width - 2 * dx, height: m.height - 2 * dy });
}
if (recorte) img = img.trim().flatten({ background: "#ffffff" });
const base = await img.png().toBuffer();
const meta = await sharp(base).metadata();
const bg = recorte ? { r: 255, g: 255, b: 255 } : await corDoFundo(base);

// 2. Onde está a peça dentro da foto.
let caixa = { left: 0, top: 0, width: meta.width, height: meta.height };
if (!recorte) {
  try {
    const { info } = await sharp(base).trim({ background: bg, threshold: 12 }).toBuffer({ resolveWithObject: true });
    const l = -(info.trimOffsetLeft ?? 0);
    const t = -(info.trimOffsetTop ?? 0);
    const sobra = (info.width * info.height) / (meta.width * meta.height);
    if (sobra > 0.06 && info.width >= meta.width * 0.2 && info.height >= meta.height * 0.3) {
      caixa = { left: l, top: t, width: info.width, height: info.height };
    } else {
      console.warn(`  aviso: recorte automático descartado em ${ref} (sobraria ${Math.round(sobra * 100)}%)`);
    }
  } catch {
    // trim falha quando a imagem é toda de uma cor só; segue com a foto inteira
  }
}

// 3. Abre a caixa até 4:5 com os pixels reais da foto, respeitando a folga.
const folga = margem / (1 - 2 * margem);
let alvoW = caixa.width * (1 + 2 * folga);
let alvoH = caixa.height * (1 + 2 * folga);
if (alvoW / alvoH < RATIO) alvoW = alvoH * RATIO;
else alvoH = alvoW / RATIO;

const cx = caixa.left + caixa.width / 2;
const cy = caixa.top + caixa.height / 2;
const janela = {
  left: Math.round(Math.max(0, Math.min(meta.width - Math.min(alvoW, meta.width), cx - alvoW / 2))),
  top: Math.round(Math.max(0, Math.min(meta.height - Math.min(alvoH, meta.height), cy - alvoH / 2))),
  width: Math.round(Math.min(alvoW, meta.width)),
  height: Math.round(Math.min(alvoH, meta.height)),
};

const cortada = await sharp(base).extract(janela).toBuffer();
const real = (janela.width / janela.height) / RATIO; // 1 = já está em 4:5 com foto real

// 4. Redimensiona e, se a janela não alcançou 4:5, completa com a cor do fundo.
const inner = await sharp(cortada)
  .resize({ width: W, height: H, fit: "inside" })
  .toBuffer();
const im = await sharp(inner).metadata();
const left = Math.round((W - im.width) / 2);
const top = Math.round((H - im.height) / 2);
await sharp(inner)
  .extend({ top, bottom: H - im.height - top, left, right: W - im.width - left, background: bg })
  .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(out);

const kb = Math.round(statSync(out).size / 1024);
const modo = real > 0.98 && real < 1.02 ? "janela real" : `completou fundo (${Math.round((1 - im.width / W) * 100)}% lateral)`;
console.log(`${out}  ${W}x${H}  ${kb} KB  ${modo}  fundo rgb(${bg.r},${bg.g},${bg.b})`);
