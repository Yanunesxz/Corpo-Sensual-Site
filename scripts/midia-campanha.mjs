/**
 * Converte fotos e vídeos de campanha do servidor para o formato do site.
 *
 *   node scripts/midia-campanha.mjs [manifesto.json] [filtro]
 *
 * Com filtro, só converte as saídas que contêm o texto (ex.: "home/"), sem
 * regravar o resto do acervo.
 *
 * O manifesto (padrão: scripts/midia-campanha.json) tem três listas:
 *
 *   "fotos":  { "origem": "<caminho>", "saida": "colecoes/delicias-hero.jpg",
 *               "largura": 2400, "proporcao": "16/9" | "4/5" | "3/4" | null,
 *               "foco": "attention" | "entropy" | "center" | "top",
 *               "y": 0.4 }   // opcional: altura do corte, de 0 (topo) a 1 (base)
 *   "videos": { "origem": "<caminho>", "saida": "campanha/teaser",
 *               "inicio": 0, "duracao": 12, "altura": 1280,
 *               "crf": 27, "audioKbps": 128,
 *               "posterTempo": 20 }   // opcionais; posterTempo: segundo do quadro do pôster
 *   "quadros": { "origem": "<vídeo>", "tempo": 2.4, "saida": "producao/costura.jpg",
 *               "largura": 720, "proporcao": "4/5", "foco": "centre" }
 *              Foto tirada de um quadro do vídeo (etapas da produção).
 *
 * Fotos vão para public/images/<saida>. Vídeos geram public/videos/<saida>.mp4
 * (H.264; com o áudio original, salvo "semAudio": true) e um pôster .jpg com o
 * primeiro quadro, usado como `poster` enquanto o vídeo carrega. Quadros vão
 * para public/images/<saida>.
 *
 * Os arquivos de origem ficam no servidor da empresa (\\192.168.0.2). Só o
 * resultado convertido entra no repositório.
 */
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";

const manifesto = process.argv[2] ?? "scripts/midia-campanha.json";
const filtro = process.argv[3] ?? "";
const manifestoLido = JSON.parse(readFileSync(manifesto, "utf8"));
const fotos = (manifestoLido.fotos ?? []).filter((f) => f.saida.includes(filtro));
const videos = (manifestoLido.videos ?? []).filter((v) => v.saida.includes(filtro));
const quadros = (manifestoLido.quadros ?? []).filter((q) => q.saida.includes(filtro));

const PROPORCOES = { "16/9": 16 / 9, "16/10": 16 / 10, "3/2": 3 / 2, "5/4": 5 / 4, "6/5": 6 / 5, "4/5": 4 / 5, "3/4": 3 / 4, "2/3": 2 / 3, "9/16": 9 / 16, "1/1": 1 };
const mb = (p) => (statSync(p).size / 1048576).toFixed(1);

