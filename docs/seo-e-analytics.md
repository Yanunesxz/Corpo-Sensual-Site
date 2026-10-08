# SEO e Google Analytics: o que fica com o dono

O código já está pronto. Este roteiro reúne o que só se faz nos painéis (Google Analytics, Search Console, Vercel, DNS, Perfil da Empresa) e as decisões que são do dono.

Faça tudo com a **conta Google da empresa**, que deve ficar como administradora. Não use a conta de uma agência nem a de um funcionário.

---

## 1. Google Analytics 4 (uma vez só)

### Criar a propriedade

1. Em https://analytics.google.com, **Administrador > Criar > Propriedade**.
   - Fuso: (GMT-03:00) Horário de Brasília. Moeda: Real (BRL). Não dá para corrigir o fuso depois.
   - Objetivo da empresa: "Gerar leads".
2. **Fluxo de dados > Web**, com a URL `https://www.pijamascorposensual.com.br`. O fluxo aceita dados de qualquer endereço, inclusive do `sitecs.vercel.app`.
3. Copie o **ID de medição** (G-XXXXXXXXXX) e mande para quem cuida do site. Ele entra em `src/lib/analytics.ts`. Outra opção é a variável `NEXT_PUBLIC_GA_ID` na Vercel, só no ambiente Production, seguida de um novo deploy.

### Antes de o site começar a medir (obrigatório)

No fluxo da Web (**Administrador > Coleta e modificação de dados > Fluxos de dados >** o fluxo):

1. **Medição otimizada** (engrenagem):
   - DESLIGUE **Cliques de saída**. Os botões de WhatsApp do /obrigado levam o nome, a loja e a cidade do lojista na mensagem, e o GA mandaria isso ao Google. O site já mede esses cliques sozinho, sem o texto (evento `clique_whatsapp`).
   - DESLIGUE **Interações com formulários**, porque o site já mede o começo do preenchimento (`form_inicio`) e o lead (`generate_lead`).
   - Em **Visualizações de página > Mostrar configurações avançadas**, DESMARQUE "Alterações de página com base em eventos do histórico de navegação". O site já manda uma visita por página e, com essa opção ligada, cada visita conta duas vezes.
   - Rolagem e Downloads podem ficar ligados. Pesquisa no site e Engajamento com vídeo, desligados.
2. **Encobrir dados** (fica em "Eventos", no mesmo fluxo): deixe **E-mail** ligado e, em **Parâmetros de consulta**, acrescente `text`. É uma segunda trava, caso alguém religue os cliques de saída.
3. **Administrador > Coleta de dados**: indicadores do Google e "coleta de dados fornecidos pelo usuário" DESLIGADOS (já é o padrão). Não ligue o User-ID.

### Relatórios

1. **Retenção de dados** (Administrador > Coleta e modificação de dados): Eventos = **14 meses**.
2. **Dimensões personalizadas** (Administrador > Exibição de dados > Definições personalizadas), todas com escopo **Evento**:

   | Nome | Parâmetro |
   | --- | --- |
   | Origem do lead | `lead_source` |
   | Destino do WhatsApp | `destino` |
   | Contato da equipe | `contato` |
   | Local do clique | `local` |

3. **Eventos principais**: marque `generate_lead`. O `clique_whatsapp` também pode ser marcado, mas é opcional. O `form_inicio` **não** é evento principal: ele serve para o funil (Explorar > Exploração de funil, com as etapas `page_view` → `form_inicio` → `generate_lead`, separadas por `lead_source`), que mostra quantas lojistas começam o cadastro e desistem.
4. **Vinculações**: Search Console (item 2 abaixo) e, se houver anúncios, Google Ads (item 4).

### O que o site manda ao Google

