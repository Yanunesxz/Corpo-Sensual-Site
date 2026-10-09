-- Origens novas de lead: "representante" (cadastro de representante, que já existia no
-- site mas não estava na regra da tabela) e "varejo" (consumidor final que pede a loja
-- mais perto, em /onde-comprar). Sem isso o insert em `leads` falha para essas origens.
-- Rodar no SQL Editor do Supabase do site.

alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads
  add constraint leads_source_check
  check (source in ('catalogo', 'fabrica-de-pijamas', 'programa-cashback', 'colecao', 'contato', 'representante', 'varejo'));
