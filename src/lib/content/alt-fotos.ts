/**
 * Texto alternativo das fotos de campanha e de categoria, pelo caminho do arquivo.
 * Descreve o que se vê (pessoas, peça, cor, cenário) para o Google Imagens e para quem
 * usa leitor de tela. Foto nova: acrescente aqui; sem entrada, vale o texto de reserva.
 */
const ALT_FOTO: Record<string, string> = {
  "/images/colecoes/delicias-1.jpg": "Mãe e dois filhos com pijama curto estampado azul no gramado, coleção Delícias de Verão",
  "/images/colecoes/delicias-2.jpg": "Modelo com regata estampada e short listrado azul-marinho à beira do lago, coleção Delícias de Verão",
  "/images/colecoes/delicias-3.jpg": "Mãe e filha de short doll azul-marinho à mesa, na beira da piscina, coleção Delícias de Verão",
  "/images/colecoes/delicias-4.jpg": "Casal com pijama curto de blusa listrada lendo na escada, coleção Delícias de Verão",
  "/images/colecoes/entrelacos-1.jpg": "Mãe e filha de costas, com pijama listrado com corações e laço no cabelo, coleção Entrelaços",
  "/images/colecoes/entrelacos-2.jpg": "Mãe e filha com pijama listrado com corações e calça marrom, coleção Entrelaços",
  "/images/colecoes/entrelacos-3.jpg": "Mãe e filha com pijama cinza de estrelas e calça rosa, coleção Entrelaços",
  "/images/colecoes/entrelacos-4.jpg": "Modelo com pijama longo de blusa listrada e calça azul, coleção Entrelaços",
  "/images/categorias/feminino.jpg": "Regata estampada e short listrado da linha feminina",
  "/images/categorias/masculino.jpg": "Pijama masculino de camiseta e short marrom",
  "/images/categorias/infantil.jpg": "Crianças com pijama curto azul brincando com bolhas de sabão",
};

/** Foto do topo de cada coleção. Vale para a versão larga e para a do celular. */
const ALT_CAPA: Record<string, string> = {
  "delicias-de-verao": "Modelo de short doll rosa à beira da piscina, coleção Delícias de Verão",
  entrelacos: "Mãe e filha com pijama listrado com corações e calça marrom, coleção Entrelaços",
};

export const altFoto = (url: string, reserva: string) => ALT_FOTO[url] ?? reserva;
export const altCapa = (slug: string, reserva: string) => ALT_CAPA[slug] ?? reserva;
