import type { Metadata } from "next";
import Link from "next/link";
import { BlocoCadastro } from "@/components/bloco-cadastro";

export const metadata: Metadata = {
  title: "Onde comprar pijamas Corpo Sensual",
  description:
    "As peças da Corpo Sensual são vendidas em lojas de moda íntima e pijamas de todo o Brasil. Deixe o seu contato e a sua cidade que indicamos a loja mais perto de você.",
  alternates: { canonical: "/onde-comprar" },
};

/*
 * Para o consumidor final (varejo), que quer comprar e não é lojista. A fábrica só
 * vende no atacado: aqui a pessoa deixa um cadastro curto (nome, WhatsApp, e-mail,
 * cidade e UF) e o lead cai no CRM com a página "Varejo — onde comprar", separado
 * dos lojistas e dos representantes, para a equipe indicar a loja mais perto.
 */
export default function OndeComprarPage() {
  return (
    <section className="sec bg-sky">
      <div className="wrap grid gap-y-10 lg:grid-cols-12 lg:items-center lg:gap-x-10">
        <div className="lg:col-span-5">
          <p className="eyebrow eyebrow-fio">Onde comprar</p>
          <h1 className="t-hero mt-4 max-w-[14ch] lg:mt-5">Encontre a Corpo Sensual perto de você</h1>
          <p className="lead mt-4 max-w-xl lg:mt-6">
            As nossas peças são vendidas em lojas de moda íntima e pijamas de todo o Brasil. Deixe o seu contato e a sua
            cidade que indicamos a loja mais perto de você.
          </p>
          <p className="mt-6 text-[15px] leading-[1.6] text-body">
            Tem loja e quer revender?{" "}
            <Link href="/fabrica-de-pijamas" className="text-ink underline underline-offset-4 hover:decoration-2">
              Veja como comprar da fábrica
            </Link>
            .
          </p>
        </div>

        <BlocoCadastro
          id="cadastro-varejo"
          source="varejo"
          submitLabel="Quero saber onde comprar"
          className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7"
        />
      </div>
    </section>
  );
}
