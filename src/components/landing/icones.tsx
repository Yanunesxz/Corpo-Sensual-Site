/** Vetores das landing pages, copiados do Wix (cores originais). */

export function Asterisco({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="20 20 160 160" className={className} fill="currentColor" aria-hidden="true">
      <path d="M180 93.219h-63.587l44.953-44.971-9.592-9.617-44.979 44.972V20h-13.59v63.603L48.226 38.63l-9.592 9.617 44.953 44.971H20v13.588h63.587l-44.953 44.945 9.592 9.617 44.979-44.972V180h13.59v-63.603l44.979 44.972 9.592-9.617-44.953-44.945H180V93.219Z" />
    </svg>
  );
}

/** Investimento mínimo: laço. */
export function IconeInvestimento({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="20 20 160 160" className={className} fill="#DDDDCC" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M20 20v160c44.183 0 80-35.817 80-80S64.183 20 20 20z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M100 100c0 44.183 35.817 80 80 80V20c-44.183 0-80 35.817-80 80z" />
    </svg>
  );
}

/** Parcelamento: círculo com um quarto recortado. */
export function IconeParcelamento({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="20 20 160 160" className={className} fill="#CBC8C0" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M100 20v80H20c0 44.183 35.817 80 80 80s80-35.817 80-80-35.817-80-80-80z" />
    </svg>
  );
}

/** Frete: dois semicírculos empilhados. */
export function IconeFrete({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="22.5 20 155 160" className={className} fill="#CBC8C0" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M100 20c-42.802 0-77.5 34.7-77.5 77.505h155C177.5 54.7 142.802 20 100 20z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M100 102.496c-42.802 0-77.5 34.7-77.5 77.504h155c0-42.804-34.698-77.504-77.5-77.504z" />
    </svg>
  );
}

/** Seta da galeria (aponta para a direita). */
export function SetaGaleria() {
  return (
    <svg viewBox="0 0 23 39" fill="currentColor" aria-hidden="true">
      <path d="M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z" transform="translate(-855 -230)" />
    </svg>
  );
}
