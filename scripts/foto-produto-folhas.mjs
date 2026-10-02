/**
 * Folhas de contato das fotos de produto, para conferir o lote de uma vez:
 * cabelo inteiro, topo da cabeça na mesma linha, figura centrada, base na borda.
 *
 *   node scripts/foto-produto-folhas.mjs [--pasta=public/images/produtos] [--saida=PASTA]
 *                                        [--guias] [--realce] [--colunas=8] [--linhas=2]
 *
 * Sem --saida, grava na pasta temporária do sistema (fora do repositório) e diz onde.
 *
 * --guias   risca a linha do topo do cabelo (5,5%) e o eixo central de cada quadro.
 * --realce  estica os tons claros (215 a 255 viram 0 a 255): emenda de fundo, sombra de
 *           parede, tripé e refletor que o olho não vê no branco aparecem em cinza.
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FOLGA_TOPO } from "./foto-produto.mjs";

const args = process.argv.slice(2);
const valor = (nome, padrao) => args.find((a) => a.startsWith(`--${nome}=`))?.split("=")[1] ?? padrao;
const pasta = valor("pasta", "public/images/produtos");
const saida = valor("saida", join(tmpdir(), "folhas-produto"));
const colunas = Number(valor("colunas", 8));
const linhas = Number(valor("linhas", 2));
const guias = args.includes("--guias");
const realce = args.includes("--realce");

const CW = 320;
const CH = 400;
const ROTULO = 24;
const VAO = 6;
mkdirSync(saida, { recursive: true });
const arquivos = readdirSync(pasta).filter((f) => /\.jpe?g$/i.test(f)).sort();
const porFolha = colunas * linhas;

for (let f = 0; f * porFolha < arquivos.length; f++) {
  const lote = arquivos.slice(f * porFolha, (f + 1) * porFolha);
  const pecas = [];
  for (const [i, nome] of lote.entries()) {
    const x = (i % colunas) * (CW + VAO);
    const y = Math.floor(i / colunas) * (CH + ROTULO + VAO);
    let img = sharp(join(pasta, nome)).resize({ width: CW, height: CH, fit: "fill" });
    if (realce) img = img.linear(255 / 40, -(215 * 255) / 40);
    const riscos = guias
      ? `<line x1="0" y1="${CH * FOLGA_TOPO}" x2="${CW}" y2="${CH * FOLGA_TOPO}" stroke="#e00" stroke-width="1"/><line x1="${CW / 2}" y1="0" x2="${CW / 2}" y2="${CH}" stroke="#09f" stroke-width="1" stroke-dasharray="4 6"/>`
      : "";
    const capa = Buffer.from(
      `<svg width="${CW}" height="${CH + ROTULO}" xmlns="http://www.w3.org/2000/svg"><rect width="${CW}" height="${ROTULO}" fill="#222"/><text x="6" y="17" font-family="Arial" font-size="16" fill="#fff">${nome.replace(/\.jpe?g$/i, "")}</text><g transform="translate(0 ${ROTULO})">${riscos}</g></svg>`,
    );
    pecas.push({ input: await img.toBuffer(), left: x, top: y + ROTULO }, { input: capa, left: x, top: y });
  }
  const nLinhas = Math.ceil(lote.length / colunas);
  await sharp({
    create: { width: colunas * (CW + VAO) - VAO, height: nLinhas * (CH + ROTULO + VAO) - VAO, channels: 3, background: "#c9c2ba" },
  })
    .composite(pecas)
    .jpeg({ quality: 82 })
    .toFile(join(saida, `folha-${String(f + 1).padStart(2, "0")}.jpg`));
}
console.log(`${Math.ceil(arquivos.length / porFolha)} folha(s) em ${saida}`);
