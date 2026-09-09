import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Há mais de 25 anos a Corpo Sensual confecciona pijamas, camisolas, robes e moda íntima em Muriaé, MG, para lojistas de todo o Brasil.",
};

const numbers = [
  { value: "+25", label: "anos de história" },
  { value: "100%", label: "fábrica própria" },
  { value: "Brasil", label: "atendimento nacional" },
];

const values = [
  { title: "Design atual", text: "Coleções inspiradas nas maiores tendências do Brasil, renovadas a cada temporada." },
  { title: "Qualidade garantida", text: "Tecidos selecionados, tecnologia anti-pilling e acabamento cuidado em cada peça." },
  { title: "Fábrica própria", text: "Produção verticalizada, com controle de qualidade do fio ao produto final." },
  { title: "Muriaé, MG", text: "Sede em um dos maiores polos de moda íntima do país, com logística para todo o Brasil." },
];

export default function SobrePage() {
  return (
    <>
      <section className="mx-auto max-w-[1600px] px-5 pt-12 md:px-8 md:pt-16">
        <p className="label">Sobre</p>
        <h1 className="h-display mt-3 max-w-4xl text-4xl md:text-6xl lg:text-8xl">Conforto e estilo, feitos com atenção aos detalhes</h1>
      </section>

      <section className="mx-auto grid max-w-[1600px] gap-10 px-5 py-14 md:grid-cols-2 md:gap-16 md:px-8 md:py-20">
        <div className="relative aspect-[4/5] bg-stone">
          <Image src="/images/colecoes/entrelacos-1.jpg" alt="Coleção Entrelaços" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-serif text-2xl italic leading-snug md:text-3xl">
            Já são mais de 25 anos de expertise dedicados ao bem-estar e à qualidade.
          </p>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">
            A {site.legal.razaoSocial} nasceu em Muriaé, Minas Gerais, e cresceu junto com o polo de moda íntima da
            região. Hoje desenvolvemos pijamas, camisolas, robes e linhas gestante, masculina e juvenil, vendidas em
            lojas de todo o país por meio da nossa rede de representantes.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            Investimos continuamente em modelagem, tecidos e tecnologia, tanto na fábrica quanto no relacionamento com
            o lojista, com plataforma digital de pedidos e catálogo sempre atualizado.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {numbers.map((n) => (
              <div key={n.label}>
                <p className="h-display text-4xl md:text-5xl">{n.value}</p>
                <p className="label mt-2 text-ink-soft">{n.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 pb-16 md:px-8 md:pb-24">
        <ul className="grid gap-x-10 border-t border-line md:grid-cols-2">
          {values.map((v) => (
            <li key={v.title} className="border-b border-line py-6">
              <h2 className="text-[15px] font-medium">{v.title}</h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-ink-soft">{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-stone">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <h2 className="h-display text-4xl md:text-6xl">
            Quer revender a<br />Corpo Sensual?
          </h2>
          <Link href="/catalogo" className="btn btn-dark self-start md:self-auto">
            Receber catálogo
          </Link>
        </div>
      </section>
    </>
  );
}
