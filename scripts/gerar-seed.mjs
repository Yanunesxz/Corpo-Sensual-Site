/**
 * Gera supabase/seed.sql a partir de src/data/catalogo.json.
 *   npm run seed
 * O SQL pode rodar mais de uma vez: usa "on conflict do nothing" nas tabelas
 * com slug único e só insere fotos para produtos que ainda não têm.
 */
import { readFileSync, writeFileSync } from "node:fs";

const catalogo = JSON.parse(readFileSync("src/data/catalogo.json", "utf8"));

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (xs) => `array[${xs.map(q).join(", ")}]::text[]`;
const slugify = (t) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Slugs duplicados de produto ganham a referência no final.
const seen = new Map();
const produtos = catalogo.produtos.slice().sort((a, b) => a.rank - b.rank).map((p) => {
  let slug = slugify(p.nome);
  if (seen.has(slug)) slug = `${slug}-${p.ref}`;
  seen.set(slug, true);
  return { ...p, slug };
});

const colecaoPadrao = catalogo.colecoes[0]?.slug ?? null;

let sql = `-- =============================================================================
-- GERADO por scripts/gerar-seed.mjs a partir de src/data/catalogo.json.
-- Não edite à mão: altere o JSON e rode \`npm run seed\`.
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- Produtos: referências do ranking de vendas do ERP; sort_order = posição no
-- ranking, a home mostra as 10 primeiras.
-- =============================================================================

insert into public.categories (slug, name, image_url, sort_order) values
${catalogo.categorias.map((c, i) => `  (${q(c.slug)}, ${q(c.nome)}, ${q(c.imagem)}, ${i + 1})`).join(",\n")}
on conflict (slug) do nothing;

insert into public.collections (slug, name, season, year, headline, description, hero_image_url, hero_mobile_url, gallery_urls, sort_order) values
${catalogo.colecoes
  .map(
    (c, i) =>
      `  (${q(c.slug)}, ${q(c.nome)}, ${q(c.temporada)}, ${c.ano ?? "null"}, ${q(c.chamada)}, ${q(c.descricao)}, ${q(c.capa)}, ${q(c.capaCelular ?? null)}, ${arr(c.galeria ?? [])}, ${i + 1})`,
  )
  .join(",\n")}
on conflict (slug) do nothing;

insert into public.products (ref, slug, name, description, category_id, collection_id, genero, is_featured, sort_order)
select v.ref, v.slug, v.name, v.description, c.id, col.id, v.genero, v.rank <= 10, v.rank
from (values
${produtos.map((p) => `  (${q(p.ref)}, ${q(p.slug)}, ${q(p.nome)}, ${q(p.descricao)}, ${q(p.categoria)}, ${q(p.colecao ?? colecaoPadrao)}, ${p.genero ? q(p.genero) : "null"}, ${p.rank})`).join(",\n")}
) as v(ref, slug, name, description, category_slug, collection_slug, genero, rank)
join public.categories c on c.slug = v.category_slug
left join public.collections col on col.slug = v.collection_slug
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, alt, sort_order)
select p.id, '/images/produtos/' || p.ref || '.jpg', p.name || ', ref. ' || p.ref, 1
from public.products p
where p.ref in (${produtos.map((p) => q(p.ref)).join(", ")})
  and not exists (select 1 from public.product_images i where i.product_id = p.id);
`;

writeFileSync("supabase/seed.sql", sql);
console.log(`supabase/seed.sql gerado: ${catalogo.categorias.length} categorias, ${catalogo.colecoes.length} coleções, ${produtos.length} produtos`);
