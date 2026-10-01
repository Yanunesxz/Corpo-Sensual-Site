import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "Página não encontrada" };

/** Para onde a pessoa pode ir: o cadastro primeiro, depois as vitrines e o atendimento. */
const atalhos = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/fabrica-de-pijamas", label: "Para lojistas" },
  { href: "/ajuda", label: "Já sou cliente" },
] as const;

export default function NotFound() {
  return (
    // data-ga-404: o Google Analytics registra a visita como "Página não encontrada (404)".
    <section data-ga-404 className="bg-sky">
      <div className="wrap grid gap-y-10 pb-16 pt-10 md:pb-20 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-28">
        <div className="lg:col-span-6">
          <p className="eyebrow eyebrow-fio">Erro 404</p>
          <h1 className="t-hero mt-3 max-w-[12ch]">Página não encontrada</h1>
          <p className="lead mt-5 max-w-md md:mt-6">O endereço pode ter mudado ou a página não existe mais. Veja por onde continuar:</p>
          <Link href="/" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            Ir para a página inicial
            <ArrowRight width={18} height={18} className="seta" />
          </Link>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {atalhos.map((a) => (
              <li key={a.href} className="flex">
                <Link
                  href={a.href}
                  className="group flex min-h-28 w-full flex-col justify-between gap-6 bg-paper p-4 shadow-[var(--shadow-card)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-ink)] sm:p-5 md:min-h-36 md:p-6"
                >
                  <span className="t-sub">{a.label}</span>
                  <ArrowRight
                    width={22}
                    height={22}
                    className="self-end text-ink transition-transform duration-250 ease-saida group-hover:translate-x-[3px] motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 md:mt-8">
            <Link href="/contato" className="link-seta">
              Contato
              <ArrowRight width={18} height={18} />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
