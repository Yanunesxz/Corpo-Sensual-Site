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
  "/images/home/hero-familia.jpg":
    "Mãe, filha e filho com pijamas curtos azuis e shorts listrados, brincando com bolhas de sabão no gramado, coleção Delícias de Verão",
  "/images/lojista/capa.jpg": "Modelo de short doll rosa numa espreguiçadeira listrada à beira da piscina, coleção Delícias de Verão",
  "/images/editorial/riacho.jpg": "Modelo de regata branca e short azul-marinho sentada num deque de bambu sobre o riacho, coleção Delícias de Verão",
  "/images/editorial/orquidea.jpg": "Orquídeas cor-de-rosa no jardim onde a campanha Delícias de Verão foi fotografada",
  "/images/home/hero-familia-celular.jpg":
    "Mãe, filha e filho com pijamas curtos azuis e shorts listrados, brincando com bolhas de sabão no gramado, coleção Delícias de Verão",
  "/images/home/fechamento.jpg": "Modelo de regata e short brancos molhando o pé na piscina, de braços abertos, coleção Delícias de Verão",
  "/images/sobre/predio-alto.jpg":
    "Prédio da fábrica Corpo Sensual visto de cima, de drone: fachada branca e cinza, placas solares na cobertura e o monograma CS na esquina",
  "/images/sobre/predio-frente.jpg": "Prédio da fábrica Corpo Sensual entre as casas do bairro Dornelas, em Muriaé, com os morros ao fundo",
};

/** Foto do topo de cada coleção. Vale para a versão larga e para a do celular. */
const ALT_CAPA: Record<string, string> = {
  "delicias-de-verao": "Modelo de short doll rosa à beira da piscina, coleção Delícias de Verão",
  // Vale para as duas fotos da capa (a larga e a do celular), que são diferentes.
  entrelacos: "Mãe e filha com pijamas de inverno da coleção Entrelaços",
};

export const altFoto = (url: string, reserva: string) => ALT_FOTO[url] ?? reserva;
export const altCapa = (slug: string, reserva: string) => ALT_CAPA[slug] ?? reserva;
