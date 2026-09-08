-- =============================================================================
-- Dados iniciais (conteúdo do site anterior).
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- As imagens apontam para /public/images; troque pelas URLs do Storage
-- (bucket "produtos") conforme for subindo as fotos.
-- =============================================================================

insert into public.categories (id, slug, name, image_url, sort_order) values
  ('a0000000-0000-4000-8000-000000000001', 'gestante',  'Gestante',  '/images/categoria-1.jpg', 1),
  ('a0000000-0000-4000-8000-000000000002', 'masculino', 'Masculino', '/images/categoria-2.jpg', 2),
  ('a0000000-0000-4000-8000-000000000003', 'juvenil',   'Juvenil',   '/images/novidade-1.jpg',  3),
  ('a0000000-0000-4000-8000-000000000004', 'robes',     'Robes',     '/images/destaque-2.jpg',  4)
on conflict (slug) do nothing;

insert into public.collections (id, slug, name, season, year, headline, description, hero_image_url, sort_order) values
  (
    'b0000000-0000-4000-8000-000000000001',
    'verao-2024',
    'Coleção Verão 2024',
    'verao',
    2024,
    'Novo design e modelagem que irá te surpreender!',
    'A Nova Coleção Verão 2024 chegou com tudo! Nossas peças foram remodeladas para abraçar melhor o corpo, com um caimento perfeito. Tecidos mais leves e respiráveis para essa nova temporada de verão, com design inspirado nas maiores tendências do Brasil.',
    '/images/hero-verao.jpg',
    1
  )
on conflict (slug) do nothing;

insert into public.products (id, ref, slug, name, description, category_id, collection_id, is_new, is_featured, sort_order) values
  ('c0000000-0000-4000-8000-000000000001', 'CS-2401', 'pijama-curto-renda',     'Pijama curto com renda',  'Modelagem alinhada, tecido leve e respirável.',      'a0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', true,  false, 1),
  ('c0000000-0000-4000-8000-000000000002', 'CS-2402', 'camisola-alcinha',       'Camisola de alcinha',     'Tecnologia anti-pilling e caimento perfeito.',       'a0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000001', true,  false, 2),
  ('c0000000-0000-4000-8000-000000000003', 'CS-2403', 'pijama-longo-estampado', 'Pijama longo estampado',  'Um dos mais vendidos, agora com nova modelagem.',    'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', false, true,  3),
  ('c0000000-0000-4000-8000-000000000004', 'CS-2404', 'robe-cetim',             'Robe em cetim',           'Leve e flexível para as noites de verão.',           'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000001', false, true,  4),
  ('c0000000-0000-4000-8000-000000000005', 'CS-2405', 'conjunto-masculino',     'Conjunto masculino',      'Linha completa para a temporada de verão.',          'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', false, false, 5),
  ('c0000000-0000-4000-8000-000000000006', 'CS-2406', 'camisola-gestante',      'Camisola gestante',       'Conforto para todas as fases.',                      'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', false, false, 6)
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, alt, sort_order)
select p.id, v.url, v.alt, 1
from (values
  ('pijama-curto-renda',     '/images/novidade-1.jpg',  'Pijama curto com renda'),
  ('camisola-alcinha',       '/images/novidade-2.jpg',  'Camisola de alcinha'),
  ('pijama-longo-estampado', '/images/destaque-1.jpg',  'Pijama longo estampado'),
  ('robe-cetim',             '/images/destaque-2.jpg',  'Robe em cetim'),
  ('conjunto-masculino',     '/images/categoria-2.jpg', 'Conjunto masculino'),
  ('camisola-gestante',      '/images/categoria-1.jpg', 'Camisola gestante')
) as v(slug, url, alt)
join public.products p on p.slug = v.slug
where not exists (select 1 from public.product_images i where i.product_id = p.id);
