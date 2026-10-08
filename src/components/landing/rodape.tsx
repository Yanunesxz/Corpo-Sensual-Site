import type { DadosLanding } from "@/lib/content/landing-colecoes";
import s from "./landing.module.css";

type Props = {
  rodape: DadosLanding["rodape"];
  variante: "verao" | "inverno";
  /** Na página de obrigado o rodapé do celular tem letra maior, tudo à esquerda. */
  obrigado?: boolean;
};

/** Rodapé das landing pages, como no Wix: razão social, endereço e o crédito da agência. */
export function RodapeLanding({ rodape, variante, obrigado = false }: Props) {
  const classe = obrigado ? s.rodapeObrigado : variante === "verao" ? s.rodapeVerao : s.rodapeInverno;
  const d = rodape.direita;
  return (
    <footer className={`${s.rodape} ${classe} ${s.helv}`}>
      <div className={s.w}>
        <p className={s.rodapeLinhas}>
          {rodape.linhas.join("\n")}
          {rodape.direitosEmbaixo && (
            <>
              {"\n\n"}
              <a href={rodape.direitosEmbaixo.href} target="_blank" rel="noreferrer" className={s.sublinhado}>
                {rodape.direitosEmbaixo.texto}
              </a>
            </>
          )}
        </p>
        <p className={s.rodapeDireita}>
          {d.antes}
          <a href={d.href} target="_blank" rel="noreferrer" className={d.sublinhado ? s.sublinhado : undefined}>
            {d.texto}
          </a>
        </p>
      </div>
    </footer>
  );
}
