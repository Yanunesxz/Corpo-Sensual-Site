import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ArrowRight, Factory, MapPin, Shield, Sparkle } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Há mais de 25 anos a Corpo Sensual confecciona pijamas, camisolas, robes e moda íntima em Muriaé, MG, para lojistas de todo o Brasil.",
};

const values = [
  { icon: Sparkle, title: "Design atual", text: "Coleções inspiradas nas maiores tendências do Brasil, renovadas a cada temporada." },
  { icon: Shield, title: "Qualidade garantida", text: "Tecidos selecionados, tecnologia anti-pilling e acabamento cuidado em cada peça." },
  { icon: Factory, title: "Fábrica própria", text: "Produção verticalizada, com controle de qualidade do fio ao produto final." },
  { icon: MapPin, title: "Muriaé, MG", text: "Sede em um dos maiores polos de moda íntima do país, com logística para todo o Brasil." },
];

const numbers = [
  { value: "+25", label: "anos de história" },
  { value: "100%", label: "fábrica própria" },
  { value: "Brasil", label: "atendimento nacional" },
];

export default function SobrePage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pt-44">
        <Reveal>
          <SectionHeading
            level="h1"
            eyebrow="Sobre nós"
            title="Conforto e estilo, feitos com atenção aos detalhes"
            description="Confeccionamos moda íntima combinando tecidos de boa qualidade, design moderno e cuidado em cada acabamento, para oferecer uma experiência excepcional ao consumidor final e um parceiro confiável ao lojista."
          />
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 md:grid-cols-[1fr_1fr] md:px-8 md:pb-28">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-card bg-cream-dark md:aspect-auto">
          <Image src="/images/destaque-1.jpg" alt="Peça da coleção Corpo Sensual" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </Reveal>
        <div className="flex flex-col justify-center gap-10">
          <Reveal>
            <p className="display text-2xl leading-snug md:text-3xl">
              Já são mais de 25 anos de expertise dedicados ao bem-estar e à qualidade.
            </p>
            <p className="mt-5 leading-relaxed text-ink-soft">
              A {site.legal.razaoSocial} nasceu em Muriaé, Minas Gerais, e cresceu junto com o polo de moda íntima da
              região. Hoje desenvolvemos pijamas, camisolas, robes e linhas gestante, masculina e juvenil, vendidas em
              lojas de todo o país por meio da nossa rede de representantes.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Investimos continuamente em modelagem, tecidos e tecnologia, tanto na fábrica quanto no relacionamento com
              o lojista, com plataforma digital de pedidos e catálogo sempre atualizado.
            </p>
          </Reveal>
          <Reveal delay={120} className="grid grid-cols-3 gap-4 border-t border-line pt-8">
            {numbers.map((n) => (
              <div key={n.label}>
                <p className="display text-3xl text-brand md:text-4xl">{n.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-soft">{n.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
          <Reveal>
            <SectionHeading eyebrow="O que nos move" title="Nossos compromissos" align="center" />
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 100} className="rounded-card border border-line bg-cream p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand shadow-sm">
                  <v.icon />
                </span>
                <h2 className="mt-6 text-lg font-medium">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <Reveal className="rounded-card bg-ink px-6 py-14 text-center text-white md:px-12">
          <p className="eyebrow text-butter">Para lojistas</p>
          <h2 className="display mt-4 text-3xl md:text-5xl">Quer revender a Corpo Sensual?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">
            Cadastre-se para receber o catálogo digital e falar com o representante da sua região.
          </p>
          <Link href="/catalogo" className="btn btn-light mt-8">
            Receber catálogo <ArrowRight width={18} height={18} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
