/**
 * Prepara a foto de uma referência para o site: quadro 4:5 (1400x1750), fundo branco,
 * salva em public/images/produtos/<ref>.jpg.
 *
 *   node scripts/foto-produto.mjs <ref> <arquivo> [opções]
 *
 * Para refazer todas de uma vez, a partir do manifesto: scripts/foto-produto-lote.mjs.
 *
 * Como o quadro é montado (igual em todas as fotos, para os cartões alinharem):
 * 1. Acha a figura na foto (tudo o que não é o branco do estúdio; a sombra do chão,
 *    clara e sem cor, conta como fundo).
 * 2. O topo do cabelo fica sempre a 5,5% da altura do quadro. NUNCA apare o topo da
 *    origem: as fotos de estúdio vêm recortadas rente ao cabelo.
 * 3. Foto cortada na canela (o corte é do fotógrafo): a base da origem encosta na
 *    borda de baixo do quadro. Corpo inteiro (pés à vista): sobra 3,5% abaixo do pé.
 * 4. A figura é centrada pelo "peso" da silhueta (não pela caixa: um braço aberto
 *    empurraria o corpo para o lado).
 * 5. O que faltar em volta é completado com branco. Onde a origem acaba num fundo
 *    que não é branco puro (sombra do chão, parede), ele esmaece até o branco: não
 *    fica emenda.
 *
 * Opções:
 * --recorte        PNG com fundo transparente: compõe sobre branco antes de tudo.
 * --cortar-topo=F  remove a fração F do topo (página de catálogo em PDF com cabeçalho).
 * --aparar=E,T,D,B frações a remover de cada lado da origem (esquerda, topo, direita,
 *                  base) antes de tudo. Só para tirar tripé ou refletor da BORDA de uma
 *                  foto sem recorte; o padrão é não aparar nada.
 * --nivelar        fundo de estúdio com degradê ou cor (foto sem tratamento): estima o
 *                  fundo e leva ao branco, sem tocar na cor da peça além do balanço.
 * --base=corte|pes força o tipo da base (o padrão é detectar).
 * --centro=F       força o centro horizontal da figura, em fração da largura da origem.
 * --topo=F         força a linha do topo do cabelo, em fração da altura da origem.
 * --escala=F       multiplica a escala calculada (ex.: 0.95 para uma pose muito aberta).
 * --saida=PASTA    pasta de saída (padrão public/images/produtos).
 */
import sharp from "sharp";
import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const W = 1400;
export const H = 1750;
/** Folga acima do cabelo e abaixo do pé, em fração da altura do quadro. */
export const FOLGA_TOPO = 0.055;
export const FOLGA_PE = 0.035;
/** Respiro mínimo entre a figura e as laterais do quadro. */
const FOLGA_LADO = 0.03;

/** Fundo: claro e sem cor. O resto é figura. */
const ehFigura = (r, g, b) => {
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min < 228 || max - min > 24;
};

/** Lê a foto em tamanho de análise (1500 px de altura) e devolve as medidas da figura. */
async function medir(buffer) {
  const meta = await sharp(buffer).metadata();
  const ALT = 1500;
  const { data, info } = await sharp(buffer).resize({ height: ALT }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const linhas = new Uint32Array(h);
  const colunas = new Uint32Array(w);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      if (ehFigura(data[i], data[i + 1], data[i + 2])) {
        linhas[y]++;
        colunas[x]++;
      }
    }
  }
  const minLinha = Math.max(2, Math.round(w * 0.004));
  const minColuna = Math.max(2, Math.round(h * 0.003));
  let topo = 0;
  while (topo < h - 1 && linhas[topo] < minLinha) topo++;
  let base = h - 1;
  while (base > topo && linhas[base] < minLinha) base--;
  let esq = 0;
  while (esq < w - 1 && colunas[esq] < minColuna) esq++;
  let dir = w - 1;
  while (dir > esq && colunas[dir] < minColuna) dir--;

  // Centro de massa horizontal da silhueta.
  let soma = 0;
  let peso = 0;
  for (let x = esq; x <= dir; x++) {
    soma += x * colunas[x];
    peso += colunas[x];
  }
  const centro = peso ? soma / peso : w / 2;

  // A figura sai pela base da foto (corte na canela) ou os pés estão inteiros?
  const media = (de, ate) => {
    let s = 0;
    for (let y = de; y <= ate; y++) s += linhas[y];
    return s / (ate - de + 1) / w;
  };
  const encosta = base >= h - 3;
  const rente = media(h - 4, h - 1);
  const acima = media(Math.round(h * 0.955), Math.round(h * 0.965));
  const cortada = encosta && rente > 0.05 && rente > acima * 0.6;

  const k = meta.height / h; // análise -> origem
  return {
    largura: meta.width,
    altura: meta.height,
    topo: topo * k,
    base: encosta ? meta.height : (base + 1) * k,
    esq: esq * k,
    dir: (dir + 1) * k,
    centro: centro * k,
    cortada,
    encosta,
  };
}

