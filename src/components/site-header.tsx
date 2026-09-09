"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-8">
        <Link href="/" className="font-serif text-[1.35rem] leading-none tracking-tight" aria-label="Corpo Sensual, página inicial">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {site.nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] tracking-wide transition-opacity hover:opacity-60 ${active ? "underline underline-offset-[6px]" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-5">
          <Link href="/catalogo" className="link hidden text-[13px] md:inline">
            Receber catálogo
          </Link>
          <button
            type="button"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      <div id="menu-mobile" hidden={!open} className="border-t border-line bg-paper md:hidden">
        {/* Fecha o menu ao escolher um link. */}
        <nav className="flex flex-col px-5 py-4" aria-label="Menu" onClick={() => setOpen(false)}>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="h-display border-b border-line py-4 text-2xl">
              {item.label}
            </Link>
          ))}
          <Link href="/programa-cashback" className="h-display border-b border-line py-4 text-2xl">
            Programa Cashback
          </Link>
          <Link href="/catalogo" className="btn btn-dark mt-6">
            Receber catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
