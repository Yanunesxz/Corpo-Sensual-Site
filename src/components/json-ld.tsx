/**
 * Escreve dados estruturados (JSON-LD) no HTML que o servidor entrega, num @graph só.
 * O "<" vira "<" (recomendação do Next.js): um texto vindo do banco, como o nome
 * de uma coleção, nunca fecha a tag <script> antes da hora.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": Array.isArray(data) ? data : [data],
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }} />;
}
