# Design system: "Lookbook de atacado"

Redesenho de outubro de 2026. O site é o lookbook de uma fábrica que vende para
lojistas: foto de campanha em bloco cheio, Fahkwang grande e o azul da marca trazem o
desejo; um caminho curto traz a venda. Cada tela responde o que a lojista pergunta
antes de comprar (tem mínimo? e o frete? como pago? quando sai?) e aponta para um único
próximo passo: **receber o catálogo com a tabela de preços**.

Tudo o que está aqui mora em `src/app/globals.css` (tokens e classes) e
`src/components/` (componentes). Estilo nas páginas: só utilitários do Tailwind e as
classes abaixo. Nenhuma cor fora dos tokens, nenhum `style` com cor.

## Cores

| Token (Tailwind) | Valor | Uso |
| --- | --- | --- |
| `paper` | `#FFFFFF` | fundo padrão, cartões |
| `sky` | `#E6F5FE` | azul-claro da marca: capas, fecho, faixa da grade |
| `sky-soft` | `#F3FAFE` | seções leves (FAQ, campanha) |
| `sky-faint` | `#F7FCFF` | quase branco |
| `sky-deep` | `#CDE9FA` | anel de foco do campo, fundo de foto carregando |
| `ink` | `#1B1919` | tinta da marca: títulos e **toda ação** (botão principal) |
| `noite` | `#0E2F44` | tom profundo, só estrutura: faixa do topo, fábrica, rodapé, cartão 210, chip ativo |
| `noite-hover` | `#16405C` | hover sobre noite |
| `noite-texto` | `#BFD0DC` | texto corrido sobre noite |
| `areia` | `#F4EEE8` | apoio: seção da vitrine e passe-partout da foto de peça na seção branca |
| `body` | `#454B54` | texto corrido |
| `muted` | `#5F6670` | notas, referência da peça, microtexto |
| `line` | `#DCE8F0` | fios e divisórias |
| `line-strong` | `#7C8C99` | borda de campo, chip e seta (mínimo 3:1) |
| `erro` | `#B3261E` | erro de campo |
| `whats` / `whats-soft` | `#0E7A3C` / `#E3F6EA` | WhatsApp acessível (ícone branco 5,43:1; barra 4,82:1) |

Contraste medido (WCAG 2.1): ink/paper 17,50 · ink/areia 15,21 · body/paper 8,80 ·
body/areia 7,64 · muted/paper 5,80 · muted/areia 5,04 · paper/noite 13,92 ·
noite-texto/noite 8,80 · paper/noite-hover 10,93 · erro/paper 6,54 · placeholder
`#6b7380`/paper 4,78. Texto branco sobre foto: só com `.shade`/`.shade-capa` ou dentro
de `.tag`, medido no percentil 90 (`scratchpad/redesign/ed-work/contraste-foto.mjs`);
se falhar, escurecer o degradê, nunca clarear o texto. O `.shade-capa` fecha a 72% da
altura da foto: a força fica na metade de baixo, onde está o texto, e o rosto da
modelo fica com a cor da foto.

Regras: **um** `.btn-primary` por bloco (o resto é contorno ou link); seções alternam
fundo, nunca duas iguais seguidas; o azul-noite nunca é botão.

## Fontes e escala

Fahkwang 400 (títulos), Inter 400/500 (texto e rótulos), Montserrat 400 (botões,
rótulos em caixa alta), carregadas em `layout.tsx`. Títulos em caixa normal; caixa
alta só no eyebrow e no wordmark.

