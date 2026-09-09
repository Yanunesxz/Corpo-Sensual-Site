// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction
//
// Landing page com formulário → o lead vai direto para o CRM (CSP 360).
// Este código só preenche os campos ocultos do formulário (UTMs, URL, marca e
// página); quem envia ao CRM é src/backend/events.js, no evento de formulário
// enviado. A marca desta página é "plumene" (as LPs Plumene mandam "plumene").

import wixLocationFrontend from 'wix-location-frontend';

const MARCA = 'plumene';
const PAGINA = 'Surpreenda Plumene';

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

/**
*	Adds an event handler that runs when the pointer is moved
 onto the element.

 You can also [define an event handler using the Properties and Events panel](https://support.wix.com/en/article/velo-reacting-to-user-actions-using-events).
	[Read more](https://www.wix.com/corvid/reference/$w.Element.html#onMouseIn)
*	 @param {$w.MouseEvent} event
*/
export function input8_mouseIn(event) {
    // This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
    // Add your code for this event here: 
    //
}