/**
 * Fundo de estúdio sem tratamento (degradê, cor da parede): estima o fundo em baixa
 * resolução, preenche por baixo da figura com a vizinhança e divide a foto por ele.
 * É uma correção de campo plano: o fundo vira branco e a peça só muda pelo balanço.
 */
async function nivelarFundo(buffer) {
  const meta = await sharp(buffer).metadata();
  const w = 96;
  const h = Math.round((meta.height / meta.width) * w);
  const { data } = await sharp(buffer).resize({ width: w, height: h, fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const campo = new Float32Array(w * h * 3);
  const sabe = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    if (min >= 185 && max - min <= 34) {
      sabe[p] = 1;
      campo[p * 3] = r;
      campo[p * 3 + 1] = g;
      campo[p * 3 + 2] = b;
    }
  }
  // Tira a borda do que foi tomado como fundo (penumbra em volta da figura).
  const conhecido = Uint8Array.from(sabe);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (!sabe[y * w + x]) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < w && yy >= 0 && yy < h && !sabe[yy * w + xx]) conhecido[y * w + x] = 0;
      }
    }
  // Preenche por baixo da figura: média dos vizinhos conhecidos, de fora para dentro.
  for (;;) {
    const novos = [];
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (conhecido[p]) continue;
        let n = 0;
        let r = 0;
        let g = 0;
        let b = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue;
            const q = yy * w + xx;
            if (!conhecido[q]) continue;
            n++;
            r += campo[q * 3];
            g += campo[q * 3 + 1];
            b += campo[q * 3 + 2];
          }
        if (n) novos.push([p, r / n, g / n, b / n]);
      }
    if (!novos.length) break;
    for (const [p, r, g, b] of novos) {
      conhecido[p] = 1;
      campo[p * 3] = r;
      campo[p * 3 + 1] = g;
      campo[p * 3 + 2] = b;
    }
  }
  const pequeno = Buffer.alloc(w * h * 3);
  for (let i = 0; i < pequeno.length; i++) pequeno[i] = Math.max(1, Math.min(255, Math.round(campo[i])));
  const fundo = await sharp(pequeno, { raw: { width: w, height: h, channels: 3 } })
    .blur(3)
    .resize({ width: meta.width, height: meta.height, fit: "fill", kernel: "cubic" })
    .raw()
    .toBuffer();
  const { data: px } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  // Três níveis de sobra: o ruído que resta no fundo estoura no branco.
  for (let i = 0; i < px.length; i++) px[i] = Math.min(255, Math.round((px[i] * 255) / Math.max(1, fundo[i] - 3)));
  return sharp(px, { raw: { width: meta.width, height: meta.height, channels: 3 } }).png().toBuffer();
}

/**
 * Monta o quadro de uma referência. Devolve as medidas usadas (para o relatório do lote).
 * opcoes: { recorte, cortarTopo, aparar: [e,t,d,b], nivelar, base, centro, topo, escala, saida }
 */
