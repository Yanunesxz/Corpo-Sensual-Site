import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center px-5 pb-24 pt-32 text-center">
      <p className="eyebrow">Erro 404</p>
      <h1 className="display mt-4 text-5xl md:text-7xl">Página não encontrada</h1>
      <p className="mt-5 text-ink-soft">O endereço pode ter mudado ou a página não existe mais.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Ir para a página inicial <ArrowRight width={18} height={18} />
      </Link>
    </section>
  );
}
