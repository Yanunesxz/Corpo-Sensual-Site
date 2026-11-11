/**
 * Máscaras dos campos de contato do cadastro (components/lead-form.tsx).
 * O servidor guarda só os dígitos; a máscara existe para a pessoa conferir o que digitou.
 */
import { somenteDigitos } from "./documento";

/**
 * "(32) 99999-8888" enquanto a pessoa digita. Quem cola o número com o código do país
 * (+55) fica com DDD e número. O parêntese só fecha quando chega o terceiro dígito,
 * senão o Backspace travava em "(32) ".
 */
export function formatarWhatsApp(valor: string): string {
  let d = somenteDigitos(valor);
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const numero = d.slice(2);
  if (numero.length <= 4) return `(${ddd}) ${numero}`;
  const corte = numero.length - 4;
  return `(${ddd}) ${numero.slice(0, corte)}-${numero.slice(corte)}`;
}

/**
 * Aplica a máscara num campo controlado sem jogar o cursor para o fim quando a pessoa
 * corrige um dígito no meio: o cursor volta para depois do mesmo número de dígitos.
 */
export function aplicarMascara(el: HTMLInputElement, formatar: (v: string) => string, guardar: (v: string) => void) {
  const bruto = el.value;
  const cursor = el.selectionStart ?? bruto.length;
  const novo = formatar(bruto);
  guardar(novo);
  if (cursor >= bruto.length) return;
  const digitosAntes = somenteDigitos(bruto.slice(0, cursor)).length;
  requestAnimationFrame(() => {
    let i = 0;
    for (let n = 0; i < novo.length && n < digitosAntes; i++) if (/\d/.test(novo[i])) n++;
    try {
      el.setSelectionRange(i, i);
    } catch {
      // Campo sem seleção de texto: fica como está.
    }
  });
}

/** O mesmo rigor do servidor (z.email) não cabe aqui: basta "algo@algo.xx" para avisar cedo. */
export const EMAIL_SIMPLES = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
