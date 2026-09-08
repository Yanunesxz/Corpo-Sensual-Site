-- =============================================================================
-- Dados iniciais.
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- As imagens apontam para /public/images; troque pelas URLs do Storage
-- (bucket "produtos") conforme for subindo as fotos.
--
-- Coleções e fotos de campanha são reais (Frescor e Entrelaços, 2026).
-- Os PRODUTOS são provisórios: substitua pelas 10 referências mais vendidas.
-- =============================================================================

insert into public.categories (id, slug, name, image_url, sort_order) values
  ('a0000000-0000-4000-8000-000000000001', 'feminino',  'Feminino',  '/images/colecoes/frescor-4.jpg',    1),
  ('a0000000-0000-4000-8000-000000000002', 'masculino', 'Masculino', '/images/categoria-2.jpg',           2),
  ('a0000000-0000-4000-8000-000000000003', 'juvenil',   'Juvenil',   '/images/colecoes/entrelacos-3.jpg', 3),
  ('a0000000-0000-4000-8000-000000000004', 'gestante',  'Gestante',  '/images/categoria-1.jpg',           4)
on conflict (slug) do nothing;

insert into public.collections (id, slug, name, season, year, headline, description, hero_image_url, gallery_urls, sort_order) values
  (
    'b0000000-0000-4000-8000-000000000001',
    'frescor',
    'Coleção Frescor',
    'verao',
    2026,
    'Respire o agora. Viva o momento!',
    'Nesta coleção, convidamos você a desacelerar: respirar fundo, vestir o presente e se deixar levar pelo frescor. Pijamas com tecidos leves que abraçam o corpo com suavidade e conectam você ao que realmente importa: o bem-estar.',
    '/images/colecoes/frescor-2.jpg',
    array['/images/colecoes/frescor-1.jpg', '/images/colecoes/frescor-4.jpg', '/images/colecoes/frescor-3.jpg', '/images/colecoes/frescor-2.jpg'],
    1
  ),
  (
    'b0000000-0000-4000-8000-000000000002',
    'entrelacos',
    'Coleção Entrelaços',
    'inverno',
    2026,
    'Nossa coleção nasce do encontro entre pessoas, rotinas e histórias.',
    'Uma coleção que valoriza o conforto, o ritmo do dia a dia e os momentos simples que criam laços. Tecidos aconchegantes, com estética acolhedora e modelagem pensada para abraçar o corpo.',
    '/images/colecoes/entrelacos-2.jpg',
    array['/images/colecoes/entrelacos-3.jpg', '/images/colecoes/entrelacos-1.jpg', '/images/colecoes/entrelacos-4.jpg', '/images/colecoes/entrelacos-2.jpg'],
    2
  )
on conflict (slug) do nothing;

-- Produtos provisórios (trocar pelas referências reais)
insert into public.products (id, ref, slug, name, description, category_id, collection_id, is_new, is_featured, sort_order) values
  ('c0000000-0000-4000-8000-000000000001', 'CS-0001', 'pijama-curto-renda',     'Pijama curto com renda',  'Modelagem alinhada, tecido leve e respirável.',    'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', true,  false, 1),
  ('c0000000-0000-4000-8000-000000000002', 'CS-0002', 'camisola-alcinha',       'Camisola de alcinha',     'Tecnologia anti-pilling e caimento perfeito.',     'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', true,  false, 2),
  ('c0000000-0000-4000-8000-000000000003', 'CS-0003', 'pijama-longo-estampado', 'Pijama longo estampado',  'Um dos mais vendidos, agora com nova modelagem.',  'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000001', false, true,  3),
  ('c0000000-0000-4000-8000-000000000004', 'CS-0004', 'robe-cetim',             'Robe em cetim',           'Leve e flexível para as noites de verão.',         'a0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', false, true,  4),
  ('c0000000-0000-4000-8000-000000000005', 'CS-0005', 'conjunto-masculino',     'Conjunto masculino',      'Linha completa para a temporada de verão.',        'a0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000001', false, false, 5),
  ('c0000000-0000-4000-8000-000000000006', 'CS-0006', 'camisola-gestante',      'Camisola gestante',       'Conforto para todas as fases.',                    'a0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000001', false, false, 6)
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
