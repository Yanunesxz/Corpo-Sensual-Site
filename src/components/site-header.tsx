"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // A home tem hero escuro em tela cheia: o cabeçalho começa transparente e
  // ganha fundo ao rolar. Nas demais páginas ele já nasce com fundo.
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const tone = overHero ? "text-white" : "text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        overHero
          ? "bg-transparent"
          : "bg-cream/95 shadow-[0_1px_0_0_var(--color-line)]"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className={`display text-2xl md:text-[1.7rem] ${tone}`} aria-label="Corpo Sensual, página inicial">
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {site.nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition-opacity hover:opacity-70 ${tone} ${
                  active ? "underline decoration-gold underline-offset-8" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/catalogo" className={`btn ${overHero ? "btn-light" : "btn-primary"} !py-3 !px-5 text-sm`}>
            Receber catálogo
          </Link>
        </nav>

        <button
          type="button"
          className={`md:hidden ${tone}`}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-line bg-cream px-5 pb-8 pt-4 md:hidden"
      >
        {/* Fecha o menu ao escolher um link. */}
        <nav className="flex flex-col gap-1" aria-label="Menu" onClick={() => setOpen(false)}>
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-2 py-3 text-lg text-ink hover:bg-cream-dark">
              {item.label}
            </Link>
          ))}
          <Link href="/programa-cashback" className="rounded-lg px-2 py-3 text-lg text-ink hover:bg-cream-dark">
            Programa Cashback
          </Link>
          <Link href="/catalogo" className="btn btn-primary mt-4">
            Receber catálogo
          </Link>
        </nav>
      </div>
    </header>
  );
}
