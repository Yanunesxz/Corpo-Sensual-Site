import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // O Next 16 só entrega as qualidades listadas aqui; sem isso tudo sai em 75,
    // o que deixa a foto de campanha visivelmente mole em tela grande.
    qualities: [75, 85, 92],
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
  async redirects() {
    // URLs antigas do site no Wix -> URLs novas
    return [
      { source: "/catalogo-verao", destination: "/catalogo", permanent: true },
      // A coleção de verão passou a se chamar Delícias de Verão (catálogo Verão 2026/2027).
      { source: "/colecoes/frescor", destination: "/colecoes/delicias-de-verao", permanent: true },
      { source: "/colecao-verao", destination: "/colecoes/delicias-de-verao", permanent: true },
      { source: "/colecao-inverno", destination: "/colecoes/entrelacos", permanent: true },
      { source: "/lp-fabrica-pijamas", destination: "/fabrica-de-pijamas", permanent: true },
      { source: "/colecao-verao-obrigado", destination: "/obrigado?origem=catalogo", permanent: true },
      { source: "/colecao-inverno-obrigado", destination: "/obrigado?origem=catalogo", permanent: true },
      { source: "/obrigado-fabrica-pijamas", destination: "/obrigado?origem=fabrica-de-pijamas", permanent: true },
      { source: "/privacy-policy", destination: "/politicas/privacidade", permanent: true },
      { source: "/cookie-policy", destination: "/politicas/cookies", permanent: true },
      { source: "/refund-policy", destination: "/politicas/trocas-e-devolucoes", permanent: true },
      { source: "/shipping-policy", destination: "/politicas/envio", permanent: true },
      { source: "/terms-conditions", destination: "/politicas/termos", permanent: true },
    ];
  },
};

export default nextConfig;
