/**
 * Refaz as fotos de produto a partir do manifesto scripts/foto-produto.json
 * (referência -> arquivo original no servidor e ajustes daquela foto).
 *
 *   node scripts/foto-produto-lote.mjs                 todas
 *   node scripts/foto-produto-lote.mjs 0130 1043       só estas
 *   node scripts/foto-produto-lote.mjs --local=PASTA   lê os originais de uma cópia local
 *                                                      (PASTA/verao, PASTA/inverno...)
 *   node scripts/foto-produto-lote.mjs --saida=PASTA   grava em outra pasta (conferência)
 *
 * Depois de rodar, confira as folhas de contato: node scripts/foto-produto-folhas.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { prepararFoto } from "./foto-produto.mjs";

const args = process.argv.slice(2);
const valor = (nome) => args.find((a) => a.startsWith(`--${nome}=`))?.split("=")[1];
const local = valor("local");
const saida = valor("saida");
const pedidas = args.filter((a) => !a.startsWith("--"));

const manifesto = JSON.parse(readFileSync(new URL("./foto-produto.json", import.meta.url), "utf8"));
const refs = pedidas.length ? pedidas : Object.keys(manifesto.fotos).sort();

let falhas = 0;
for (const ref of refs) {
  const item = manifesto.fotos[ref];
  if (!item) {
    console.error(`${ref}: não está no manifesto`);
    falhas++;
    continue;
  }
  const { pasta, arquivo, ...opcoes } = item;
  const raiz = local ? join(local, pasta) : manifesto.pastas[pasta];
  const caminho = join(raiz, arquivo);
  if (!existsSync(caminho)) {
    console.error(`${ref}: original não encontrado em ${caminho}`);
    falhas++;
    continue;
  }
  try {
    const r = await prepararFoto(ref, caminho, { ...opcoes, saida });
    console.log(
      `${ref}  ${String(r.kb).padStart(3)} KB  ${r.base.padEnd(5)}  escala ${r.escala.toFixed(3)}  figura ${String(r.larguraFigura).padStart(4)} px  ${pasta}/${arquivo}${r.aviso ? `  AVISO: ${r.aviso}` : ""}`,
    );
  } catch (e) {
    console.error(`${ref}: ${e.message}`);
    falhas++;
  }
}
if (falhas) {
  console.error(`${falhas} foto(s) com falha`);
  process.exit(1);
}
