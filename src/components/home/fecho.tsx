import Image from "next/image";
import Link from "next/link";
import { TOTAL_REFERENCIAS } from "@/lib/site";
import { altFoto } from "@/lib/content/alt-fotos";
import { SectionHeading } from "@/components/section-heading";
import { Passos } from "@/components/passos";
import { BlocoCadastro } from "@/components/bloco-cadastro";

const RIACHO = "/images/editorial/riacho.jpg";
const ORQUIDEA = "/images/editorial/orquidea.jpg";

const PASSOS = [
  { titulo: "Cadastre a sua loja", texto: "CNPJ não é obrigatório." },
  { titulo: "Receba o catálogo", texto: "Com grade e tabela de preços." },
  { titulo: "Monte o seu pedido", texto: "Sem pedido mínimo, com uma vendedora no WhatsApp." },
];

/**
 * Fecho da home: o cadastro na própria página, sem mais um clique até o catálogo.
 * Desktop: colagem de revista à esquerda (riacho e, por cima, a orquídea deslocada
 * para baixo e para a direita, sem cobrir a modelo). Nasce centralizada na altura da
 * coluna do formulário e fica presa na tela enquanto o formulário rola ao lado.
 * Celular: só o texto, os passos e o formulário (a colagem some).
 * data-sem-barra: a barra fixa não cobre o botão de envio.
 */
export function FechoHome() {
  return (
    <section id="receber" className="sec scroll-mt-16 bg-sky" data-sem-barra>
      <div className="wrap lg:grid lg:grid-cols-12 lg:gap-x-10">
        <div className="relative hidden lg:sticky lg:top-28 lg:col-span-5 lg:block lg:self-center lg:pb-[30%]" data-reveal>
          <div className="relative aspect-[4/5] w-[88%] overflow-hidden bg-sky-deep">
            <Image src={RIACHO} alt={altFoto(RIACHO, "Campanha Delícias de Verão")} fill sizes="(min-width: 1440px) 480px, 34vw" className="object-cover object-[center_45%]" />
          </div>
          <div className="absolute -right-[12%] bottom-0 w-[40%] border-[10px] border-sky bg-sky">
            <div className="relative aspect-[2/3] overflow-hidden bg-sky-deep">
              <Image src={ORQUIDEA} alt={altFoto(ORQUIDEA, "Orquídeas no jardim da campanha")} fill sizes="(min-width: 1440px) 200px, 14vw" className="object-cover" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading
            eyebrow="Catálogo digital"
            title={`As ${TOTAL_REFERENCIAS} referências na sua mão`}
            description="Cadastre a sua loja e receba o catálogo das duas coleções, com grade e tabela de preços. Depois do envio, você escolhe com quem falar no WhatsApp."
          />
          <Passos itens={PASSOS} className="mt-8 lg:mt-10" />
          <BlocoCadastro source="catalogo" submitLabel="Quero receber o catálogo" className="mt-8 lg:mt-12" />
          <p className="mt-6 text-[15px] text-body">
            Ficou alguma dúvida?{" "}
            <Link href="/fabrica-de-pijamas#perguntas" className="link">
              Veja as perguntas frequentes
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
