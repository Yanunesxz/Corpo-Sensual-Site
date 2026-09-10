import type { Metadata } from "next";
import Image from "next/image";
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

// Fotos de campanha usadas só como ilustração da faixa do Instagram.
const vitrine = [
  "/images/colecoes/delicias-1.jpg",
  "/images/colecoes/entrelacos-2.jpg",
  "/images/colecoes/delicias-4.jpg",
  "/images/colecoes/entrelacos-4.jpg",
];

export default async function ObrigadoPage({ searchParams }: PageProps<"/obrigado">) {
  const { origem } = await searchParams;
  const key = typeof origem === "string" && origem in messages ? origem : "default";
  const m = messages[key];
  const wa = whatsappLink("Olá! Acabei de me cadastrar no site da Corpo Sensual.");
  const c = site.contact;

  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <h1 className="h-hero text-[2rem] md:text-[2.375rem]">{m.title}</h1>
          <p className="mt-6 text-lg leading-[1.3] text-body">{m.text}</p>
          <p className="mt-3 text-lg leading-[1.3] text-body">
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
            <Link href="/fabrica-de-pijamas#perguntas" className="link self-start text-sm sm:self-auto">
              Perguntas frequentes
            </Link>
            <Link href="/contato" className="link self-start text-sm sm:self-auto">
              Outros contatos
            </Link>
          </div>
        </div>
      </section>

      {/* Faixa azul-clara do Instagram, como na página de obrigado do site atual */}
      {c.instagram && (
        <section className="bg-sky">
          <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
            <h2 className="h-display max-w-md text-3xl md:text-[2.5rem]">Siga o nosso perfil do Instagram</h2>
            <p className="mt-4 max-w-xl text-[1.125rem] leading-[1.6] text-body">
              Enquanto isso, acompanhe as novidades no Instagram{" "}
              <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="link">
                @{c.instagram}
              </a>
              .
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {vitrine.map((src) => (
                <div key={src} className="relative aspect-[4/5] overflow-hidden rounded-media bg-sky-soft">
                  <Image src={src} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
