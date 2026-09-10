/**
 * Converte fotos e vídeos de campanha do servidor para o formato do site.
 *
 *   node scripts/midia-campanha.mjs [manifesto.json]
 *
 * O manifesto (padrão: scripts/midia-campanha.json) tem duas listas:
 *
 *   "fotos":  { "origem": "<caminho>", "saida": "colecoes/delicias-hero.jpg",
 *               "largura": 2400, "proporcao": "16/9" | "4/5" | "3/4" | null,
 *               "foco": "attention" | "entropy" | "center" | "top" }
 *   "videos": { "origem": "<caminho>", "saida": "campanha/teaser",
 *               "inicio": 0, "duracao": 12, "altura": 1280 }
 *
 * Fotos vão para public/images/<saida>. Vídeos geram public/videos/<saida>.mp4
 * (H.264, sem áudio, para tocar em silêncio e em laço) e um pôster .jpg com o
 * primeiro quadro, usado como `poster` enquanto o vídeo carrega.
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
const { fotos = [], videos = [] } = JSON.parse(readFileSync(manifesto, "utf8"));

const PROPORCOES = { "16/9": 16 / 9, "3/2": 3 / 2, "4/5": 4 / 5, "3/4": 3 / 4, "2/3": 2 / 3, "9/16": 9 / 16, "1/1": 1 };
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
  if (f.proporcao) {
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
      ...(v.semAudio ? ["-an"] : ["-c:a", "aac", "-b:a", "128k", "-ac", "2"]),
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
  execFileSync(ffmpegPath, ["-y", "-v", "error", ...recorte, "-i", v.origem, "-vframes", "1", "-vf", `scale=-2:${Math.round(altura / 2)}`, "-q:v", "4", poster], {
    stdio: ["ignore", "inherit", "inherit"],
  });
  console.log(`vídeo  ${v.saida}.mp4  ${mb(destino)} MB  (pôster ${mb(poster)} MB)`);
}
