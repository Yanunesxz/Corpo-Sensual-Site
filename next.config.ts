import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // "production", "preview" ou "local". O Google Analytics só mede a produção:
    // as prévias de cada branch não entram nos números.
    AMBIENTE_VERCEL: process.env.VERCEL_ENV ?? "local",
  },
  images: {
    // O Next 16 só entrega as qualidades listadas aqui; sem isso tudo sai em 75,
    // o que deixa a foto de campanha visivelmente mole em tela grande.
    qualities: [75, 80, 85, 92],
    // Os tamanhos padrão do Next pulam de 1920 para 3840: um notebook de 1440
    // em 2x precisa de 2880 e acabava baixando 3840 (mais de 1 MB). Com 2560 e
    // 2880 na lista ele pede o tamanho certo, sem perder nitidez.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 2880, 3840],
    remotePatterns: [
      // Supabase Storage (bucket público "produtos")
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Imagens ainda hospedadas no Wix, durante a transição
      { protocol: "https", hostname: "static.wixstatic.com" },
    ],
  },
  async headers() {
    return [
      {
        // Tudo o que não for o domínio oficial (sitecs.vercel.app, prévias, localhost)
        // sai com noindex, para o Google não indexar uma cópia do site da marca.
        // Quando www.corposensual.com.br apontar para cá, ele fica indexável sozinho.
        // NÃO ponha Disallow no robots.txt: o Google precisa abrir a página para ler o noindex.
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?corposensual\\.com\\.br" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    // URLs antigas do site no Wix -> URLs novas
    return [
      // Domínio e loja antigos da marca. A lista "10 melhores fábricas de pijamas de
      // Muriaé" ainda aponta para loja.pijamascorposensual.com.br. Só funciona depois
      // que esse domínio for adicionado ao projeto na Vercel.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.|loja\\.)?pijamascorposensual\\.com\\.br" }],
        destination: "https://www.corposensual.com.br/",
        permanent: true,
      },
      { source: "/catalogo-verao", destination: "/catalogo", permanent: true },
      // A coleção de verão passou a se chamar Delícias de Verão (catálogo Verão 2026/2027).
      { source: "/colecoes/frescor", destination: "/colecoes/delicias-de-verao", permanent: true },
      { source: "/colecao-verao", destination: "/colecoes/delicias-de-verao", permanent: true },
      { source: "/colecao-inverno", destination: "/colecoes/entrelacos", permanent: true },
      { source: "/lp-fabrica-pijamas", destination: "/fabrica-de-pijamas", permanent: true },
      // O Programa Cashback saiu do site em 29/09/2026. Quem tiver o link cai na página de lojistas.
      { source: "/programa-cashback", destination: "/fabrica-de-pijamas", permanent: true },
      { source: "/colecao-verao-obrigado", destination: "/obrigado?origem=catalogo", permanent: true },
      { source: "/colecao-inverno-obrigado", destination: "/obrigado?origem=catalogo", permanent: true },
      { source: "/obrigado-fabrica-pijamas", destination: "/obrigado?origem=fabrica-de-pijamas", permanent: true },
      { source: "/privacy-policy", destination: "/politicas/privacidade", permanent: true },
      { source: "/cookie-policy", destination: "/politicas/cookies", permanent: true },
      { source: "/refund-policy", destination: "/politicas/trocas-e-devolucoes", permanent: true },
      { source: "/shipping-policy", destination: "/politicas/envio", permanent: true },
      { source: "/terms-conditions", destination: "/politicas/termos", permanent: true },
      // Endereços que o Wix usa hoje (conferidos em 29/09/2026). /fabrica-pijamas é a
      // landing de lojista e a página dos anúncios: o 308 repassa ?gclid= e ?utm_*.
      { source: "/fabrica-pijamas", destination: "/fabrica-de-pijamas", permanent: true },
      { source: "/fabrica-pijamas-obrigado", destination: "/obrigado?origem=fabrica-de-pijamas", permanent: true },
      { source: "/cashback", destination: "/fabrica-de-pijamas", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      // As 5 páginas da Plumene (/colecao-verao-plumene, /colecao-inverno-plumene,
      // /surpreenda-plumene e as duas de obrigado) ainda não têm destino: é decisão
      // do dono, antes de apontar o domínio para cá.
    ];
  },
};

export default nextConfig;