for (const f of fotos) {
  if (!existsSync(f.origem)) {
    console.error(`FALTA  ${f.origem}`);
    continue;
  }
  const destino = join("public/images", f.saida);
  mkdirSync(dirname(destino), { recursive: true });
  const largura = f.largura ?? 1600;
  let img = sharp(f.origem).rotate();
  if (f.proporcao && typeof f.y === "number") {
    // Corte na altura escolhida: a foto vai para a largura final e o quadro desce
    // até "y" (0 = topo, 1 = base). Para quando o "attention" corta o rosto.
    const r = PROPORCOES[f.proporcao];
    if (!r) throw new Error(`proporção desconhecida: ${f.proporcao}`);
    const alturaFinal = Math.round(largura / r);
    const { data, info } = await img.resize({ width: largura }).raw().toBuffer({ resolveWithObject: true });
    const top = Math.max(0, Math.min(info.height - alturaFinal, Math.round(f.y * (info.height - alturaFinal))));
    const bruto = { raw: { width: info.width, height: info.height, channels: info.channels } };
    img = sharp(data, bruto).extract({ left: 0, top, width: largura, height: alturaFinal });
  } else if (f.proporcao) {
    const r = PROPORCOES[f.proporcao];
    if (!r) throw new Error(`proporção desconhecida: ${f.proporcao}`);
    // position "attention" mantém o rosto no quadro ao cortar.
    img = img.resize({
      width: largura,
      height: Math.round(largura / r),
      fit: "cover",
      position: f.foco === "entropy" ? sharp.strategy.entropy : f.foco === "attention" ? sharp.strategy.attention : (f.foco ?? "centre"),
    });
  } else {
    img = img.resize({ width: largura, withoutEnlargement: true });
  }
  await img.jpeg({ quality: f.qualidade ?? 85, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" }).toFile(destino);
  const m = await sharp(destino).metadata();
  console.log(`foto   ${f.saida}  ${m.width}x${m.height}  ${mb(destino)} MB`);
}

for (const v of videos) {
  if (!existsSync(v.origem)) {
    console.error(`FALTA  ${v.origem}`);
    continue;
  }
  const destino = join("public/videos", `${v.saida}.mp4`);
  const poster = join("public/videos", `${v.saida}.jpg`);
  mkdirSync(dirname(destino), { recursive: true });
  const altura = v.altura ?? 1280;
  const corte = ["-vf", `scale=-2:${altura}`];
  const recorte = v.inicio ? ["-ss", String(v.inicio)] : [];
  const limite = v.duracao ? ["-t", String(v.duracao)] : [];

  execFileSync(
    ffmpegPath,
    [
      "-y", "-v", "error",
      ...recorte, "-i", v.origem, ...limite,
      ...corte,
      // O áudio original é mantido: o vídeo começa mudo (exigência do navegador
      // para tocar sozinho) e o visitante liga o som pelo botão.
      ...(v.semAudio ? ["-an"] : ["-c:a", "aac", "-b:a", `${v.audioKbps ?? 128}k`, "-ac", "2"]),
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
      "-crf", String(v.crf ?? 27),
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",   // começa a tocar antes de baixar tudo
      // Sem "fps" no manifesto mantém a taxa da fonte. Baixar 30 para 25 economiza
      // pouco e cria trepidação em cena com movimento de mão, como a da costura.
      ...(v.fps ? ["-r", String(v.fps)] : []),
      destino,
    ],
    { stdio: ["ignore", "inherit", "inherit"] },
  );
  // Pôster: o primeiro quadro, ou o de "posterTempo" (quando o primeiro repete uma foto ao lado).
  const quadroDoPoster = typeof v.posterTempo === "number" ? ["-ss", String((v.inicio ?? 0) + v.posterTempo)] : recorte;
  execFileSync(ffmpegPath, ["-y", "-v", "error", ...quadroDoPoster, "-i", v.origem, "-vframes", "1", "-vf", `scale=-2:${Math.round(altura / 2)}`, "-q:v", "4", poster], {
    stdio: ["ignore", "inherit", "inherit"],
  });
  console.log(`vídeo  ${v.saida}.mp4  ${mb(destino)} MB  (pôster ${mb(poster)} MB)`);
}

// Quadros de vídeo viram foto: o vídeo 4K da produção tem etapas que nenhuma
// foto mostra (costura, etiqueta, embalagem, fita da marca na caixa).
for (const q of quadros) {
  if (!existsSync(q.origem)) {
    console.error(`FALTA  ${q.origem}`);
    continue;
  }
  const destino = join("public/images", q.saida);
  mkdirSync(dirname(destino), { recursive: true });
  const png = execFileSync(ffmpegPath, ["-v", "error", "-ss", String(q.tempo ?? 0), "-i", q.origem, "-vframes", "1", "-f", "image2pipe", "-vcodec", "png", "-"], {
    maxBuffer: 200 * 1024 * 1024,
  });
  const largura = q.largura ?? 720;
  const r = PROPORCOES[q.proporcao ?? "4/5"];
  if (!r) throw new Error(`proporção desconhecida: ${q.proporcao}`);
  await sharp(png)
    .resize({ width: largura, height: Math.round(largura / r), fit: "cover", position: q.foco ?? "centre" })
    .jpeg({ quality: q.qualidade ?? 80, mozjpeg: true, progressive: true })
    .toFile(destino);
  console.log(`quadro ${q.saida}  ${mb(destino)} MB`);
}
