-- =============================================================================
-- 0002 — Ligação dos leads com o CRM (CSP 360)
-- Rodar no SQL Editor do projeto Supabase do site, uma vez. Idempotente.
--
-- Cada lead continua sendo gravado aqui (cópia de segurança e auditoria). Na
-- mesma requisição o servidor do site chama a Edge Function `lead-site` do CRM
-- e grava nestas colunas o que o CRM devolveu. Se o CRM não responder, o lead
-- fica `pendente` e pode ser reenviado depois sem duplicar nada lá.
-- =============================================================================

alter table public.leads add column if not exists crm_status text not null default 'pendente'
  check (crm_status in ('enviado', 'pendente'));
alter table public.leads add column if not exists crm_cliente text;     -- código do cliente no CRM (CLI-0001)
alter table public.leads add column if not exists crm_negocio text;     -- código do negócio no CRM (NEG-0001)
alter table public.leads add column if not exists crm_erro text;        -- motivo, quando pendente
alter table public.leads add column if not exists crm_enviado_em timestamptz;

create index if not exists leads_crm_status_idx on public.leads (crm_status) where crm_status = 'pendente';

comment on column public.leads.crm_status is 'enviado = já está no CRM; pendente = reenviar (ver crm_erro)';