export async function prepararFoto(ref, arquivo, opcoes = {}) {
  const saida = opcoes.saida ?? "public/images/produtos";
  mkdirSync(saida, { recursive: true });
  const destino = join(saida, `${ref}.jpg`);

  // 1. Origem: orientação do EXIF, transparência sobre branco, aparos pedidos.
  let img = sharp(arquivo).rotate();
  if (opcoes.recorte) img = img.flatten({ background: "#ffffff" });
  let origem = await img.toColourspace("srgb").png({ compressionLevel: 1 }).toBuffer();
  const [ae = 0, at = 0, ad = 0, ab = 0] = opcoes.aparar ?? [];
  const cortarTopo = Math.max(at, opcoes.cortarTopo ?? 0);
  if (ae || cortarTopo || ad || ab) {
    const m = await sharp(origem).metadata();
    const left = Math.round(m.width * ae);
    const top = Math.round(m.height * cortarTopo);
    origem = await sharp(origem)
      .extract({ left, top, width: m.width - left - Math.round(m.width * ad), height: m.height - top - Math.round(m.height * ab) })
      .png({ compressionLevel: 1 })
      .toBuffer();
  }
  if (opcoes.nivelar) origem = await nivelarFundo(origem);

  // 2. Medidas da figura.
  const m = await medir(origem);
  const cortada = opcoes.base ? opcoes.base === "corte" : m.cortada;
  const topo = opcoes.topo != null ? opcoes.topo * m.altura : m.topo;
  const base = cortada ? m.altura : m.base;
  const folgaTopo = FOLGA_TOPO * H;
  const folgaBase = cortada ? 0 : FOLGA_PE * H;
  let escala = ((H - folgaTopo - folgaBase) / (base - topo)) * (opcoes.escala ?? 1);
  // Pose mais larga que o quadro: reduz até caber (a base cortada deixa de encostar; avisa).
  const larguraMax = W * (1 - 2 * FOLGA_LADO);
  let aviso = "";
  if ((m.dir - m.esq) * escala > larguraMax) {
    escala = larguraMax / (m.dir - m.esq);
    aviso = "pose mais larga que o quadro: escala reduzida";
  }

  // 3. Centro: peso da silhueta, sem deixar a figura encostar na lateral.
  let centro = opcoes.centro != null ? opcoes.centro * m.largura : m.centro;
  if (opcoes.centro == null) {
    const meia = (W / 2 - FOLGA_LADO * W) / escala;
    const min = m.dir - meia; // centro mínimo para a direita caber
    const max = m.esq + meia; // centro máximo para a esquerda caber
    if (min <= max) centro = Math.min(max, Math.max(min, centro));
    else centro = (m.esq + m.dir) / 2;
  }

  // 4. Janela do quadro em coordenadas da origem e a parte dela que existe na foto.
  const jx = centro - W / 2 / escala;
  const jy = topo - folgaTopo / escala;
  const jw = W / escala;
  const jh = H / escala;
  const x0 = Math.max(0, Math.floor(jx));
  const y0 = Math.max(0, Math.floor(jy));
  const x1 = Math.min(m.largura, Math.ceil(jx + jw));
  const y1 = Math.min(m.altura, Math.ceil(jy + jh));
  const pw = Math.max(1, Math.round((x1 - x0) * escala));
  const ph = Math.max(1, Math.round((y1 - y0) * escala));
  const px = Math.round((x0 - jx) * escala);
  const py = Math.round((y0 - jy) * escala);
  const { data: parte } = await sharp(origem)
    .extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 })
    .resize({ width: pw, height: ph, fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 5. Compõe sobre branco. Nas bordas em que a origem acaba antes do quadro, o FUNDO
  //    (nunca a figura) esmaece até o branco numa faixa de 4% do quadro.
  const quadro = Buffer.alloc(W * H * 3, 255);
  const faixa = Math.round(W * 0.04);
  const falta = { esq: px > 0, dir: px + pw < W, topo: py > 0, base: py + ph < H };
  for (let y = 0; y < ph; y++) {
    const Y = y + py;
    if (Y < 0 || Y >= H) continue;
    for (let x = 0; x < pw; x++) {
      const X = x + px;
      if (X < 0 || X >= W) continue;
      const i = (y * pw + x) * 3;
      let r = parte[i];
      let g = parte[i + 1];
      let b = parte[i + 2];
      let d = faixa;
      if (falta.esq) d = Math.min(d, x);
      if (falta.dir) d = Math.min(d, pw - 1 - x);
      if (falta.topo) d = Math.min(d, y);
      if (falta.base) d = Math.min(d, ph - 1 - y);
      if (d < faixa) {
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        // Quanto é fundo: claro e sem cor. Braço ou cabelo rente à borda não esmaece.
        const claro = Math.max(0, Math.min(1, (min - 200) / 35));
        const neutro = Math.max(0, Math.min(1, (30 - (max - min)) / 14));
        const f = (1 - d / faixa) * claro * neutro;
        r += (255 - r) * f;
        g += (255 - g) * f;
        b += (255 - b) * f;
      }
      const o = (Y * W + X) * 3;
      quadro[o] = r;
      quadro[o + 1] = g;
      quadro[o + 2] = b;
    }
  }

  await sharp(quadro, { raw: { width: W, height: H, channels: 3 } })
    .jpeg({ quality: opcoes.qualidade ?? 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(destino);

  const kb = Math.round(statSync(destino).size / 1024);
  return {
    ref,
    destino,
    kb,
    base: cortada ? "corte" : "pes",
    escala: Number(escala.toFixed(3)),
    larguraFigura: Math.round((m.dir - m.esq) * escala),
    completou: Object.entries(falta).filter(([, v]) => v).map(([k]) => k).join("+"),
    aviso,
  };
}

function lerOpcoes(flags) {
  const valor = (nome) => flags.find((f) => f.startsWith(`--${nome}=`))?.split("=")[1];
  const numero = (nome) => (valor(nome) != null ? Number(valor(nome)) : undefined);
  return {
    recorte: flags.includes("--recorte"),
    nivelar: flags.includes("--nivelar"),
    cortarTopo: numero("cortar-topo"),
    aparar: valor("aparar")?.split(",").map(Number),
    base: valor("base"),
    centro: numero("centro"),
    topo: numero("topo"),
    escala: numero("escala"),
    saida: valor("saida"),
  };
}

// Uso direto pela linha de comando.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [ref, arquivo, ...flags] = process.argv.slice(2);
  if (!ref || !arquivo) {
    console.error(
      "uso: node scripts/foto-produto.mjs <ref> <arquivo> [--recorte] [--nivelar] [--aparar=E,T,D,B] [--base=corte|pes] [--centro=F] [--topo=F] [--escala=F] [--saida=PASTA]",
    );
    process.exit(1);
  }
  const r = await prepararFoto(ref, arquivo, lerOpcoes(flags));
  console.log(`${r.destino}  ${W}x${H}  ${r.kb} KB  base: ${r.base}  escala ${r.escala}  figura ${r.larguraFigura} px${r.aviso ? `  AVISO: ${r.aviso}` : ""}`);
}
