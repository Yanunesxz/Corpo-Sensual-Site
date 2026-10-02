import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = { title: "Página não encontrada" };

/** Para onde a pessoa pode ir: o cadastro primeiro, depois as vitrines e o atendimento. */
const atalhos = [
  { href: "/catalogo", label: "Receber catálogo" },
  { href: "/colecoes", label: "Coleções" },
  { href: "/fabrica-de-pijamas", label: "Para lojistas" },
  { href: "/ajuda", label: "Já sou cliente" },
  { href: "/contato", label: "Contato" },
] as const;

/** No desktop, a foto da campanha ao lado (no celular ela não existe nem é baixada). */
const FOTO = "/images/home/fechamento.jpg";

export default function NotFound() {
  return (
    // data-ga-404: o Google Analytics registra a visita como "Página não encontrada (404)".
    <section data-ga-404 className="bg-sky">
      <div className="wrap grid gap-y-10 pb-16 pt-10 md:pb-20 md:pt-16 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:py-24">
        <div className="lg:col-span-6">
          <p className="eyebrow eyebrow-fio">Erro 404</p>
          <h1 className="t-hero mt-3 max-w-[12ch]">Página não encontrada</h1>
          <p className="lead mt-5 max-w-md md:mt-6">O endereço pode ter mudado ou a página não existe mais. Veja por onde continuar:</p>
          <Link href="/" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            Ir para a página inicial
            <ArrowRight width={18} height={18} className="seta" />
          </Link>

          {/* Atalhos numa lista com fio, como um índice de revista. */}
          <ul className="mt-10 max-w-lg divide-y divide-line border-y border-line md:mt-12">
            {atalhos.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="group flex min-h-14 items-center justify-between gap-4 py-2 text-ink">
                  <span className="t-sub">{a.label}</span>
                  <ArrowRight
                    width={20}
                    height={20}
                    className="flex-none transition-transform duration-300 group-hover:translate-x-[3px] motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden bg-sky-deep lg:col-span-5 lg:col-start-8 lg:block">
          <Image
            src={FOTO}
            alt={altFoto(FOTO, "Modelo à beira da piscina, coleção Delícias de Verão")}
            fill
            sizes="(min-width: 1440px) 540px, (min-width: 1024px) 38vw, 1px"
            className="object-cover object-[center_35%]"
          />
        </div>
      </div>
    </section>
  );
}
