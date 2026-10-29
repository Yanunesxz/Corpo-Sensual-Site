import { llmsTxt } from "@/lib/llms";

/** O site em texto para os assistentes de IA (ver src/lib/llms.ts). Refeito a cada hora. */
export const revalidate = 3600;

export async function GET() {
  return new Response(await llmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