- `page_view`: uma visita por página. Filtrar a grade de peças (`?categoria=`) não conta como visita nova.
- `generate_lead` com `lead_source` (catalogo, fabrica-de-pijamas, colecao, contato ou representante). Conta uma vez por cadastro enviado. Recarregar o /obrigado ou abrir um link antigo de obrigado do Wix não conta.
- `form_inicio` com `lead_source`: a pessoa começou a preencher um formulário (o primeiro toque num campo), uma vez por formulário aberto. Vai só a origem, nada do que foi digitado.
- `clique_whatsapp` com `destino` (vendedora, gerente, sac, financeiro, geral), `contato` (Nicoli, Simone, Fabian) e `local`.
- `clique_catalogo` com `local`, em todo link que leva a `/catalogo`.
- **Nunca**: nome, e-mail, WhatsApp, CNPJ, CPF, loja, cidade ou mensagem.

Valores de `local` (de onde saiu o clique):

| `local` | Onde fica |
| --- | --- |
| `hero` | botão principal da capa que leva ao catálogo (home, /colecoes, páginas de coleção, /sobre). Na landing e no representante a capa leva ao formulário da própria página, e o que conta ali é o `form_inicio` |
| `vitrine` | cartão "210 referências" no fim da vitrine de peças da home |
| `barra-fixa` | barra presa na base da tela do celular ("Quero receber o catálogo" e o botão do WhatsApp) |
| `flutuante` | botão redondo do WhatsApp no canto da tela |
| `cabecalho` | cabeçalho (botão "Catálogo" / "Receber catálogo") |
| `menu` | menu do celular |
| `rodape` | rodapé (botão "Receber catálogo" e links) |
| `pagina` | qualquer outro link do corpo da página (fecho, seção da fábrica, vendedoras do /obrigado, SAC e financeiro do /ajuda) |

Os nomes antigos `faixa` e `barra-celular` não existem mais: se aparecerem num relatório, são de antes de 01/10/2026.

O Google só é carregado depois que a pessoa clica em **Aceitar** no aviso de cookies (LGPD). Quem recusa não é medido, e o link "Preferências de cookies", no rodapé, deixa mudar a escolha. Por isso os números do GA vão ficar abaixo das visitas reais, o que é esperado.

### Teste (antes de confiar nos números)

Abra o **DebugView** (Administrador > DebugView) ou o Tag Assistant e faça no site:

1. Aceite o aviso e navegue por 3 páginas. Devem aparecer 3 `page_view`, não 6.
2. Toque no primeiro campo de um formulário. Deve aparecer 1 `form_inicio` com `lead_source` (e nenhum outro ao passar para os campos seguintes).
3. Envie um cadastro de teste. Deve aparecer 1 `generate_lead` com `lead_source`.
4. Clique num botão de vendedora. Deve aparecer `clique_whatsapp` com `destino` e `contato`, e **nenhum** evento `click` com link `wa.me`.
5. No celular, role a home até a barra fixa aparecer e toque em "Quero receber o catálogo". Deve aparecer `clique_catalogo` com `local` = `barra-fixa`.

### Tráfego interno (opcional)

Só filtre por IP se a fábrica tiver IP fixo e exclusivo (confirme com o provedor). IP dinâmico é compartilhado e excluiria lojistas de verdade.

---

## 2. Google Search Console

O site novo já publica o mesmo token de verificação que o Wix usa hoje (`google-site-verification`, em `src/app/layout.tsx`). A propriedade atual continua verificada quando o domínio vier para a Vercel, **desde que** ela pertença a uma conta da empresa.

1. Em **Configurações > Usuários e permissões**, confira qual conta é proprietária. Se for de agência ou do Wix, acrescente a conta da empresa como **proprietária** antes da troca.
2. Recomendado: use uma propriedade de **Domínio** (`pijamascorposensual.com.br`, o oficial), verificada pelo registro TXT `google-site-verification` que esse domínio já tem. Não apague esse TXT nem o do SPF na troca de DNS. Essa propriedade cobre www, sem www, http e https, e não depende da hospedagem.
3. Vincule a propriedade ao GA4 (Administrador do GA4 > Vinculações do Search Console).

---

## 3. Dia da troca de domínio (Wix para Vercel)

