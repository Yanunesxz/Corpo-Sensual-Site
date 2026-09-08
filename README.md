# Corpo Sensual — site institucional

Site da **Corpo Sensual** (https://www.corposensual.com.br), confecção de moda íntima de Muriaé, MG.
Reconstruído do zero em código para que **layout, fotos e conteúdo fiquem versionados neste repositório**, substituindo o site anterior no Wix.

| Camada | Tecnologia |
| --- | --- |
| Front-end | [Next.js 16](https://nextjs.org) (React 19, App Router, Server Components), TypeScript, Tailwind CSS 4 |
| Banco de dados | [Supabase](https://supabase.com) (PostgreSQL + Storage), acessado com a chave pública e RLS |
| Hospedagem | [Vercel](https://vercel.com), deploy automático a cada push na `main` |
| Fontes | Bodoni Moda (títulos) e Inter (texto), servidas pelo `next/font` |

Sem bibliotecas de UI ou animação: o visual é todo Tailwind + CSS, o que mantém o site leve.

---

## O que o site tem

| Rota | Página | Conteúdo |
| --- | --- | --- |
| `/` | Home | Hero da coleção atual, faixa de diferenciais, "Chegou agora", "Em destaque", categorias, estrutura da empresa, formulário de catálogo e "Sobre nós" |
| `/sobre` | Sobre | História, números e compromissos da marca |
| `/colecoes` | Coleções | Lista de coleções ativas |
| `/colecoes/[slug]` | Coleção | Peças da coleção com filtro por categoria (`?categoria=gestante`) |
| `/catalogo` | Receber catálogo | Passo a passo + formulário de lead (`source = catalogo`) |
| `/fabrica-de-pijamas` | Para lojistas | Landing B2B com benefícios + formulário (`source = fabrica-de-pijamas`) |
| `/programa-cashback` | Programa Cashback | Explicação do programa + formulário (`source = programa-cashback`) |
| `/obrigado?origem=...` | Obrigado | Confirmação após o envio, com botão de WhatsApp |
| `/politicas/[slug]` | Institucional | Privacidade, cookies, trocas, envio e termos (textos em `src/lib/content/politicas.ts`) |
| `/sitemap.xml`, `/robots.txt` | SEO | Gerados automaticamente |

As URLs do site antigo (`/catalogo-verao`, `/privacy-policy` etc.) redirecionam para as novas. Veja `next.config.ts`.

### Formulários e leads

Todos os formulários gravam na tabela `leads` do Supabase, com:

- nome, e-mail, WhatsApp, se possui CNPJ, loja, cidade/UF e mensagem;
- origem (`source`), URL da página e referrer;
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` lidos da URL automaticamente;
- campo *honeypot* contra bots e validação com Zod no servidor (`src/app/actions/leads.ts`).

Se o Supabase não estiver configurado, o formulário mostra um aviso e não perde o lead silenciosamente.

### Catálogo

Produtos, categorias e coleções vêm das tabelas do Supabase. Enquanto o banco não está configurado, o site usa os dados de exemplo de `src/lib/fallback-data.ts`, então ele **sempre renderiza**, inclusive no primeiro deploy.

---

## Estrutura de pastas

```
.
├── public/images/            # Fotos do site (hero, produtos, categorias)
├── src/
│   ├── app/                  # Rotas (App Router). Cada pasta = uma URL
│   │   ├── actions/leads.ts  # Server Action que grava o lead
│   │   ├── layout.tsx        # Cabeçalho, rodapé, fontes e metadados globais
│   │   ├── page.tsx          # Home
│   │   └── .../page.tsx      # Demais páginas
│   ├── components/           # Cabeçalho, rodapé, formulário, cards, animações
│   └── lib/
│       ├── data.ts           # Consultas ao Supabase (com fallback)
│       ├── fallback-data.ts  # Dados de exemplo
│       ├── site.ts           # Nome, CNPJ, endereço, contatos, menu
│       ├── types.ts          # Tipos das tabelas
│       ├── utm.ts            # Leitura de UTMs
│       ├── supabase/client.ts
│       └── content/politicas.ts
├── supabase/
│   ├── migrations/0001_init.sql   # Tabelas, índices, RLS e bucket
│   └── seed.sql                   # Conteúdo inicial
├── .env.example              # Variáveis de ambiente necessárias
└── next.config.ts            # Domínios de imagem e redirects
```

---

## Rodando localmente

Pré-requisitos: Node.js 20.9 ou superior e npm.

```bash
git clone https://github.com/Yanunesxz/Corpo-Sensual-Site.git
cd Corpo-Sensual-Site
npm install
copy .env.example .env.local
npm run dev
```

Abra http://localhost:3000. Sem preencher o `.env.local` o site roda com os dados de exemplo.

Scripts:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção (também checa tipos) |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |

---

## Configurando o Supabase

1. Crie um projeto em https://supabase.com/dashboard (região `South America (São Paulo)`).
2. No **SQL Editor**, cole e execute o conteúdo de `supabase/migrations/0001_init.sql`.
3. Depois execute `supabase/seed.sql` para carregar categorias, coleção e produtos de exemplo.
4. Em **Project Settings > API**, copie a `Project URL` e a chave pública (`anon` / `publishable`).
5. Preencha no `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### O que a migration cria

| Tabela | Uso |
| --- | --- |
| `categories` | Gestante, Masculino, Juvenil, Robes... |
| `collections` | Coleções por temporada. A primeira ativa (menor `sort_order`) vira o hero da home. `gallery_urls` guarda as fotos de campanha |
| `products` | Peças. `is_new` aparece em "Chegou agora", `is_featured` em "Em destaque" |
| `product_images` | Fotos de cada peça (URL do Storage ou caminho em `/public/images`) |
| `leads` | Cadastros dos formulários, com UTM e status de atendimento |

Bucket de Storage `produtos` (público) para as fotos.

### Segurança (RLS)

A chave pública usada no site só consegue **ler registros ativos** de catálogo e **inserir** leads. Não lê, altera nem apaga leads. Gestão de conteúdo e leitura de leads são feitas pelo painel do Supabase (Table Editor).

### Onde estão as fotos originais

| Conteúdo | Origem |
| --- | --- |
| Campanhas Frescor (verão 2026) e Entrelaços (inverno 2026) | Site antigo no Wix; cópias otimizadas em `public/images/colecoes/` |
| Fotos por referência, Inverno 2026 (`0981.jpeg`...) | `\\192.168.0.2\#Corpo Sensual\CATALOGO\FOTOS\FOTOS INVERNO 2026` |
| Fotos por referência, Verão 2027 (`1035.pdf`...) | `\\192.168.0.2\#Corpo Sensual\CATALOGO\FOTOS\FOTOS VERÃO 2027` (PDF, converter para JPG) |
| Fotos 2025 (RAW `.CR2`, precisam de revelação) | `\\192.168.0.2\#Corpo Sensual\CATALOGO\FOTOS\FOTOS 2025` |
| Recortes com fundo transparente (`CS-040.png`...) | `\\192.168.0.2\#Corpo Sensual\FUNDO TRANSPARENTE (PNG)1` |

Depois de copiar fotos novas para `public/images/`, rode `npm run imagens` para reduzir o tamanho. Fotos com fundo transparente só compensam em PNG se a transparência for usada; caso contrário, salve como JPG.

### Gerenciando o conteúdo no dia a dia

- **Nova foto:** Storage > bucket `produtos` > Upload. Copie a URL pública e cadastre em `product_images`.
- **Nova peça:** Table Editor > `products` > Insert row. Marque `is_new` para aparecer em "Chegou agora".
- **Nova coleção:** insira em `collections` com `sort_order` menor que as demais e `active = true`.
- **Ver leads:** Table Editor > `leads`. Use a coluna `status` para o funil (novo, em_contato, convertido, descartado).

O site atualiza o catálogo a cada 1 hora (ISR). Para forçar na hora, faça um redeploy no Vercel.

---

## Deploy no Vercel

1. Acesse https://vercel.com/new e importe o repositório `Yanunesxz/Corpo-Sensual-Site`.
2. Framework detectado: Next.js. Não precisa alterar build ou output.
3. Em **Environment Variables**, cadastre as variáveis do `.env.example` (pelo menos `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`).
4. Deploy. A cada push na `main` o Vercel publica uma nova versão; pull requests ganham URL de preview.
5. Em **Settings > Domains**, adicione `corposensual.com.br` e `www.corposensual.com.br` e siga as instruções de DNS. Só aponte o domínio quando o conteúdo estiver revisado; até lá o site do Wix continua no ar.

---

## Checklist antes de trocar o domínio

- [ ] Supabase configurado e `seed.sql` substituído pelas peças reais
- [ ] Fotos das peças enviadas para o Storage
- [ ] `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_INSTAGRAM` e `NEXT_PUBLIC_EMAIL` preenchidos no Vercel
- [ ] Textos de `src/lib/content/politicas.ts` revisados pelo responsável jurídico
- [ ] Regras do Programa Cashback confirmadas com o comercial (`src/app/programa-cashback/page.tsx`)
- [ ] Teste de envio dos formulários e conferência dos leads na tabela
- [ ] Google Analytics ou pixel de campanha, se usados, adicionados em `src/app/layout.tsx`

## Repositório anterior

O código Velo do site no Wix continua em https://github.com/Yanunesxz/corpo-sensual-site como referência histórica.
