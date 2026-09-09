-- =============================================================================
-- GERADO por scripts/gerar-seed.mjs a partir de src/data/catalogo.json.
-- Não edite à mão: altere o JSON e rode `npm run seed`.
-- Rode depois da migration. Pode rodar mais de uma vez: não duplica.
-- Produtos: referências do ranking de vendas do ERP; sort_order = posição no
-- ranking, a home mostra as 10 primeiras.
-- =============================================================================

insert into public.categories (slug, name, image_url, sort_order) values
  ('feminino', 'Feminino', '/images/produtos/0126.jpg', 1),
  ('masculino', 'Masculino', '/images/produtos/0716.jpg', 2),
  ('infantil', 'Infantil', '/images/produtos/0810.jpg', 3),
  ('gestante', 'Gestante', '/images/produtos/0325.jpg', 4)
on conflict (slug) do nothing;

insert into public.collections (slug, name, season, year, headline, description, hero_image_url, gallery_urls, sort_order) values
  ('frescor', 'Coleção Frescor', 'verao', 2026, 'Respire o agora. Viva o momento!', 'Nesta coleção, convidamos você a desacelerar: respirar fundo, vestir o presente e se deixar levar pelo frescor. Pijamas com tecidos leves que abraçam o corpo com suavidade e conectam você ao que realmente importa: o bem-estar.', '/images/colecoes/frescor-2.jpg', array['/images/colecoes/frescor-1.jpg', '/images/colecoes/frescor-4.jpg', '/images/colecoes/frescor-3.jpg', '/images/colecoes/frescor-2.jpg']::text[], 1),
  ('entrelacos', 'Coleção Entrelaços', 'inverno', 2026, 'Nossa coleção nasce do encontro entre pessoas, rotinas e histórias.', 'Uma coleção que valoriza o conforto, o ritmo do dia a dia e os momentos simples que criam laços. Tecidos aconchegantes, com estética acolhedora e modelagem pensada para abraçar o corpo.', '/images/colecoes/entrelacos-2.jpg', array['/images/colecoes/entrelacos-3.jpg', '/images/colecoes/entrelacos-1.jpg', '/images/colecoes/entrelacos-4.jpg', '/images/colecoes/entrelacos-2.jpg']::text[], 2)
on conflict (slug) do nothing;

