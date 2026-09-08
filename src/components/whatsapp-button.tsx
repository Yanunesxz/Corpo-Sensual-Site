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
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <WhatsApp width={28} height={28} />
    </a>
  );
}