**Domínio oficial: `www.pijamascorposensual.com.br`** (decisão do dono em 08/10/2026). O
`corposensual.com.br`, que era o do Wix, passa a redirecionar para ele mantendo o caminho e a
query (`next.config.ts`): `corposensual.com.br/colecao-verao?gclid=...` cai em
`www.pijamascorposensual.com.br/colecao-verao?gclid=...`.

Os dois domínios ficam em lugares diferentes:

| Domínio | Registro | DNS editado em | E-mail |
| --- | --- | --- | --- |
| `pijamascorposensual.com.br` (oficial) | HostGator, **no nome de uma pessoa física**, vence em 11/04/2027 | Wix (ns1/ns2.wix.com) até a troca | Google (5 registros MX) |
| `corposensual.com.br` (redireciona) | Registro.br, no CNPJ da empresa, vence em 26/04/2027 | HostGator, cPanel > Zone Editor | HostGator (`mail.corposensual.com.br`) |

**Antes do dia**

- **Titularidade**: passe o `pijamascorposensual.com.br` para o CNPJ da empresa. Domínio oficial em nome de pessoa física é risco de perder o site.
- **Plumene**: `/colecao-verao-plumene`, `/colecao-inverno-plumene`, `/surpreenda-plumene` e os dois obrigados vão para o site da Plumene (decisão do dono). No domínio da CS elas viram 404 na troca. Quando existirem no site da Plumene, dá para redirecionar os endereços antigos para lá.
- **PDF do catálogo de inverno**: está no armazenamento do Wix (`CATALOGO_INVERNO`, em `src/lib/content/landing-colecoes.ts`). Suba no Google Drive e troque o link antes de excluir o site do Wix.

**No dia**

1. Vercel > projeto > **Settings > Domains**: adicione `www.pijamascorposensual.com.br` como principal, `pijamascorposensual.com.br` com "Redirect to www", `loja.pijamascorposensual.com.br`, `www.corposensual.com.br` e `corposensual.com.br`. O código redireciona os quatro extras para o oficial.
2. **pijamascorposensual.com.br**: na HostGator, "Configurar domínio" > **Sem hospedagem (apenas Zona de DNS)** (tira o DNS do Wix). Na zona, deixe só:
   - A `@` e CNAME `www` e `loja`: os valores que a Vercel mostrar;
   - MX `@`: `aspmx.l.google.com` (10), `alt1.aspmx.l.google.com` (20), `alt2` (30), `alt3` (40), `alt4` (50);
   - TXT `@`: `v=spf1 include:_spf.google.com ~all` e `google-site-verification=AetnN-b2cLLfKkpF-3lPnxh8gQW_b6MujHwnIN4fa1Q`.
   Sem os MX e o SPF, o e-mail do Google desse domínio para.
3. **corposensual.com.br**: cPanel > Zone Editor. **Não troque os nameservers.** Mude só o **A** de `corposensual.com.br` (hoje 185.230.63.107, do Wix) e o **CNAME** de `www` (hoje pointing.wixdns.net) para os valores da Vercel. Não mexa em MX, mail nem SPF.
4. Com os domínios válidos e com certificado, faça um **Redeploy** de produção. As imagens de prévia passam para o domínio oficial.
5. Confira no CMD:

```bash
curl -sI https://www.pijamascorposensual.com.br/ | findstr /i "x-robots-tag"
```

Não pode mostrar nada. Se aparecer `noindex`, o domínio oficial está bloqueado.

```bash
curl -sI "https://www.corposensual.com.br/colecao-verao?gclid=teste" | findstr /i "HTTP location"
```

Deve responder 308 para `https://www.pijamascorposensual.com.br/colecao-verao?gclid=teste`.

```bash
nslookup -type=MX corposensual.com.br
nslookup -type=MX pijamascorposensual.com.br
```

O primeiro continua `mail.corposensual.com.br`; o segundo, os servidores do Google.

6. Search Console: adicione a propriedade `https://www.pijamascorposensual.com.br` (ou a de Domínio, já verificada pelo TXT acima), envie o sitemap dela e, na propriedade antiga do `corposensual.com.br`, use **Configurações > Mudança de endereço** apontando para o domínio novo. Sem isso o Google demora muito mais para passar a relevância. Acompanhe Indexação > Páginas > "Não encontrada (404)" nas semanas seguintes.
7. Só então despublique o site do Wix.
8. GA4: em Fluxos de dados, troque a URL do fluxo para `https://www.pijamascorposensual.com.br`.

