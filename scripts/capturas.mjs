/**
 * Captura todas as páginas do site em celular, tablet e desktop (página inteira),
 * usando o Edge/Chrome instalado na máquina. Serve para conferir responsividade.
 *
 *   node scripts/capturas.mjs [urlBase] [pastaSaida]
 *   ex.: node scripts/capturas.mjs http://localhost:3100 capturas
 *
 * Gera <pasta>/<pagina>-<largura>.png. Celular usa emulação de toque e escala 2x.
 */
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "capturas";
mkdirSync(out, { recursive: true });

const browsers = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
];
const executablePath = browsers.find((p) => existsSync(p));
if (!executablePath) {
  console.error("Nenhum Edge/Chrome encontrado.");
  process.exit(1);
}

const pages = [
  ["home", "/"],
  ["sobre", "/sobre"],
  ["colecoes", "/colecoes"],
  ["frescor", "/colecoes/frescor"],
  ["catalogo", "/catalogo"],
  ["fabrica", "/fabrica-de-pijamas"],
  ["cashback", "/programa-cashback"],
  ["obrigado", "/obrigado?origem=catalogo"],
  ["privacidade", "/politicas/privacidade"],
  ["404", "/pagina-inexistente"],
];

const viewports = [
  { name: "375", width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "768", width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "1440", width: 1440, height: 900, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--disable-gpu"] });
try {
  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor });
    for (const [name, path] of pages) {
      const file = join(out, `${name}-${vp.name}.png`);
      if (existsSync(file) && !process.argv.includes("--forcar")) {
        console.log(`${file}  (já existe, pulei; use --forcar para refazer)`);
        continue;
      }
      await page.goto(base + path, { waitUntil: "load", timeout: 90000 });
      await new Promise((r) => setTimeout(r, 1200));
      // força o carregamento das imagens preguiçosas antes da captura
      await page.evaluate(async () => {
        const imgs = [...document.querySelectorAll("img")];
        imgs.forEach((i) => (i.loading = "eager"));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 800));
        window.scrollTo(0, 0);
        await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));
      });
      await page.screenshot({ path: file, fullPage: true });
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      console.log(`${file}  altura ${h}px${overflow ? "  ATENÇÃO: estouro horizontal" : ""}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
