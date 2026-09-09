// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
//
// Landing page com formulário → o lead vai direto para o CRM (CSP 360).
// Este código só preenche os campos ocultos do formulário (UTMs, URL, marca e
// página); quem envia ao CRM é src/backend/events.js, no evento de formulário
// enviado. A marca desta página é "cs" (as LPs Plumene mandam "plumene").

import wixLocationFrontend from 'wix-location-frontend';

const MARCA = 'cs';
const PAGINA = 'Coleção Verão';

$w.onReady(function () {
    const { utm_source, utm_medium, utm_campaign, utm_term } = wixLocationFrontend.query;

    // `?? ""`: sem UTM na URL o valor era a palavra "undefined" (template literal).
    preencherOculto("#inputUtmSource", utm_source ?? "");
    preencherOculto("#inputUtmMedium", utm_medium ?? "");
    preencherOculto("#inputUtmCampaign", utm_campaign ?? "");
    preencherOculto("#inputUtmTerm", utm_term ?? "");
    preencherOculto("#inputUrlPage", wixLocationFrontend.url);

    // Campos opcionais (crie no editor como "inputMarca" e "inputPagina" para o
    // backend não depender da URL): marca e nome da página.
    preencherOculto("#inputMarca", MARCA);
    preencherOculto("#inputPagina", PAGINA);
});

// Preenche e esconde um campo oculto do formulário; se o elemento não existe
// nesta página, ignora em vez de quebrar o carregamento.
function preencherOculto(id, valor) {
    try {
        const el = $w(id);
        if (!el || typeof el.hide !== 'function') return;
        el.value = valor;
        el.hide();
    } catch (e) {
        // elemento ausente no editor
    }
}
