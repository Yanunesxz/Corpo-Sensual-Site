"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { Close, Menu } from "./icons";

const menuLink = "inline-flex min-h-11 items-center self-start text-ink underline decoration-1 underline-offset-[6px]";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Trava a rolagem da página enquanto o menu está aberto (html + body cobre o iOS).
  useEffect(() => {
    const value = open ? "hidden" : "";
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fecha com Esc e ao girar o aparelho para uma largura em que o menu some.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const c = site.contact;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8">
        {/* Assinatura do site atual: monograma + nome em caixa normal */}
        <Link
          href="/"
          className="inline-flex h-11 items-center gap-2.5 text-ink"
          aria-label="Corpo Sensual, página inicial"
          onClick={() => setOpen(false)}
        >
          {/* eager, e não priority, para não disputar o preload com a foto de campanha */}
          <Image src="/images/logo-cs.png" alt="" width={160} height={160} loading="eager" className="h-6 w-6 md:h-7 md:w-7" />
          <span className="whitespace-nowrap text-[1.125rem] font-light leading-none md:text-[1.25rem]">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Principal">
          {site.nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-11 items-center text-[15px] text-ink transition-opacity hover:opacity-60 ${active ? "underline underline-offset-[6px]" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3 md:gap-5">
          <Link href="/catalogo" className="link inline-flex h-11 items-center text-[13px] md:text-[15px]" onClick={() => setOpen(false)}>
            <span className="md:hidden">Catálogo</span>
            <span className="hidden md:inline">Receber catálogo</span>
          </Link>
          <button
            type="button"
            className="-mr-2.5 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Menu do celular: cobre a tela abaixo da barra e rola sozinho. */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto overscroll-contain border-t border-line bg-paper md:hidden"
      >
        <div className="flex min-h-full flex-col px-5 pb-8 pt-2">
          {/* Fecha o menu ao escolher um link. */}
          <nav className="flex flex-col" aria-label="Menu" onClick={() => setOpen(false)}>
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="h-display flex min-h-14 items-center border-b border-line text-2xl">
                {item.label}
              </Link>
            ))}
            <Link href="/programa-cashback" className="h-display flex min-h-14 items-center border-b border-line text-2xl">
              Programa Cashback
            </Link>
            <Link href="/catalogo" className="btn btn-dark mt-6 w-full">
              Receber catálogo
            </Link>
          </nav>

          <div className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-body">
            <p className="label text-ink">Contato</p>
            <p className="mt-3">
              {site.legal.endereco}
              <br />
              {site.legal.cidade}, {site.legal.uf}
            </p>
            <div className="mt-2 flex flex-col">
              {c.whatsappUrl && (
                <a className={menuLink} href={c.whatsappUrl} target="_blank" rel="noreferrer">
                  WhatsApp {c.whatsappLabel}
                </a>
              )}
              {c.phoneUrl && (
                <a className={menuLink} href={c.phoneUrl}>
                  Telefone {c.phoneLabel}
                </a>
              )}
              {c.email && (
                <a className={menuLink} href={`mailto:${c.email}`}>
                  {c.email}
                </a>
              )}
              {c.instagram && (
                <a className={menuLink} href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer">
                  @{c.instagram}
                </a>
              )}
              <Link className={menuLink} href="/contato" onClick={() => setOpen(false)}>
                Todos os contatos
              </Link>
            </div>
            {c.hours && <p className="mt-3">{c.hours}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}
