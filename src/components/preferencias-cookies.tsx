"use client";

import { abrirPreferencias } from "@/lib/analytics";

/** Reabre o aviso de cookies. Pela LGPD, mudar de ideia tem de ser tão fácil quanto aceitar. */
export function PreferenciasCookies() {
  return (
    <button
      type="button"
      onClick={abrirPreferencias}
      className="inline-flex min-h-11 items-center self-start text-left underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-55 md:min-h-0"
    >
      Preferências de cookies
    </button>
  );
}