| Classe | Fonte | 390 px → 1440 px | Uso |
| --- | --- | --- | --- |
| `.t-hero` | Fahkwang | 36 → 63 px, entrelinha 1,04 | o H1, um por página |
| `.t-titulo` | Fahkwang | 28 → 46 px, 1,08 | H2 de seção |
| `.t-sub` | Fahkwang | 20 → 25 px, 1,18 | H3, passo, valor da ficha |
| `.t-numeral` | Fahkwang | 40 → 64 px, números alinhados | "25+", "210" |
| `.lead` | Inter 400 | 17 → 19 px, 1,55 | frase de apoio sob o título |
| corpo | Inter 400 | 16 px (15 em cartão), 1,6 | parágrafos |
| `.eyebrow` | Montserrat, caixa alta | 12 px, 0,14em, cor noite | rótulo acima do título |
| `.eyebrow-fio` | igual + fio de 28 px | | dentro do `SectionHeading` |
| `.legenda` | Inter 400 | 13 px, muted | legenda, nota, microtexto |
| `.btn` | Montserrat 400 | 16 px (`.btn-lg` 16→17, `.btn-sm` 15) | botões |
| `.link-seta` | Montserrat 400 | 15 px | "Ver a coleção →" |

Dentro de `.on-dark` os títulos ficam brancos e `.lead`, `.eyebrow` e `.legenda` passam
a `noite-texto` sozinhos. Medida de leitura: títulos grandes com `max-w-[14ch]` a
`[18ch]`; texto com `max-w-xl`/`2xl`.

## Espaço, grade, cantos e sombra

- `.wrap`: até 1440 px, margem lateral 20 / 32 (≥768) / 48 px (≥1024).
- `.sec`: 64 / 88 / 120 px em cima e embaixo. `.sec-curta`: 40 / 56 / 72 px.
- Grade de 12 colunas a partir de 1024 px, `gap-x-6 lg:gap-x-10`.
- Cabeçalho de seção: eyebrow → título 12 px; título → texto 16 px; cabeçalho →
  conteúdo 32 px (celular) / 48 px (desktop). Cartões: 20 px de respiro no celular,
  32 px no desktop. Formulário: 16 px entre campos.
- Alvo de toque mínimo 44 px em tudo que é clicável.
- Cantos: foto, vídeo, painel e cartão **0**; botão e chip em pílula; campo 6 px;
  `.tag` 2 px; menu em folha 20 px só no topo.
- Sombra só no que flutua: barra fixa (`--shadow-bar`), menu em folha
  (`--shadow-sheet`) e WhatsApp flutuante. Superfícies se separam por fio de 1 px
  (`shadow-[var(--shadow-card)]`) ou por mudança de fundo.

## Movimento

Curva única `--ease-saida`. Ao rolar, `data-reveal` sobe 18 px em 700 ms; vizinhos em
cascata com `style={{ "--atraso": "80ms" }}`; **nunca** na primeira tela. Dentro de um
trilho os cartões revelam todos juntos (os de fora da tela já estão prontos quando o
dedo chega), e no Voltar do navegador a página volta inteira, sem animar de novo.
Foto aproxima 3,5% no hover só com mouse (`.zoom-img`). Seta anda 3 px. Trocar o filtro
de peças esmaece a lista nova em 240 ms. A pergunta do FAQ abre deslizando (onde o
navegador anima até `auto`). O menu em folha sobe ao abrir e desce ao fechar. Um botão
que aponta para `#formulario` faz o cartão do cadastro ganhar um anel que some
(`[data-chamado]`) e, no desktop, põe o foco no primeiro campo. No toque, botão e
cartão-link escurecem um pouco ao pressionar. Com `prefers-reduced-motion`, nada se
move e nenhum vídeo toca sozinho.

## Classes globais

