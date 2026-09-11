# Design system

Clonado do site atual da Corpo Sensual (Wix), medido nas páginas `/colecao-verao`,
`/fabrica-pijamas` e `/fabrica-pijamas-obrigado` em 10/09/2026. Os valores abaixo
são os do site real, não uma interpretação.

## Fontes

| Uso | Site atual (Wix) | Aqui |
| --- | --- | --- |
| Títulos | `fahkwang` 400 | **Fahkwang** 400 (`.h-display`, `.h-hero`) |
| Texto corrido | `helvetica-w01-light` 400 | **Inter** 300/400 (padrão do `body`) |
| Botões | `montserrat` 400 | **Montserrat** 400 (dentro de `.btn`) |

Títulos são em **caixa normal**, nunca caixa alta. O hero da página usa
`.h-hero`, que tem `letter-spacing: 0.1em`, como no site atual.

## Cores

| Token | Valor | Onde |
| --- | --- | --- |
| `paper` | `#FFFFFF` | fundo padrão |
| `sky` | `#E6F5FE` | fundo das seções alternadas |
| `sky-soft` | `#F2FAFE` | mesma cor a 50%, para blocos mais leves |
| `sky-faint` | `#F7FCFF` | a 30%, para blocos bem sutis |
| `ink` | `#1B1919` | títulos, botão escuro |
| `body` | `#403F2B` | texto corrido |
| `line` | `#DBE7EE` | divisórias |
| `line-strong` | `rgba(0,0,0,0.4)` | borda de campo de formulário |

Em Tailwind: `bg-sky`, `bg-sky-soft`, `text-ink`, `text-body`, `border-line`.

## Escala de tipografia

| Papel | Tamanho no site atual | Aqui |
| --- | --- | --- |
| Título de hero | 38px, entrelinha 45.6px, `ls 3.8px` | `.h-hero text-[2rem] md:text-[2.375rem]` |
| Título de seção | 40px, entrelinha 40px | `.h-display text-3xl md:text-[2.5rem]` |
| Título grande | 50px | `.h-display text-3xl md:text-[3.125rem]` |
| Texto de apoio | 20px, entrelinha 26px | `text-lg leading-[1.3]` |
| Texto corrido | 18px, entrelinha 28.8px | `text-[1.125rem] leading-[1.6]` |
| Nota, legal | 14px, entrelinha 19.6px | `text-sm` |

## Botão

Fundo `#1B1919`, texto branco, **canto de 10px**, altura **50px**, Montserrat 17px,
caixa normal. No site atual tem largura fixa de 276px; aqui usamos largura
automática no desktop e `w-full` no celular.

```tsx
<Link href="/catalogo" className="btn btn-dark">Quero receber o catálogo</Link>
```

Variantes: `.btn-dark` (padrão), `.btn-outline` (contorno escuro), `.btn-light`
(fundo branco, para usar sobre foto).

Abaixo do botão o site costuma trazer uma nota curta com asterisco, em 14px:
`<p className="mt-3 text-sm text-body">*Venda exclusiva para lojas físicas com CNPJ ativo.</p>`

## Campo de formulário

Fundo branco, borda `1px solid rgba(0,0,0,0.4)`, **canto de 5px**, altura 46-48px,
texto 16px. Use a classe `.field`.

> Diferença proposital: o site atual usa 14px no campo. Aqui é 16px, senão o
> iPhone dá zoom automático ao focar. Alvos de toque têm no mínimo 44px.

## Seções

- As seções **alternam** fundo branco e `bg-sky` (ou `bg-sky-soft`).
- Respiro vertical: `py-14 md:py-20` para seções normais, `py-16 md:py-24` para
  as de destaque.
- Largura máxima do conteúdo: `mx-auto max-w-[1600px] px-5 md:px-8`.
- Texto de leitura longa: `max-w-2xl` a `max-w-3xl`.

## Fotos

Cantos arredondados: `rounded-media` (14px). Fotos de campanha em bloco cheio
podem ir sem cantos, como no site atual. Para foto com texto por cima, use a
classe `.shade`, que aplica o degradê na base.

## Efeito de rolagem do site atual

Na página da coleção, a foto de campanha fica **presa** (`sticky`) enquanto a
seção seguinte sobe por cima dela. Padrão:

```tsx
<div className="relative">
  <div className="sticky top-0 h-[70svh] md:h-screen">
    <Image src={foto} alt="" fill className="object-cover" />
  </div>
  <section className="relative bg-sky ...">conteúdo que sobe por cima</section>
</div>
```

## O que não usar

Vieram da versão anterior deste site e **não** pertencem ao design system:
caixa alta com `letter-spacing` largo em rótulos, títulos condensados, cantos
retos, preto e branco puro, fonte serifada itálica para nome de coleção.
