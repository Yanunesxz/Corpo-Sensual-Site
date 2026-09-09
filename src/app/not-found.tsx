import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-16 md:px-8">
      <p className="label">Erro 404</p>
      <h1 className="h-display mt-3 text-4xl md:text-7xl">Página não encontrada</h1>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
        O endereço pode ter mudado ou a página não existe mais. Veja por onde continuar:
      </p>
      <Link href="/" className="btn btn-dark mt-8 w-full sm:w-auto sm:self-start">
        Ir para a página inicial
      </Link>
      <ul className="mt-6 flex flex-col">
        {[...site.nav.filter((n) => n.href !== "/"), { href: "/catalogo", label: "Receber catálogo" }].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="inline-flex min-h-11 items-center text-[15px] underline underline-offset-4">
                {n.label}
              </Link>
            </li>
          ))}
      </ul>
    </section>
  );
}
