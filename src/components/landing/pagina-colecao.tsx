import type { CSSProperties } from "react";
import Image from "next/image";
import { LANDING, type ColecaoLanding } from "@/lib/content/landing-colecoes";
import { FaixaLanding } from "./faixa";
import { FormularioLanding } from "./formulario";
import { GaleriaLanding } from "./galeria";
import { Asterisco, IconeFrete, IconeInvestimento, IconeParcelamento } from "./icones";
import { LogoCs } from "./logo-cs";
import { RodapeLanding } from "./rodape";
import s from "./landing.module.css";

/**
 * Landing page de coleção, cópia da página do Wix: capa, faixa de foto, apresentação,
 * galeria, formulário, "Corpo Sensual" e rodapé. No celular a apresentação vem antes da
 * faixa de foto (como no Wix); no desktop, depois.
 */
export function PaginaColecaoLanding({ colecao }: { colecao: ColecaoLanding }) {
  const d = LANDING[colecao];
  const estilo = {
    ...d.medidas,
    "--clara": d.corClara,
    "--texto-bg": d.corTexto,
    "--m-sobre-w": colecao === "verao" ? "272" : "280",
  } as CSSProperties;

  const nota = d.capa.notaSublinhado
    ? d.capa.nota.split(d.capa.notaSublinhado).flatMap((parte, i) => (i === 0 ? [parte] : [<u key={i}>{d.capa.notaSublinhado}</u>, parte]))
    : d.capa.nota;

  return (
    <div className={s.lp} style={estilo}>
      {/* 1. Capa */}
      <section className={s.capa}>
        <div className={s.w}>
          <LogoCs className={s.logo} />
          <h1 className={`${s.titulo} ${s.capaTitulo}`}>{d.capa.titulo}</h1>
          <p className={`${s.helv} ${s.capaTexto}`}>{d.capa.texto}</p>
          <a href="#formulario" className={`${s.botao} ${s.mont}`}>
            Baixar Catálogo
          </a>
          <div className={s.nota}>
            <Asterisco className={s.asterisco} />
            <p className={`${s.mont} ${s.notaTexto}`}>{nota}</p>
          </div>
          <div className={s.capaFoto}>
            <Image src={d.capa.foto} alt={d.capa.alt} fill priority quality={85} sizes="(min-width: 1024px) 506px, 90vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* 2. Faixa de foto com parallax (no celular, depois da apresentação) */}
      <FaixaLanding {...d.faixa} />

      {/* 3. Apresentação da coleção */}
      <section className={s.apresentacao}>
        <h2 className={s.titulo}>{d.apresentacao.titulo}</h2>
        <p className={s.helv}>{d.apresentacao.texto}</p>
      </section>

      {/* 4. Galeria */}
      <section className={s.galeria}>
        <div className={s.w}>
          <h2 className={`${s.titulo} ${s.galeriaTitulo} ${d.galeria.espacado ? s.espacado : ""}`}>{d.galeria.titulo}</h2>
          <p className={`${s.helv} ${s.galeriaTexto}`}>{d.galeria.texto}</p>
          <GaleriaLanding fotos={d.galeria.fotos} />
        </div>
      </section>

      {/* 5. Formulário (destino do "Baixar Catálogo") */}
      <section id="formulario" className={s.form}>
        <div className={s.w}>
          <h2 className={`${s.titulo} ${s.formTitulo}`}>{d.formulario.titulo}</h2>
          <ul className={`${s.lista} ${s.mont}`}>
            <li>
              <IconeInvestimento className={s.icone} />
              <p>{d.formulario.investimento}</p>
            </li>
            <li>
              <IconeParcelamento className={s.icone} />
              <p>Parcelamento até 6x s/ Juros no cartão</p>
            </li>
            <li>
              <IconeFrete className={s.icone} />
              <p>Frete Grátis a partir R$ 1.200,00</p>
            </li>
          </ul>
          <p className={`${s.helv} ${s.condicoes}`}>*Consulte as condições de frete grátis para sua região.</p>
          <FormularioLanding colecao={colecao} />
        </div>
      </section>

      {/* 6. Corpo Sensual */}
      <section className={s.sobre}>
        <h2 className={s.titulo}>Corpo Sensual</h2>
        <p className={s.helv}>{d.sobre}</p>
      </section>

      <RodapeLanding rodape={d.rodape} variante={colecao} />
    </div>
  );
}
