import type { Metadata } from "next";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cadastro recebido",
  robots: { index: false, follow: false },
};

const messages: Record<string, { title: string; text: string }> = {
  catalogo: {
    title: "Cadastro recebido",
    text: "Nossa equipe vai entrar em contato em breve para liberar o seu acesso ao catálogo digital.",
  },
  "fabrica-de-pijamas": {
    title: "Recebemos o seu interesse",
    text: "O representante da sua região vai falar com você para apresentar o catálogo, os preços e as condições.",
  },
  "programa-cashback": {
    title: "Você está quase lá",
    text: "Vamos entrar em contato para confirmar a sua participação e explicar as regras do programa.",
  },
  default: {
    title: "Mensagem recebida",
    text: "Obrigado pelo contato. Em breve retornaremos.",
  },
};

export default async function ObrigadoPage({ searchParams }: PageProps<"/obrigado">) {
  const { origem } = await searchParams;
  const key = typeof origem === "string" && origem in messages ? origem : "default";
  const m = messages[key];
  const wa = whatsappLink("Olá! Acabei de me cadastrar no site da Corpo Sensual.");

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="label">Obrigado</p>
      <h1 className="h-display mt-3 text-5xl md:text-7xl">{m.title}</h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">{m.text}</p>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-dark">
            Falar no WhatsApp
          </a>
        )}
        <Link href="/colecoes" className="link text-[13px]">
          Ver coleções
        </Link>
      </div>
      {site.contact.instagram && (
        <p className="mt-10 text-sm text-ink-soft">
          Acompanhe as novidades no Instagram{" "}
          <a href={`https://instagram.com/${site.contact.instagram}`} target="_blank" rel="noreferrer" className="underline">
            @{site.contact.instagram}
          </a>
          .
        </p>
      )}
    </section>
  );
}
