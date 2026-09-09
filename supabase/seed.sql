-- =============================================================================
-- Dados iniciais.
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- As imagens apontam para /public/images; troque pelas URLs do Storage
-- (bucket "produtos") conforme for subindo as fotos.
--
-- Coleções e fotos de campanha: Frescor e Entrelaços (2026).
-- Produtos: as 10 referências mais vendidas de 01/07 a 09/09/2026, segundo o
-- relatório "Ranking de vendas Corpo Sensual" do ERP. sort_order = posição.
-- =============================================================================

insert into public.categories (id, slug, name, image_url, sort_order) values
  ('a0000000-0000-4000-8000-000000000001', 'feminino',  'Feminino',  '/images/colecoes/frescor-4.jpg',    1),
  ('a0000000-0000-4000-8000-000000000002', 'masculino', 'Masculino', '/images/categoria-2.jpg',           2),
  ('a0000000-0000-4000-8000-000000000003', 'infantil',  'Infantil',  '/images/colecoes/entrelacos-3.jpg', 3),
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

-- Top 10 do ranking de vendas (jul-set/2026)
insert into public.products (ref, slug, name, description, category_id, collection_id, is_featured, sort_order)
select v.ref, v.slug, v.name, v.description, c.id, 'b0000000-0000-4000-8000-000000000001', v.sort_order <= 5, v.sort_order
from (values
  ('0810', 'short-doll-regata-mescla-infantil',       'Short doll regata mescla infantil',          'Regata em malha mescla com short estampado. Linha infantil feminina.',            'infantil',  1),
  ('0118', 'short-doll-regata-infantil',              'Short doll regata infantil',                 'Regata estampada com short liso. Linha infantil feminina.',                      'infantil',  2),
  ('0130', 'pijama-bordado-manga-masculino',          'Pijama bordado de manga masculino',          'Camiseta de manga curta com bordado e short. Linha masculina.',                  'masculino', 3),
  ('1043', 'pijama-alca-suede-liso',                  'Pijama de alça suede liso',                  'Blusa de alça e short em suede liso. Tamanhos P ao XG.',                         'feminino',  4),
  ('0131', 'short-malha-masculino',                   'Short de malha masculino',                   'Short em malha estampada com cós elástico. Linha masculina.',                    'masculino', 5),
  ('0848', 'pijama-regata-canelado',                  'Pijama regata canelado',                     'Regata e short em malha canelada com acabamento contrastante.',                  'feminino',  6),
  ('0115', 'short-doll-alca-malha',                   'Short doll de alça em malha',                'Blusa de alça estampada com short liso em malha.',                               'feminino',  7),
  ('2130', 'pijama-aberto-bordado-manga-masculino',   'Pijama aberto bordado de manga masculino',   'Camisa aberta de manga curta com bordado e short. Linha masculina.',             'masculino', 8),
  ('0123', 'pijama-aberto-manga-bordado',             'Pijama aberto de manga bordado',             'Camisa aberta de manga curta com detalhes estampados e bermuda.',                'feminino',  9),
  ('0550', 'short-liganete-masculino',                'Short liganete masculino',                   'Short estampado em liganete com cós elástico. Linha masculina.',                 'masculino', 10)
) as v(ref, slug, name, description, category_slug, sort_order)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, alt, sort_order)
select p.id, '/images/produtos/' || p.ref || '.jpg', p.name || ', ref. ' || p.ref, 1
from public.products p
where p.ref in ('0810','0118','0130','1043','0131','0848','0115','2130','0123','0550')
  and not exists (select 1 from public.product_images i where i.product_id = p.id);
