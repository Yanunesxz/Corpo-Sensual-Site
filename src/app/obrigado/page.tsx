import type { Metadata } from "next";
import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { ArrowRight, Check, WhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Cadastro recebido",
  robots: { index: false, follow: false },
};

const messages: Record<string, { title: string; text: string }> = {
  catalogo: {
    title: "Cadastro recebido!",
    text: "Nossa equipe vai entrar em contato em breve para liberar o seu acesso ao catálogo digital.",
  },
  "fabrica-de-pijamas": {
    title: "Recebemos o seu interesse!",
    text: "O representante da sua região vai falar com você para apresentar o catálogo, os preços e as condições.",
  },
  "programa-cashback": {
    title: "Você está quase lá!",
    text: "Vamos entrar em contato para confirmar a sua participação e explicar as regras do programa.",
  },
  default: {
    title: "Mensagem recebida!",
    text: "Obrigado pelo contato. Em breve retornaremos.",
  },
};

export default async function ObrigadoPage({ searchParams }: PageProps<"/obrigado">) {
  const { origem } = await searchParams;
  const key = typeof origem === "string" && origem in messages ? origem : "default";
  const m = messages[key];
  const wa = whatsappLink("Olá! Acabei de me cadastrar no site da Corpo Sensual.");

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-5 pb-24 pt-32 text-center md:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
        <Check width={32} height={32} />
      </span>
      <h1 className="display mt-8 text-4xl md:text-6xl">{m.title}</h1>
      <p className="mt-5 max-w-md text-lg text-ink-soft">{m.text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {wa && (
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary">
            <WhatsApp width={18} height={18} /> Falar agora no WhatsApp
          </a>
        )}
        <Link href="/colecoes" className="btn btn-outline">
          Ver coleções <ArrowRight width={18} height={18} />
        </Link>
      </div>
      {site.contact.instagram && (
        <p className="mt-10 text-sm text-ink-soft">
          Enquanto isso, acompanhe as novidades no Instagram{" "}
          <a href={`https://instagram.com/${site.contact.instagram}`} target="_blank" rel="noreferrer" className="underline">
            @{site.contact.instagram}
          </a>
          .
        </p>
      )}
    </section>
  );
}
