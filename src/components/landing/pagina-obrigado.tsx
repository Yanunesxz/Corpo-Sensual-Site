import type { CSSProperties } from "react";
import Image from "next/image";
import { OBRIGADO, type ColecaoLanding } from "@/lib/content/landing-colecoes";
import { LogoCs } from "./logo-cs";
import { RodapeLanding } from "./rodape";
import s from "./landing.module.css";

/** Página de obrigado das landing pages, cópia do Wix: chamada e o botão do catálogo. */
export function PaginaObrigadoLanding({ colecao }: { colecao: ColecaoLanding }) {
  const d = OBRIGADO[colecao];
  return (
    <div className={s.lp} style={{ "--clara": d.corFundo } as CSSProperties}>
      <section className={`${s.obrigado} ${colecao === "verao" ? s.obrigadoVerao : s.obrigadoInverno}`}>
        <div className={s.w}>
          <LogoCs className={s.logo} />
          <h1 className={`${s.titulo} ${s.obrigadoTitulo}`}>{d.chamada}</h1>
          <a href={d.catalogo} target="_blank" rel="noreferrer" className={`${s.botaoCatalogo} ${s.mont}`} data-ga-local="obrigado">
            Baixar Catálogo
          </a>
          <div className={s.obrigadoFoto}>
            <Image src={d.foto} alt={d.alt} fill priority quality={85} sizes="(min-width: 1024px) 506px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
      <RodapeLanding rodape={d.rodape} variante={colecao} obrigado />
    </div>
  );
}
