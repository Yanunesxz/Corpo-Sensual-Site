import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-2xl flex-col justify-center px-5 py-20 md:px-8">
      <p className="label">Erro 404</p>
      <h1 className="h-display mt-3 text-5xl md:text-7xl">Página não encontrada</h1>
      <p className="mt-5 text-[15px] text-ink-soft">O endereço pode ter mudado ou a página não existe mais.</p>
      <Link href="/" className="btn btn-dark mt-8 self-start">
        Ir para a página inicial
      </Link>
    </section>
  );
}
