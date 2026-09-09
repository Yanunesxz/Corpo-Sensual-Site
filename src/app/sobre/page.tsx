import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ContactBlock } from "@/components/contact-block";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Há mais de 25 anos a Corpo Sensual confecciona pijamas, camisolas, robes e moda íntima em Muriaé, MG, para lojistas de todo o Brasil.",
};

const facts = [
  { label: "Sede e fábrica", value: `${site.legal.cidade}, ${site.legal.uf}, polo nacional de moda íntima` },
  { label: "Tempo de mercado", value: "Mais de 25 anos" },
  { label: "O que fabricamos", value: "Pijamas, short dolls, camisolas e robes" },
  { label: "Linhas", value: "Feminina, masculina, infantil e gestante" },
  { label: "Coleções", value: "Duas por ano: primavera/verão e outono/inverno" },
  { label: "Como vendemos", value: "No atacado, para lojas com CNPJ, por representantes em todo o Brasil" },
];

const values = [
  { title: "Design atual", text: "Coleções inspiradas nas maiores tendências do Brasil, renovadas a cada temporada." },
  { title: "Qualidade garantida", text: "Tecidos selecionados, tecnologia anti-pilling e acabamento cuidado em cada peça." },
  { title: "Fábrica própria", text: "Produção verticalizada, com controle de qualidade do fio ao produto final." },
  { title: "Perto do lojista", text: "Representante na sua região, plataforma digital de pedidos e catálogo sempre atualizado." },
];

export default function SobrePage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-10 md:px-8 md:pt-16">
        <p className="label">Sobre</p>
        <h1 className="h-display mt-3 max-w-4xl text-4xl md:text-6xl lg:text-7xl">Conforto e estilo, feitos com atenção aos detalhes</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed md:text-base">
          A {site.legal.razaoSocial} é uma fábrica de pijamas e moda íntima em {site.legal.cidade}, {site.legal.uf}. Há mais de
          25 anos desenvolvemos e produzimos peças vendidas por lojas de todo o Brasil.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-10 px-5 py-12 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
        <div className="flex flex-col justify-center md:order-1">
          <p className="font-serif text-2xl italic leading-snug md:text-3xl">
            Já são mais de 25 anos de expertise dedicados ao bem‑estar e à qualidade.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            A empresa nasceu em Muriaé, Minas Gerais, e cresceu junto com o polo de moda íntima da região. Hoje
            desenvolvemos pijamas, camisolas, robes e linhas gestante, masculina e infantil, vendidas em lojas de todo o
            país por meio da nossa rede de representantes.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Investimos continuamente em modelagem, tecidos e tecnologia, tanto na fábrica quanto no relacionamento com
            o lojista, com plataforma digital de pedidos e catálogo sempre atualizado.
          </p>
        </div>
        <div className="relative aspect-[4/5] bg-stone md:order-0">
          <Image src="/images/colecoes/entrelacos-1.jpg" alt="Coleção Entrelaços" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 md:px-8">
        <h2 className="h-display text-2xl md:text-3xl">A empresa em resumo</h2>
        <dl className="mt-4 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:gap-x-10 md:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="py-4 sm:border-b sm:border-line sm:last:border-b-0">
              <dt className="label text-ink-soft">{f.label}</dt>
              <dd className="mt-1 text-[15px] leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-12 md:px-8 md:py-20">
        <h2 className="h-display text-2xl md:text-3xl">Nossos diferenciais</h2>
        <ul className="mt-4 grid gap-x-10 border-t border-line md:grid-cols-2">
          {values.map((v) => (
            <li key={v.title} className="border-b border-line py-5">
              <h3 className="text-[15px] font-medium">{v.title}</h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-12 md:px-8 md:pb-20">
        <h2 className="h-display text-2xl md:text-3xl">Onde estamos</h2>
        <div className="mt-6">
          <ContactBlock />
        </div>
      </section>

      <section className="bg-stone">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <h2 className="h-display text-4xl md:text-6xl">
            Quer revender a<br />Corpo Sensual?
          </h2>
          <Link href="/catalogo" className="btn btn-dark w-full sm:w-auto md:self-auto">
            Receber catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
