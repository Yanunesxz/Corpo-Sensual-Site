# Corpo Sensual — código do site (Wix Velo)

Este repositório guarda o código Velo do site **Corpo Sensual** (https://www.corposensual.com.br), publicado no Wix.
Ele está conectado ao site pela integração **Git Integration & Wix CLI**: tudo que for commitado e enviado para o branch `main` aparece automaticamente no site.

- Site no Wix: `siteId` em [wix.config.json](wix.config.json)
- Conta Wix usada no CLI: marketingcorposensual@gmail.com

> **Importante:** este repositório contém apenas o **código** (JavaScript das páginas, backend e arquivos públicos).
> O design das páginas, imagens, textos, produtos e configurações da loja continuam no editor do Wix e **não** ficam versionados aqui.

---

## O que é o Velo

Velo é a plataforma de código do Wix. Ele permite adicionar JavaScript às páginas do site para:

- Ler e manipular elementos da página com `$w("#idDoElemento")`.
- Reagir a eventos (clique, envio de formulário, carregamento da página).
- Rodar código no servidor (backend) com acesso a banco de dados, e-mail, APIs externas etc.

Referência oficial da API: https://www.wix.com/velo/reference/api-overview/introduction

---

## Estrutura de pastas

```
.
├── src/
│   ├── pages/        # Código de cada página do site + masterPage.js
│   ├── backend/      # Código que roda no servidor do Wix
│   │   └── permissions.json   # Quem pode chamar cada função do backend
│   └── public/       # Código compartilhado entre páginas (frontend)
├── wix.config.json   # Vincula este repo ao site no Wix (não editar)
├── wix.lock          # Controle interno do Wix (não editar)
├── package.json      # Dependências e scripts npm
└── .eslintrc.json    # Regras de lint recomendadas pelo Wix
```

### `src/pages/` — código das páginas

Cada página do site tem um arquivo com o formato `Nome da Pagina.xxxxx.js`, onde `xxxxx` é um ID interno gerado pelo Wix.

- **Não renomeie esses arquivos.** O Wix usa o nome para associar o código à página. Se renomear, o código é ignorado e um arquivo novo é criado.
- **Não crie arquivos de página aqui.** Páginas novas são criadas no editor do Wix; o arquivo aparece no repositório automaticamente.
- `masterPage.js` roda em **todas** as páginas (cabeçalho, rodapé, lógica global).

O código de cada página fica dentro de `$w.onReady(...)`, que é executado quando a página termina de carregar.

### `src/backend/` — código do servidor

Arquivos que rodam no servidor do Wix, fora do navegador do visitante. Tipos de arquivo aceitos:

| Arquivo | Para que serve |
|---|---|
| `*.jsw` ou `*.web.js` | Funções que o frontend pode chamar (web modules) |
| `data.js` | Hooks de banco de dados (antes/depois de inserir, atualizar etc.) |
| `events.js` | Eventos do site (pedido criado, formulário enviado, membro cadastrado) |
| `http-functions.js` | Endpoints HTTP públicos (`/_functions/nome`) |
| `routers.js` | Rotas e sitemap customizados |
| `jobs.config` | Tarefas agendadas |
| `*.js` | Módulos auxiliares importados por outros arquivos do backend |

Importação dentro do projeto usa o caminho absoluto do Velo, nunca caminho relativo:

```js
import { minhaFuncao } from 'backend/meuArquivo';
import { outraFuncao } from 'public/utils';
```

`permissions.json` define quem pode chamar cada função do backend (`siteOwner`, `siteMember`, `anonymous`). Hoje o padrão `*` libera tudo para qualquer visitante; restrinja por função quando criar web modules sensíveis.

### `src/public/` — código compartilhado

Funções reutilizadas por várias páginas. Também pode ser importado pelo backend.

---

## Páginas do site

| Arquivo | Página | Código atual |
|---|---|---|
| `Home.zw74p.js` | Home (principal) | Modelo padrão, sem lógica |
| `HOME.dux8x.js` | HOME (versão alternativa) | Captura de UTM |
| `Sobre.xmlss.js` | Sobre | Modelo padrão |
| `Catalogo Verao.qpamd.js` | Catálogo Verão | Handler `input8_mouseIn` vazio |
| `Colecao Verao.gug3v.js` | Coleção Verão (landing) | Captura de UTM + URL da página |
| `Colecao Inverno.eg091.js` | Coleção Inverno (landing) | Captura de UTM + URL da página |
| `Colecao Verao Plumene.gsl6o.js` | Coleção Verão Plumene (landing) | Captura de UTM + URL da página |
| `Colecao Inverno Plumene.rygrg.js` | Coleção Inverno Plumene (landing) | Captura de UTM + URL da página |
| `LP FABRICA PIJAMAS.gq3i9.js` | LP Fábrica de Pijamas | Captura de UTM + URL da página |
| `Surpreenda Plumene.cxa1y.js` | Surpreenda Plumene | Handler `input8_mouseIn` vazio |
| `Programa Cashback.z4e1i.js` | Programa Cashback | Handler `input8_mouseIn` vazio |
| `colecao-verao-obrigado.p4p67.js` | Obrigado — Coleção Verão | Captura de UTM |
| `colecao-inverno-obrigado.r0avw.js` | Obrigado — Coleção Inverno | Captura de UTM |
| `colecao-verao-plumene-obrigado.sxt6v.js` | Obrigado — Verão Plumene | Captura de UTM |
| `colecao-inverno-plumene-obrigado.agrzx.js` | Obrigado — Inverno Plumene | Captura de UTM |
| `obrigado-fabrica-pijamas.nn7rl.js` | Obrigado — Fábrica de Pijamas | Captura de UTM |
| `Obrigado.xd91h.js` / `Obrigado.zkeyd.js` | Páginas de obrigado genéricas | Handler vazio |
| `My Account.oxx15.js` | Minha Conta (membros) | Modelo padrão |
| `Fullscreen Page.o2rr7.js` | Página em tela cheia | Modelo padrão |
| `Cookie Policy`, `Privacy Policy`, `Refund Policy`, `Shipping Policy`, `Terms & Conditions` | Páginas legais | Modelo padrão |
| `masterPage.js` | Todas as páginas | Modelo padrão |

### Captura de UTM nas landing pages

As landing pages e páginas de obrigado leem os parâmetros `utm_source`, `utm_medium`, `utm_campaign` e `utm_term` da URL com `wix-location-frontend` e gravam em campos ocultos do formulário (`#inputUtmSource`, `#inputUtmMedium`, `#inputUtmCampaign`, `#inputUtmTerm` e, em algumas, `#inputUrlPage`). Assim a origem do lead vai junto com o envio do formulário.

Observações para quem for mexer nesse código:

- Os elementos `#inputUtm*` precisam existir na página no editor do Wix, senão `$w()` falha em tempo de execução.
- Quando o parâmetro não vem na URL, o valor gravado é a string `"undefined"` (por causa do template literal). Se isso for um problema para o CRM, troque por `utm_source ?? ""`.
- Há um `$w.onReady` aninhado dentro de outro. Funciona, mas o de dentro é redundante e pode ser removido.

---

## Como trabalhar localmente

### Pré-requisitos

- Git
- Node.js 14.8 ou superior (recomendado: LTS atual)
- Wix CLI global: `npm install -g @wix/cli`
- Login no Wix: `wix login`

### Primeira vez

```bash
git clone https://github.com/Yanunesxz/corpo-sensual-site.git
cd corpo-sensual-site
npm install
```

O `npm install` roda `wix sync-types` automaticamente, que baixa as definições de tipo do site para o autocomplete no editor.

### Editor Local (`wix dev`)

```bash
npm run dev
```

Abre o **Editor Local** do Wix no navegador, sincronizado com os arquivos desta pasta. Ao salvar um arquivo no seu editor de código, a mudança aparece no Editor Local na hora. Mudanças de design feitas no Editor Local podem ser sincronizadas de volta para o repositório pelo próprio painel.

### Publicar

Existem dois caminhos:

1. **Pelo Git (recomendado):** commit + push na `main`. O Wix pega o código automaticamente. Depois, publique o site pelo editor do Wix para a mudança ir ao ar.
2. **Pelo CLI:** `wix publish` gera uma versão de preview e publica direto.

### Lint

```bash
npm run lint
```

---

## Regras para não quebrar a integração

- Não edite `wix.config.json` nem `wix.lock`.
- Não renomeie nem crie arquivos em `src/pages/` manualmente.
- Não troque o branch padrão do repositório; o Wix acompanha a `main`.
- Sempre teste no Editor Local antes de dar push.

## Links úteis

- [Referência da API Velo](https://www.wix.com/velo/reference/api-overview/introduction)
- [Estrutura do repositório de um site Wix](https://support.wix.com/en/article/velo-understanding-your-sites-github-repository-beta)
- [Trabalhando com o Editor Local](https://support.wix.com/en/article/velo-working-with-the-local-editor-beta)
- [Wix CLI](https://support.wix.com/en/article/velo-working-with-the-wix-cli-beta)
- [Permissões de web modules](https://support.wix.com/en/article/velo-about-web-module-permissions)
