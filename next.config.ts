import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
