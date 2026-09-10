-- =============================================================================
-- Corpo Sensual - schema inicial
-- Rode no SQL Editor do Supabase (ou com `supabase db push`).
-- =============================================================================

create extension if not exists pgcrypto;

-- Atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- Categorias (Gestante, Masculino, Juvenil, Robes...)
-- -----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Coleções (Verão 2024, Inverno 2025...)
-- -----------------------------------------------------------------------------
create table if not exists public.collections (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  season         text not null default 'atemporal'
                 check (season in ('verao', 'inverno', 'atemporal')),
  year           integer,
  headline       text,
  description    text,
  hero_image_url text,
  hero_mobile_url text,                          -- foto vertical para o hero no celular
  gallery_urls   text[] not null default '{}',   -- fotos de campanha da coleção
  active         boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Produtos
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  ref           text unique,                 -- referência interna (ex.: CS-2401)
  slug          text not null unique,
  name          text not null,
  description   text,
  category_id   uuid references public.categories(id) on delete set null,
  collection_id uuid references public.collections(id) on delete set null,
  is_new        boolean not null default false,   -- aparece em "Chegou agora"
  is_featured   boolean not null default false,   -- aparece em "Em destaque"
  active        boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_collection_idx on public.products (collection_id);
create index if not exists products_category_idx   on public.products (category_id);
create index if not exists products_listing_idx    on public.products (active, sort_order);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Imagens dos produtos (URL pública do Storage ou caminho em /public)
-- -----------------------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

-- -----------------------------------------------------------------------------
-- Leads capturados nos formulários do site
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  whatsapp     text not null,             -- só dígitos, com DDD
  has_cnpj     boolean not null default false,
  document     text,                      -- CNPJ do lojista ou CPF do consumidor, só dígitos
  company      text,
  city         text,
  state        text,
  message      text,
  source       text not null
               check (source in ('catalogo', 'fabrica-de-pijamas', 'programa-cashback', 'colecao', 'contato')),
  page_url     text,
  referrer     text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  status       text not null default 'novo'
               check (status in ('novo', 'em_contato', 'convertido', 'descartado')),
  notes        text,                      -- anotações internas da equipe comercial
  created_at   timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_source_idx  on public.leads (source);
create index if not exists leads_status_idx  on public.leads (status);

-- =============================================================================
-- Row Level Security
-- O site usa a chave pública (anon). Ela só pode:
--   - ler categorias, coleções, produtos e imagens ATIVOS
--   - inserir leads (nunca ler, alterar ou apagar)
-- Tudo o mais é feito pelo painel do Supabase ou com a service role.
-- =============================================================================
alter table public.categories     enable row level security;
alter table public.collections    enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.leads          enable row level security;

create policy "site le categorias ativas"
  on public.categories for select
  to anon, authenticated
  using (active);

create policy "site le colecoes ativas"
  on public.collections for select
  to anon, authenticated
  using (active);

create policy "site le produtos ativos"
  on public.products for select
  to anon, authenticated
  using (active);

create policy "site le imagens de produtos ativos"
  on public.product_images for select
  to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.active));

create policy "site cadastra leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

-- =============================================================================
-- Storage: bucket público para fotos de produtos e coleções
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

create policy "leitura publica do bucket produtos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'produtos');