`.wrap` `.sec` `.sec-curta` `.on-dark` `.on-photo` · `.t-hero` `.t-titulo` `.t-sub`
`.t-numeral` `.lead` `.eyebrow` `.eyebrow-fio` `.legenda` · `.link` (fio que encolhe,
área de 44 px) `.link-seta` · `.btn` + `.btn-primary` `.btn-light` `.btn-outline`
`.btn-outline-light` `.btn-sm` `.btn-lg` · `.tag` `.tag-sky` `.tag-areia` · `.field`
`.seg` `.chip` `.chip-active` `.faq` · `.shade` (texto curto sobre foto) `.shade-capa`
(texto grande sobre foto) `.hero-foto*` `.zoom-img` · `.trilho` `.trilho-largo` (84%)
`.trilho-medio` (72%; no desktop o trilho mostra cartões inteiros: 4, 5 a partir de 1280 px, 2
largos ou 3 médios) `.trilho-lg-grade` (vira grade a partir de 1024 px, colunas em
`[--colunas:N]`) · `.cta-bar` `.wa-flutuante` `.folha` `.folha-fundo`.

Animações do Tailwind: `animate-subir` (folha) e `animate-aparecer` (fundo).

## Componentes

| Componente | Para quê |
| --- | --- |
| `SiteHeader` | faixa noite de condições (rola e some) + barra presa com assinatura central; menu em folha abaixo de 1024 px |
| `SiteFooter` + `CtaRodape` | colofão em noite; chamada do rodapé muda por rota |
| `BarraCta` | barra fixa do polegar abaixo de 1024 px; conteúdo por rota |
| `WhatsAppButton` | flutuante verde; sobe acima do aviso de cookies |
| `SectionHeading` | fólio + título + texto + link |
| `Condicoes` | condições comerciais: `faixa`, `ficha`, `lista` |
| `Passos` | passos numerados (ou com ponto, `semNumeros`); em pilha, em linha (`linha`, 1024 px) ou em linha só na tela larga (`linha-xl`, 1280 px) |
| `ProductCard`, `ProductGrid` | peça (a foto leva ao cadastro, com a etiqueta "Receber o catálogo" no hover); vitrine em trilho com cartão "210" ou grade 2/3/4/5 |
| `Trilho` | carrossel com scroll-snap; setas a partir de 768 px (avançam uma página); cartões inteiros e fio de progresso a partir de 1024 px |
| `ProducaoSection`, `NumerosFabrica` | "Da costura à caixa lacrada" e os números da fábrica |
| `LeadForm`, `BlocoCadastro` | formulário de cadastro (máscara no WhatsApp e no CNPJ/CPF, aviso na saída do campo) e o cartão em volta |
| `Faq` | perguntas com `<details>` |
| `Figura` | foto editorial com legenda |
| `Linhas` | "Compre por linha": três fotos lado a lado em todas as larguras |
| `ColecoesVitrine` | coleções em `spread` (home: trilho no celular, duas colunas no tablet, 6 + 4 colunas no desktop) ou `grande` (/colecoes: cartões em pé, lado a lado a partir de 768 px) |
| `CampaignVideo` | vídeo que só carrega perto da tela, com pausa e som |
| `HeroImage` | foto de capa com direção de arte (`<picture>`, baixa só uma) |

A API de cada um está no comentário do próprio arquivo.

### Foto de peça

Todas as fotos de `public/images/produtos` saem de `scripts/foto-produto.mjs` no mesmo
quadro: 1400x1750 (4:5), fundo branco, topo do cabelo a 5,5% da altura, figura centrada,
base cortada na canela encostada na borda de baixo (ou corpo inteiro com 3,5% de folga
sob o pé). A foto entra **sem mistura de cor** (nada de `mix-blend`): a lojista compra
pela cor. A moldura é sempre branco contra areia: na seção areia o cartão é o próprio
branco da foto (`<ProductCard sobre="areia">`); na seção branca a foto ganha um
passe-partout areia de 6/8 px (padrão, `sobre="papel"`).

### Foto de campanha: o recorte acompanha o formato

A reclamação que originou este polimento foi "as fotos estão mal recortadas". Regras:

- Foto em pé nunca vira faixa larga. Capa de coleção cuja foto "larga" é em pé (Entrelaços)
  se divide no desktop: painel azul-noite com o texto à esquerda, foto na metade direita
  (`metade: true` em `FOCO_CAPA`, `colecoes/[slug]/page.tsx`).
