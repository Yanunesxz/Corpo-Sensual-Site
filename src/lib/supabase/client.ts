import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a chave pública (anon).
 * Serve tanto para leitura do catálogo quanto para gravar leads: o que cada
 * um pode fazer é controlado pelas políticas de RLS definidas na migration.
 *
 * Retorna null quando as variáveis de ambiente não estão configuradas, para o
 * site continuar funcionando com os dados de exemplo (ver fallback-data.ts).
 */
export function isSupabaseConfigured(): boolean {
  // trim: o Vercel pode importar as variáveis do .env.example com valor vazio.
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  cached = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  return cached;
}
