-- =============================================================================
-- Dados iniciais.
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- As imagens apontam para /public/images; troque pelas URLs do Storage
-- (bucket "produtos") conforme for subindo as fotos.
--
-- Coleções e fotos de campanha: Frescor e Entrelaços (2026).
-- Produtos: referências do relatório "Ranking de vendas Corpo Sensual" do ERP
-- (01/07 a 09/09/2026). sort_order = posição no ranking; a home mostra as 10
-- primeiras. 0716 e 0325 entram para representar as linhas masculina e gestante.
-- =============================================================================

insert into public.categories (id, slug, name, image_url, sort_order) values
  ('a0000000-0000-4000-8000-000000000001', 'feminino',  'Feminino',  '/images/produtos/0126.jpg', 1),
  ('a0000000-0000-4000-8000-000000000002', 'masculino', 'Masculino', '/images/produtos/0716.jpg', 2),
  ('a0000000-0000-4000-8000-000000000003', 'infantil',  'Infantil',  '/images/produtos/0810.jpg', 3),
  ('a0000000-0000-4000-8000-000000000004', 'gestante',  'Gestante',  '/images/produtos/0325.jpg', 4)
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

-- Referências do ranking de vendas (jul-set/2026). sort_order = posição.
insert into public.products (ref, slug, name, description, category_id, collection_id, is_featured, sort_order)
select v.ref, v.slug, v.name, v.description, c.id, 'b0000000-0000-4000-8000-000000000001', v.rank <= 10, v.rank
from (values
  ('0810', 'short-doll-regata-mescla-infantil',       'Short doll regata mescla infantil',         'Regata em malha mescla com short estampado. Linha infantil feminina.',                    'infantil',   1),
  ('0118', 'short-doll-regata-infantil',              'Short doll regata infantil',                'Regata estampada com short liso. Linha infantil feminina.',                              'infantil',   2),
  ('0130', 'pijama-bordado-manga-masculino',          'Pijama bordado de manga masculino',         'Camiseta de manga curta com bordado e short. Linha masculina.',                          'masculino',  3),
  ('1043', 'pijama-alca-suede-liso',                  'Pijama de alça suede liso',                 'Blusa de alça e short em suede liso. Tamanhos P ao XG.',                                 'feminino',   4),
  ('0131', 'short-malha-masculino',                   'Short de malha masculino',                  'Short em malha estampada com cós elástico. Linha masculina.',                            'masculino',  5),
  ('0848', 'pijama-regata-canelado',                  'Pijama regata canelado',                    'Regata e short em malha canelada com acabamento contrastante.',                          'feminino',   6),
  ('0115', 'short-doll-alca-malha',                   'Short doll de alça em malha',               'Blusa de alça estampada com short liso em malha.',                                       'feminino',   7),
  ('2130', 'pijama-aberto-bordado-manga-masculino',   'Pijama aberto bordado de manga masculino',  'Camisa aberta de manga curta com bordado e short. Linha masculina.',                     'masculino',  8),
  ('0123', 'pijama-aberto-manga-bordado',             'Pijama aberto de manga bordado',            'Camisa aberta de manga curta com detalhes estampados e bermuda.',                        'feminino',   9),
  ('0550', 'short-liganete-masculino',                'Short liganete masculino',                  'Short estampado em liganete com cós elástico. Linha masculina.',                         'masculino', 10),
  ('1034', 'pijama-alca-canelado-listrado',           'Pijama de alça canelado listrado',          'Blusa de alça e short em malha canelada listrada.',                                      'feminino',  11),
  ('0126', 'camisola-bordada-aberta',                 'Camisola bordada aberta',                   'Camisola de manga curta com abertura frontal e bordado.',                                'feminino',  12),
  ('1042', 'pijama-alca-suede-estampado',             'Pijama de alça suede estampado',            'Blusa de alça com estampa e short floral em suede. Tamanhos P ao XG.',                   'feminino',  13),
  ('0851', 'pijama-americano-liso',                   'Pijama americano liso',                     'Camisa de manga curta com botões e short, em cor lisa.',                                 'feminino',  14),
  ('0502', 'short-doll-alca-liganete',                'Short doll de alça em liganete',            'Blusa de alça e short estampados em liganete.',                                          'feminino',  15),
  ('0390', 'short-doll-nadador',                      'Short doll nadador',                        'Regata nadador estampada com short liso.',                                               'feminino',  16),
  ('0080', 'short-doll-renda-liganete',               'Short doll com renda em liganete',          'Blusa de alça com renda e short em liganete.',                                           'feminino',  17),
  ('1035', 'pijama-alca-canelado-liso',               'Pijama de alça canelado liso',              'Blusa de alça e short em malha canelada lisa.',                                          'feminino',  18),
  ('0355', 'short-doll-regata-canelado',              'Short doll regata canelado',                'Regata e short em malha canelada com amarração.',                                        'feminino',  19),
  ('0135', 'short-estampado-masculino-malha-pv',      'Short estampado masculino em malha PV',     'Short estampado em malha PV com cós elástico. Linha masculina.',                         'masculino', 20),
  ('0716', 'pijama-liganete-masculino',               'Pijama de liganete masculino',              'Camiseta de manga curta e bermuda em liganete. Linha masculina.',                        'masculino', 28),
  ('0325', 'camisola-gestante-estampada',             'Camisola gestante estampada',               'Camisola de alça com abertura para amamentação e saia estampada. Linha gestante.',       'gestante',  48)
) as v(ref, slug, name, description, category_slug, rank)
join public.categories c on c.slug = v.category_slug
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, alt, sort_order)
select p.id, '/images/produtos/' || p.ref || '.jpg', p.name || ', ref. ' || p.ref, 1
from public.products p
where p.ref in ('0810','0118','0130','1043','0131','0848','0115','2130','0123','0550',
                '1034','0126','1042','0851','0502','0390','0080','1035','0355','0135','0716','0325')
  and not exists (select 1 from public.product_images i where i.product_id = p.id);
