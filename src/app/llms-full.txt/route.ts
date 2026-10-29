import { llmsFullTxt } from "@/lib/llms";

/** A versão completa do llms.txt: perguntas, respostas e políticas por extenso. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