---

## 4. Google Ads (se houver campanha)

O Wix tem a conversão do Google Ads `AW-17034681970` (formulário da `/fabrica-pijamas`). O site novo já redireciona `/fabrica-pijamas` para `/fabrica-de-pijamas`, e o redirecionamento repassa o `gclid` e as UTMs.

- Se houver campanha ativa, informe quem cuida do site. A variável `NEXT_PUBLIC_GOOGLE_ADS_CONVERSAO=AW-17034681970/B6Q_CILj3MgaEPK84ro_` liga a mesma conversão no site novo, só para os cadastros de compra e só com o aceite de cookies.
- Até a troca de domínio, mantenha a URL final dos anúncios em `/fabrica-pijamas`, porque `/fabrica-de-pijamas` ainda dá 404 no Wix. Depois da troca, mude para `https://www.pijamascorposensual.com.br/fabrica-de-pijamas` (os endereços antigos redirecionam, mas o anúncio direto no endereço final evita um salto).
- Alternativa: vincular o GA4 ao Google Ads e importar o `generate_lead` como conversão.
- Não instale o GTM do Wix (GTM-W73SWD79) no site novo: ele captura o e-mail do formulário.

---

## 5. Perfil da Empresa no Google (Maps)

O perfil já existe, com 33 avaliações. **Não crie outro**, porque seria duplicado. O botão "Ver no mapa" do site já abre esse perfil.

1. Entre em https://business.google.com com a conta da empresa. Se ninguém tiver acesso, use "Reivindicar este perfil" no próprio Maps.
2. **Nome**: use o nome da fachada ("Corpo Sensual" ou "Pijamas Corpo Sensual"), sem " | Fábrica de Pijamas". Palavra-chave no nome é contra as regras do Google e pode suspender o perfil.
3. **Categoria**: principal "Fabricante de roupas" (se não existir, mantenha "Fabricante"). Secundárias: "Atacadista de roupas". Não use categoria de loja.
4. **Endereço, telefone e horário**: iguais aos do site. Quando o telefone e o horário estiverem definidos, preencha `NEXT_PUBLIC_TELEFONE` e `NEXT_PUBLIC_HORARIO` na Vercel para o site mostrar exatamente o mesmo.
5. **Site do perfil**: `https://www.pijamascorposensual.com.br/?utm_source=google&utm_medium=organic&utm_campaign=perfil-empresa`, para o GA separar quem vem do Maps. Nunca use o `sitecs.vercel.app`.
6. Há um segundo perfil, "PIJAMAS CORPO SENSUAL MURIAÉ" (R. Vicente Ferreira, 5). Se for endereço antigo, marque como "mudou-se" ou "duplicado". Se for uma unidade que recebe clientes, reivindique e corrija.
7. **Avaliações**: as vendedoras mandam o link "Pedir avaliações" para todo lojista depois da entrega. Responda todas as avaliações.
8. **Fotos**: fachada, costura, revisão, embalagem e expedição, com o arquivo original (não pelo WhatsApp).

---

## 6. Pendências de informação

- **Telefone e horário**: qual número da empresa atende ligação e qual é o horário real. Sem isso, o site não mostra telefone nem horário.
- **Instagram**: o site usa `@pijamascorposensual`. Se `@corposensual` também for da empresa, aponte a bio dele para o perfil principal. Coloque `https://www.pijamascorposensual.com.br` no link da bio depois da troca de domínio.
- **Domínio oficial** `pijamascorposensual.com.br`: está no nome de uma pessoa física e vence em 11/04/2027. Passe para o CNPJ da empresa e renove. O site "10 melhores fábricas de pijamas de Muriaé" (sacoleiradesucesso.com.br) ainda aponta para `loja.pijamascorposensual.com.br`, que redireciona para a home: vale pedir a troca do link.
