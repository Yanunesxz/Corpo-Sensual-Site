import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Beneficios } from "@/components/beneficios";
import { Faq } from "@/components/faq";
import { SectionHeading } from "@/components/section-heading";
import { faqCurto } from "@/lib/content/faq";
import { site, TOTAL_REFERENCIAS } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";

export const metadata: Metadata = {
  title: "Receba o catálogo de pijamas no atacado",
  description:
    "Cadastre sua loja e receba o catálogo digital da Corpo Sensual com a nova coleção de pijamas, camisolas e moda íntima e a tabela de preços de atacado.",
  alternates: { canonical: "/catalogo" },
};

const FOTO = "/images/colecoes/delicias-3.jpg";

/** O que acontece depois do envio: tira a dúvida "e agora, quem me liga?". */
const DEPOIS = [
  { titulo: "Você escolhe a vendedora", texto: "Logo após o envio, fale com a Nicoli ou a Simone pelo WhatsApp, se quiser adiantar." },
  { titulo: "Recebe o catálogo", texto: `As ${TOTAL_REFERENCIAS} referências, com a grade de tamanhos e a tabela de preços de atacado.` },
  { titulo: "Monta o pedido", texto: "Sem valor mínimo. O pedido sai da fábrica em até 15 dias úteis." },
];

/**
 * A página para onde vão todos os botões "Receber catálogo". Não tem o que
 * distrair: título, condições e o formulário. No desktop a foto fica presa à
 * esquerda enquanto a pessoa preenche.
 */
export default function CatalogoPage() {
  return (
    <>
      <section className="bg-sky">
        <div className="wrap grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-16">
          <div className="relative hidden overflow-hidden rounded-card bg-sky-deep lg:sticky lg:top-28 lg:block lg:h-[calc(100svh-9rem)] lg:max-h-[52rem]">
            <Image src={FOTO} alt={altFoto(FOTO, "Peça da coleção Delícias de Verão")} fill priority sizes="(min-width: 1360px) 560px, 42vw" className="object-cover object-[center_25%]" />
            <p className="tag absolute left-5 top-5">Delícias de Verão · Primavera / Verão 2027</p>
          </div>

          <div>
            <h1>
              <span className="eyebrow">Catálogo digital de atacado</span>
              <span className="t-hero mt-3 block lg:mt-5">Receba o catálogo com grade e tabela de preços</span>
            </h1>
            <p className="lead mt-4 max-w-xl">
              As {TOTAL_REFERENCIAS} referências das duas coleções do ano. O{" "}
              <Link href="/colecoes" className="link">
                site mostra só uma parte
              </Link>
              . Leva um minuto. {site.commercial.noCnpjNote}
            </p>
            <Beneficios variante="lista" className="mt-6" />

            <div className="mt-8 rounded-card bg-paper p-5 shadow-[var(--shadow-card)] md:p-8">
              <LeadForm source="catalogo" submitLabel="Quero receber o catálogo" />
            </div>
            <p className="mt-3 text-[13px] text-muted">*{site.commercial.freeShippingNote}</p>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="wrap sec grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Depois do cadastro" title="O que acontece agora" />
            <ol className="mt-8 space-y-6">
              {DEPOIS.map((p, i) => (
                <li key={p.titulo} className="flex gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-noite font-[family-name:var(--font-button)] text-[15px] text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1">
                    <span className="t-sub block">{p.titulo}</span>
                    <span className="mt-1 block text-[15px] leading-[1.6] text-body md:text-base">{p.texto}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Perguntas frequentes" title="Antes de se cadastrar" />
            <div className="mt-8">
              <Faq items={faqCurto.slice(0, 3)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
