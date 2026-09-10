import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ContactBlock } from "@/components/contact-block";
import { Steps } from "@/components/steps";
import { passosLojista } from "@/lib/content/lojistas";

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
      {/* Abertura da página: único título com .h-hero (letter-spacing do site atual) */}
      <section className="mx-auto max-w-[1600px] px-5 pt-12 pb-14 md:px-8 md:pt-20 md:pb-20">
        <h1 className="h-hero max-w-3xl text-[2rem] md:text-[2.375rem]">
          Conforto e estilo, feitos com atenção aos detalhes
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-[1.3] text-body">
          A {site.name} é uma fábrica própria de pijamas, camisolas, robes e moda íntima em {site.legal.cidade},{" "}
          {site.legal.uf}. Há mais de 25 anos vendemos no atacado para lojistas de todo o Brasil, por representantes e
          pela plataforma digital de pedidos.
        </p>
      </section>

      <section className="bg-sky">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
          <div className="flex flex-col justify-center md:order-1">
            <p className="h-display text-[1.75rem] md:text-[2.25rem]">
              Já são mais de 25 anos de expertise dedicados ao bem‑estar e à qualidade.
            </p>
            <p className="mt-6 text-[1.125rem] leading-[1.6] text-body">
              A empresa nasceu em Muriaé, Minas Gerais, e cresceu junto com o polo de moda íntima da região. Hoje
              desenvolvemos pijamas, camisolas, robes e linhas gestante, masculina e infantil, vendidas em lojas de todo o
              país por meio da nossa rede de representantes.
            </p>
            <p className="mt-4 text-[1.125rem] leading-[1.6] text-body">
              Investimos continuamente em modelagem, tecidos e tecnologia, tanto na fábrica quanto no relacionamento com
              o lojista, com plataforma digital de pedidos e catálogo sempre atualizado.
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-media bg-sky-soft md:order-0">
            <Image src="/images/colecoes/entrelacos-1.jpg" alt="Coleção Entrelaços" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">A empresa em resumo</h2>
        <dl className="mt-8 grid border-t border-line sm:grid-cols-2 sm:gap-x-10 md:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-line py-5">
              <dt className="label">{f.label}</dt>
              <dd className="mt-1 text-[1.0625rem] leading-[1.5]">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-sky-soft">
        <div className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Nossos diferenciais</h2>
          <ul className="mt-8 grid gap-x-10 border-t border-line md:grid-cols-2">
            {values.map((v) => (
              <li key={v.title} className="border-b border-line py-6">
                <h3 className="text-[1.0625rem] font-medium text-ink">{v.title}</h3>
                <p className="mt-2 max-w-md text-[1.0625rem] leading-[1.6] text-body">{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 md:px-8 md:py-20">
        <h2 className="h-display text-3xl md:text-[2.5rem]">Como comprar</h2>
        <p className="mt-4 max-w-2xl text-[1.125rem] leading-[1.6] text-body">
          {site.commercial.exclusive} {site.commercial.minOrder}, {site.commercial.installments.toLowerCase()}.
        </p>
        <div className="mt-8 max-w-2xl">
          <Steps steps={passosLojista} />
        </div>
        <Link href="/fabrica-de-pijamas#perguntas" className="link mt-6 text-sm">
          Perguntas frequentes de lojistas
        </Link>
      </section>

      {/* Segue no mesmo fundo branco da seção acima; a divisória separa os dois blocos */}
      <section className="mx-auto max-w-[1600px] px-5 pb-14 md:px-8 md:pb-20">
        <div className="border-t border-line pt-12 md:pt-16">
          <h2 className="h-display text-3xl md:text-[2.5rem]">Onde estamos</h2>
          <div className="mt-8">
            <ContactBlock />
          </div>
        </div>
      </section>

      <section className="bg-sky">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-24">
          <h2 className="h-display text-4xl md:text-[3.125rem]">
            Quer revender a<br />Corpo Sensual?
          </h2>
          <div className="md:shrink-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn btn-dark w-full whitespace-nowrap sm:w-auto">
                Receber catálogo
              </Link>
              <Link href="/contato" className="btn btn-outline w-full whitespace-nowrap sm:w-auto">
                Falar com a gente
              </Link>
            </div>
            <p className="mt-3 text-sm text-body">*{site.commercial.exclusive}</p>
          </div>
        </div>
      </section>
    </>
  );
}