- Cartão de coleção é sempre em pé (4:5; 6:7 no desktop). Foto presa ao lado de
  formulário usa a proporção dela (`lg:aspect-[4/5]`), não a altura da tela.
- Capa em faixa (home, /sobre, /seja-representante): 36svh no celular, `min(56vw, 58svh)`
  no tablet, coluna de meia tela no desktop. Cada largura tem o seu ponto de interesse
  (`object-position`), conferido com as cabeças inteiras em 360, 390, 768, 1024, 1280,
  1440, 1680 e 1920 px.
- Nada maior que a tela: a foto grande das coleções da home (652x760) e o cartão de
  /colecoes cabem inteiros numa janela de 830 px de altura.
- Capa da home no desktop: a família de corpo inteiro (`colecoes/delicias-1.jpg`,
  ancorada embaixo). Quem vende pijama mostra o conjunto dos pés à cabeça.

### Formulário na primeira tela (desktop)

Na landing (`/fabrica-de-pijamas`) a grade é 7/5 de 1024 a 1279 px e meio a meio a partir
de 1280 px: o cartão tem 560 a 640 px, os campos ficam em duas colunas e o botão de envio
aparece inteiro numa janela de 1680x830. Em `/catalogo` o botão também cabe nessa janela.
Campos com 48 px de altura a partir de 1024 px (52 px no celular).

### Marcadores de página

- `data-barra-depois`: na capa de toda página que tem barra fixa (`/`, `/sobre`,
  `/colecoes`, `/colecoes/*`, `/fabrica-de-pijamas`, `/seja-representante`). Sem ele a
  barra nunca aparece.
- `data-sem-barra`: no que a barra não pode cobrir. O `LeadForm`, o `BlocoCadastro` e o
  rodapé já têm; ponha também nos blocos de fecho.
- `data-reveal`: sobe ao entrar na tela (abaixo da dobra).
- `cv-auto` + `[contain-intrinsic-size:auto_Npx]`: seção abaixo da dobra que só é montada
  perto da tela. A reserva é a altura do **conteúdo** (sem o padding da própria seção: numa
  seção com `.sec`, a altura real menos 128/176/240 px), por largura: celular, `md:`, `lg:`,
  `xl:` e `min-[90rem]:` (em rem, não em px). Confira com
  `scratchpad/polir/apl/rev/s12-cv.mjs` depois de mexer no layout de uma seção.
- `data-ga-local`: onde o clique aconteceu, para o GA (`hero`, `vitrine`, `barra-fixa`,
  `flutuante`; sem marcação vale `cabecalho`, `menu`, `rodape` ou `pagina`).

## Base da tela no celular

Uma coisa por vez: o aviso de cookies (quando aberto) esconde a barra fixa e empurra o
WhatsApp para cima; a barra fixa, quando à vista, esconde o WhatsApp flutuante (ela já
traz o seu) e a pílula do cabeçalho (`.botao-topo`, a mesma ação); campo em foco
esconde a barra e o WhatsApp; o menu em folha deixa todo o resto inerte.

Componente de cliente que desenha algo conforme a rota usa `useRota()` (`lib/rota.ts`),
nunca `usePathname()` direto: quando a Vercel refaz a home, o servidor a monta como
`/index`, e a diferença derrubava a hidratação da página inteira.

## Efeito de rolagem da coleção

A foto de campanha da coleção fica presa (`sticky top-0`) enquanto a seção seguinte
sobe por cima dela. Como a capa nunca sai da tela, o gatilho da barra fixa
(`data-barra-depois`) vai no bloco seguinte (o manifesto).

## O que não usar

Rosé (saiu, entrou a areia); sombra em cartão; canto arredondado em foto; caixa alta
em botão; Inter 300 no corpo; numeração de seção ("01 — Coleções"); texto branco sobre
foto sem degradê; mais de um `.btn-primary` por bloco; azul-noite como cor de botão.
