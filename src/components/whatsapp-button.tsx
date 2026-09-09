import { site, whatsappLink } from "@/lib/site";
import { WhatsApp } from "./icons";

/** Botão flutuante. Só aparece se NEXT_PUBLIC_WHATSAPP estiver configurado. */
export function WhatsAppButton() {
  if (!site.contact.whatsappUrl) return null;
  const href = whatsappLink("Olá! Vim pelo site da Corpo Sensual e quero saber mais sobre o catálogo.");
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="wa-fab fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105 md:bottom-5 md:right-5 md:h-14 md:w-14"
    >
      <WhatsApp width={26} height={26} />
    </a>
  );
}
