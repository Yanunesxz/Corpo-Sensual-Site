import type { Metadata } from "next";
import Link from "next/link";
import { CartoesAtendimento } from "@/components/cartoes-atendimento";
import { ArrowRight, Check } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Você já é nosso cliente",
  robots: { index: false, follow: false },
};

/**
 * Para onde vai quem começa o cadastro com o CNPJ ou o CPF de um cliente da Corpo
 * Sensual (pedido do Yan, 11/11/2026: "travar os clientes que já são nossos clientes").
 * O cadastro para no passo do documento e nada vai para o CRM: cliente não vira lead.
 *
 * 1. Parabéns: a pessoa já é cliente e não precisa se cadastrar.
 * 2. Precisa de ajuda?: os mesmos cartões de SAC e financeiro de /ajuda.
 *
 * Fora do sitemap e sem indexação: só faz sentido logo depois do cadastro.
 */
export default function JaEClientePage() {
  const horario = site.contact.hours ? site.contact.hours.toLowerCase() : "em horário comercial";

  return (
    <>
      {/* 1. Parabéns. */}
      <section className="wrap pb-14 pt-10 md:pb-20 md:pt-16 lg:pb-24 lg:pt-24">
        <div className="max-w-3xl">
          <span aria-hidden className="flex h-12 w-12 items-center justify-center rounded-full bg-noite text-white md:h-14 md:w-14">
            <Check width={26} height={26} strokeWidth={2} />
          </span>
          <p className="eyebrow mt-7 md:mt-8">Cadastro encontrado</p>
          <h1 className="t-hero mt-3 max-w-[15ch]">Parabéns, você já é nosso cliente!</h1>
          <p className="lead mt-5 max-w-xl md:mt-6">
            Encontramos o seu cadastro na Corpo Sensual, então não precisa se cadastrar de novo.
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-[1.6] text-body">
            Para um novo pedido, fale com o representante ou a vendedora que já atende você.
          </p>

          <div className="mt-8 flex flex-col items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 md:mt-10">
            <a href="#ajuda" className="btn btn-primary btn-lg mb-5 w-full sm:mb-0 sm:mr-2 sm:w-auto">
              Preciso de ajuda
              <ArrowRight width={18} height={18} className="seta rotate-90" />
            </a>
            <Link href="/colecoes" className="link-seta">
              Ver as coleções
              <ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Precisa de ajuda: a mesma tela de /ajuda, com o SAC e o financeiro. */}
      <section id="ajuda" className="bg-sky">
        <div className="wrap pb-16 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
          <div className="grid gap-y-5 lg:grid-cols-12 lg:items-end lg:gap-x-10">
            <div className="lg:col-span-7">
              <p className="eyebrow eyebrow-fio">Atendimento</p>
              <h2 className="t-titulo mt-3">Precisa de ajuda?</h2>
            </div>
            <p className="lead max-w-xl lg:col-span-5 lg:pb-1.5">
              Escolha o assunto e fale direto com quem resolve, pelo WhatsApp. Atendimento {horario}.
            </p>
          </div>

          <CartoesAtendimento />

          <p className="mt-10 text-[15px] text-body md:mt-12">
            <Link href="/politicas/envio" className="link-seta">
              Política de envio
              <ArrowRight width={18} height={18} />
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
