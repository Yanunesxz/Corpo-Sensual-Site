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
    text: "Nossa equipe confirma os dados da sua loja e libera o acesso ao catálogo digital com a tabela de atacado.",
  },
  "fabrica-de-pijamas": {
    title: "Recebemos o seu interesse",
    text: "O representante da sua região vai falar com você para apresentar o catálogo, os preços e as condições.",
  },
  "programa-cashback": {
    title: "Você está quase lá",
    text: "Vamos entrar em contato para confirmar a sua participação e explicar as regras do programa.",
  },
  contato: {
    title: "Mensagem recebida",
    text: "Obrigado pelo contato. Vamos responder pelo e-mail ou WhatsApp que você informou.",
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
  const c = site.contact;

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-16 md:px-8">
      <p className="label">Obrigado</p>
      <h1 className="h-display mt-3 text-5xl md:text-7xl">{m.title}</h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">{m.text}</p>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        Retornamos em horário comercial{c.hours ? `, ${c.hours.toLowerCase()}` : ""}. Fique de olho no telefone e no e-mail
        informados.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
        {wa ? (
          <a href={wa} target="_blank" rel="noreferrer" className="btn btn-dark w-full sm:w-auto">
            Falar agora no WhatsApp
          </a>
        ) : (
          <Link href="/colecoes" className="btn btn-dark w-full sm:w-auto">
            Ver as coleções
          </Link>
        )}
        <Link href="/fabrica-de-pijamas#perguntas" className="link self-start text-[13px] sm:self-auto">
          Perguntas frequentes
        </Link>
        <Link href="/contato" className="link self-start text-[13px] sm:self-auto">
          Outros contatos
        </Link>
      </div>

      {c.instagram && (
        <p className="mt-10 text-sm text-ink-soft">
          Enquanto isso, acompanhe as novidades no Instagram{" "}
          <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="underline">
            @{c.instagram}
          </a>
          .
        </p>
      )}
    </section>
  );
}
