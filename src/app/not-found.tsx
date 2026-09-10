import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <p className="label">Erro 404</p>
          <h1 className="h-hero mt-3 text-[2rem] md:text-[2.375rem]">Página não encontrada</h1>
          <p className="mt-6 text-lg leading-[1.3] text-body">
            O endereço pode ter mudado ou a página não existe mais. Veja por onde continuar:
          </p>
          <Link href="/" className="btn btn-dark mt-8 w-full sm:w-auto">
            Ir para a página inicial
          </Link>
        </div>
      </section>

      {/* Faixa azul-clara com os atalhos, para a página não terminar em branco vazio */}
      <section className="bg-sky">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <ul className="flex flex-col">
            {[...site.nav.filter((n) => n.href !== "/"), { href: "/catalogo", label: "Receber catálogo" }].map((n) => (
              <li key={n.href} className="flex">
                <Link
                  href={n.href}
                  className="inline-flex min-h-11 items-center self-start text-[1.0625rem] underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-55"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