insert into public.products (ref, slug, name, description, category_id, collection_id, is_featured, sort_order)
select v.ref, v.slug, v.name, v.description, c.id, col.id, v.rank <= 10, v.rank
from (values
  ('0810', 'short-doll-regata-mescla-infantil', 'Short doll regata mescla infantil', 'Conjunto infantil de regata em malha mescla estampada e short listrado colorido.', 'infantil', 1),
  ('0118', 'short-doll-regata-infantil', 'Short doll regata infantil', 'Regata branca com estampa de abelha e short azul-marinho liso, conjunto infantil feminino.', 'infantil', 2),
  ('0130', 'pijama-bordado-de-manga-masculino', 'Pijama bordado de manga masculino', 'Camiseta manga curta gola V com friso e bordado no peito e short, em azul-marinho liso.', 'masculino', 3),
  ('1043', 'pijama-de-alca-suede-liso', 'Pijama de alça suede liso', 'Blusa de alça fina azul-claro com botões e viés, e short listrado azul e branco, em suede.', 'feminino', 4),
  ('0131', 'short-de-malha-masculino', 'Short de malha masculino', 'Short masculino de malha lisa, cor vinho, com cós elástico; modelo sem camisa.', 'masculino', 5),
  ('0848', 'pijama-regata-canelado', 'Pijama regata canelado', 'Regata canelada bege com viés azul-marinho e short azul-marinho com cordão no cós.', 'feminino', 6),
  ('0115', 'short-doll-de-alca-em-malha', 'Short doll de alça em malha', 'Blusa de alça branca com estampa escrita e short rosa liso, em malha.', 'feminino', 7),
  ('2130', 'pijama-aberto-bordado-de-manga-masculino', 'Pijama aberto bordado de manga masculino', 'Camisa aberta de manga curta com botões, vivo e bordado no peito, com short liso.', 'masculino', 8),
  ('0123', 'pijama-aberto-de-manga-bordado', 'Pijama aberto de manga bordado', 'Blusa aberta com botões e manga curta, detalhe bordado, com bermuda até o joelho, em cor lisa.', 'feminino', 9),
  ('0550', 'short-liganete-masculino', 'Short liganete masculino', 'Short masculino em liganete, estampado, com cós elástico e etiqueta frontal.', 'masculino', 10),
  ('1034', 'pijama-de-alca-canelado-listrado', 'Pijama de alça canelado listrado', 'Regata de alça fina e short com cordão na cintura, em malha canelada listrada.', 'feminino', 11),
  ('0126', 'camisola-bordada-aberta', 'Camisola bordada aberta', 'Camisola aberta com botões na frente, manga curta e bordado, comprimento acima do joelho.', 'feminino', 12),
  ('1042', 'pijama-de-alca-suede-feminino', 'Pijama de alça suede feminino', 'Regata de alça fina com estampa no peito e short estampado floral, em suede.', 'feminino', 13),
  ('0851', 'pijama-americano-liso', 'Pijama americano liso', 'Camisa de manga curta com gola, botões e vivo contrastante, com short combinando, liso.', 'feminino', 14),
  ('0502', 'short-doll-de-alca-em-liganete', 'Short doll de alça em liganete', 'Conjunto de blusa de alça fina e short em liganete, estampa de tucanos em fundo verde-claro.', 'feminino', 15),
  ('0390', 'short-doll-nadador', 'Short doll nadador', 'Conjunto de regata nadador off-white com estampa no peito e short verde estampado de corações.', 'feminino', 16),
  ('0080', 'short-doll-com-renda-em-liganete', 'Short doll com renda em liganete', 'Conjunto de blusa de alça fina com renda no decote e short, liso, em liganete azul.', 'feminino', 17),
  ('1035', 'pijama-de-alca-canelado-liso', 'Pijama de alça canelado liso', 'Conjunto de blusa de alça com viés branco e short com cordão, liso, em malha canelada marrom.', 'feminino', 18),
  ('0355', 'short-doll-regata-canelado', 'Short doll regata canelado', 'Conjunto de regata com detalhe de coração no decote e short com cordão, liso, em malha canelada.', 'feminino', 19),
  ('0135', 'short-estampado-masculino-em-malha-pv', 'Short estampado masculino em malha PV', 'Short masculino em malha PV, estampado com âncoras em fundo azul-marinho, cós elástico.', 'masculino', 20),
  ('0354', 'short-doll-de-alca-canelado', 'Short doll de alça canelado', 'Conjunto de blusa de alça fina e short com cordão, liso, em malha canelada azul-claro.', 'feminino', 21),
  ('0853', 'pijama-americano-curto', 'Pijama americano curto', 'Camisa de manga curta com gola e botões, mais short, em rosa com bolinhas brancas.', 'feminino', 22),
  ('0125', 'camisola-bordada-de-manga', 'Camisola bordada de manga', 'Camisola curta de manga curta, lisa, com bordado floral e botões no decote.', 'feminino', 23),
  ('0720', 'short-doll-de-alca-estampado', 'Short doll de alça estampado', 'Blusa de alça fina listrada em branco e rosa com short rosa liso.', 'feminino', 25),
  ('0350', 'camisola-bordada-aberta-curta', 'Camisola bordada aberta curta', 'Camisola curta de manga curta, aberta na frente com botões e bordado floral no decote.', 'feminino', 26),
  ('0300', 'robe-de-seda', 'Robe de seda', 'Robe curto preto acetinado, de manga curta, com faixa para amarrar na cintura.', 'feminino', 27),
  ('0716', 'pijama-de-liganete-masculino', 'Pijama de liganete masculino', 'Camiseta de manga curta com estampa no peito e short, em liganete marrom liso.', 'masculino', 28),
  ('1036', 'pijama-de-alca-familia-feminino', 'Pijama de alça família feminino', 'Blusa de alça fina com estampa "Oh happy day!" e short com cordão, em azul-marinho.', 'feminino', 29),
  ('0110', 'short-doll-regata-em-malha', 'Short doll regata em malha', 'Regata rosa com estampa Pizza Lover Club e short liso vinho, em malha.', 'feminino', 30),
  ('0601', 'short-doll-regata-em-liganete', 'Short doll regata em liganete', 'Regata e short em liganete verde com estampa de borboletas e corações.', 'feminino', 31),
  ('0129', 'pijama-bordado-regata-masculino', 'Pijama bordado regata masculino', 'Regata e bermuda lisas em cinza, com bordado pequeno no peito.', 'masculino', 32),
  ('0501', 'pijama-regata-estampado-em-liganete', 'Pijama regata estampado em liganete', 'Regata e bermuda em liganete azul com estampa de margaridas.', 'feminino', 33),
  ('0690', 'pijama-manga-curta-com-pescador', 'Pijama manga curta com pescador', 'Blusa manga curta verde-água com estampa de tulipas e calça pescador azul-marinho.', 'feminino', 34),
  ('4130', 'pijama-aberto-com-calca-masculino', 'Pijama aberto com calça masculino', 'Camisa aberta de botões, manga curta com vivo branco, e calça comprida, em verde-oliva.', 'masculino', 35),
  ('2134', 'short-doll-regata-estampado', 'Short doll regata estampado', 'Regata branca com estampa floral e bermuda lisa azul-claro.', 'feminino', 36),
  ('0310', 'pijama-regata-em-malha', 'Pijama regata em malha', 'Conjunto de regata off-white com bolso estampado e bermuda verde-oliva, em malha.', 'feminino', 38),
  ('0316', 'short-doll-nadador-de-onca', 'Short doll nadador de onça', 'Regata nadador verde-água com estampa de tartaruga e flores e short estampado de onça.', 'feminino', 41),
  ('0116', 'short-doll-de-alca-de-bolinhas', 'Short doll de alça de bolinhas', 'Blusa de alça fina rosa com estampa de limonada e short vinho de bolinhas, em malha.', 'feminino', 42),
  ('2131', 'pijama-regata-floral-em-malha', 'Pijama regata floral em malha', 'Regata azul-claro com decote V e bermuda off-white de estampa floral, em malha.', 'feminino', 43),
  ('2226', 'camisola-aberta-xadrez', 'Camisola aberta xadrez', 'Camisola sem manga com abertura frontal de botões e estampa xadrez em tons de rosa.', 'feminino', 44),
  ('0330', 'pijama-listrado-de-manga-masculino', 'Pijama listrado de manga masculino', 'Camiseta manga curta cinza mescla com listras pretas e bermuda preta lisa.', 'masculino', 45),
  ('0499', 'pijama-bermuda-liganete', 'Pijama bermuda liganete', 'Blusa manga curta rosa com estampa de corações e bermuda vinho lisa, em liganete.', 'feminino', 46),
  ('0103', 'pijama-infantil-masculino-em-malha', 'Pijama infantil masculino em malha', 'Conjunto infantil de camiseta manga curta com estampa de futebol e bermuda lisa verde, em malha.', 'infantil', 47),
  ('0325', 'camisola-de-gestante-estampada', 'Camisola de gestante estampada', 'Camisola de alça para gestante, busto liso rosa e saia estampada com florzinhas e laço na cintura.', 'gestante', 48),
  ('0704', 'short-doll-de-alca', 'Short doll de alça', 'Conjunto de blusa de alça fina com decote V e short azul-marinho com vivo claro e cordão na cintura.', 'feminino', 49),
  ('0093', 'camisola-de-alca-liganete-lisa', 'Camisola de alça liganete lisa', 'Camisola curta de alça fina em liganete lisa azul, com decote V e renda no busto.', 'feminino', 50),
  ('0122', 'pijama-de-manga-em-malha', 'Pijama de manga em malha', 'Conjunto de blusa manga curta verde-água com estampa de tulipas e bermuda lisa azul-marinho, em malha.', 'feminino', 51),
  ('0128', 'pijama-aberto-de-manga-estampado', 'Pijama aberto de manga estampado', 'Conjunto de blusa aberta com botões e manga curta, rosa com estampa floral, e bermuda lisa vinho.', 'feminino', 52),
  ('0359', 'short-doll-regata-jovem', 'Short doll regata jovem', 'Conjunto de regata rosa clara estampada e short xadrez rosa com cordão na cintura.', 'feminino', 53),
  ('0570', 'pijama-liganete-masculino', 'Pijama liganete masculino', 'Camiseta de manga curta com estampa miúda escura e short liso cinza, em liganete.', 'masculino', 54),
  ('0121', 'short-doll-de-alca-infantil', 'Short doll de alça infantil', 'Regata de alça fina com estampa de borboleta e short liso, em verde-água, para menina.', 'infantil', 55),
  ('0605', 'camisola-regata-liganete', 'Camisola regata liganete', 'Camisola regata curta em liganete, verde com estampa de flores e corações.', 'feminino', 57),
  ('0719', 'pijama-aberto-estampado-de-manga', 'Pijama aberto estampado de manga', 'Blusa de manga curta aberta com botões, azul lisa, e bermuda branca estampada com flores.', 'feminino', 58),
  ('0730', 'short-doll-nadador-estampado', 'Short doll nadador estampado', 'Regata nadador listrada em cinza e preto com short liso preto.', 'feminino', 59),
  ('2014', 'short-doll-regata-infantil-feminino', 'Short doll regata infantil feminino', 'Regata listrada rosa e branca com babado na barra e short com babados, para menina.', 'infantil', 60)
) as v(ref, slug, name, description, category_slug, rank)
join public.categories c on c.slug = v.category_slug
left join public.collections col on col.slug = 'frescor'
on conflict (slug) do nothing;

insert into public.product_images (product_id, url, alt, sort_order)
select p.id, '/images/produtos/' || p.ref || '.jpg', p.name || ', ref. ' || p.ref, 1
from public.products p
where p.ref in ('0810', '0118', '0130', '1043', '0131', '0848', '0115', '2130', '0123', '0550', '1034', '0126', '1042', '0851', '0502', '0390', '0080', '1035', '0355', '0135', '0354', '0853', '0125', '0720', '0350', '0300', '0716', '1036', '0110', '0601', '0129', '0501', '0690', '4130', '2134', '0310', '0316', '0116', '2131', '2226', '0330', '0499', '0103', '0325', '0704', '0093', '0122', '0128', '0359', '0570', '0121', '0605', '0719', '0730', '2014')
  and not exists (select 1 from public.product_images i where i.product_id = p.id);
