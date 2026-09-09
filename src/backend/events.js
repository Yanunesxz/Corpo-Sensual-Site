// events.js — eventos do site que rodam no servidor do Wix.
//
// Formulário enviado (Wix Forms) → lead direto no CRM (CSP 360).
//
// Toda landing page com formulário (LP Fábrica Pijamas, Coleção Verão,
// Coleção Inverno, Catálogo Verão, Coleção Verão Plumene, Coleção Inverno
// Plumene, Surpreenda Plumene) dispara o evento de envio. Aqui a submissão
// vira o corpo abaixo e vai para a Edge Function `lead-site` do CRM, que cria
// o cliente prospecto + o negócio no funil "Venda Direta — Leads" (ou só o
// negócio, se já for cliente). Repetir o envio não duplica nada lá.
//
//   { marca: "cs" | "plumene", pagina, url, nome, email, whatsapp, possui_cnpj,
//     cnpj, nome_loja, utm: { source, medium, campaign, term }, enviado_em }
//
// A CHAVE fica no Secrets Manager do Wix (Painel → Developer Tools → Secrets
// Manager), com o nome LEAD_SITE_CHAVE_CS — o mesmo valor do secret
// LEAD_SITE_CHAVE_CS da função no Supabase. NUNCA no código.
//
// De onde vem a marca e a página: os campos ocultos que o código da página
// preenche (#inputMarca, #inputPagina, #inputUrlPage, #inputUtm*). Sem eles,
// cai na tabela FORMULARIOS (id do formulário → marca/página) e, por último,
// na URL da página ("plumene" no endereço → PLUMENE).

import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

const URL_FUNCAO = 'https://brwyvxrueogayjsqfkbo.supabase.co/functions/v1/lead-site';
const NOME_SECRET = 'LEAD_SITE_CHAVE_CS';

// Formulários que NÃO têm os campos ocultos de marca/página (id do formulário
// aparece no log do site: "lead-site: formulário <id> · campos …").
// Ex.: 'a1b2c3d4-…': { marca: 'plumene', pagina: 'Surpreenda Plumene' }
const FORMULARIOS = {};

// ---------------------------------------------------------------------------
// Eventos do Wix
// ---------------------------------------------------------------------------

/**
 * Wix Forms (app atual, formulários multi-etapa das LPs) — wix-forms.v2.
 * `event.entity.submissions` é um objeto { chaveDoCampo: valor }.
 */
export async function wixForms_onFormSubmissionCreated(event) {
	const entidade = (event && event.entity) || {};
	await enviarLead({
		formId: entidade.formId || '',
		campos: entidade.submissions || {},
		enviadoEm: entidade._createdDate,
	});
}

/**
 * Wix Forms legado (wix-crm-backend) — mantido por segurança: se o site ainda
 * tiver algum formulário antigo, ele também chega ao CRM. `submissionData` é
 * uma lista de { fieldName, fieldValue }.
 */
export async function wixCrm_onFormSubmit(event) {
	const campos = {};
	for (const c of (event && event.submissionData) || []) campos[c.fieldName] = c.fieldValue;
	await enviarLead({
		formId: (event && event.formName) || '',
		campos,
		enviadoEm: event && event.submissionTime,
	});
}

// ---------------------------------------------------------------------------
// Montagem do lead e chamada da função
// ---------------------------------------------------------------------------

async function enviarLead({ formId, campos, enviadoEm }) {
	const chaves = Object.keys(campos || {});
	console.log(`lead-site: formulário ${formId || '(sem id)'} · campos ${chaves.join(', ')}`);

	const lead = montarLead(formId, campos, enviadoEm);
	if (!lead.nome && !lead.nome_loja) {
		console.warn('lead-site: submissão sem nome — não enviada ao CRM');
		return;
	}
	if (!lead.email && !lead.whatsapp && !lead.cnpj) {
		console.warn('lead-site: submissão sem e-mail/WhatsApp/CNPJ — não enviada ao CRM');
		return;
	}

	let chave;
	try {
		chave = await getSecret(NOME_SECRET);
	} catch (e) {
		console.error(`lead-site: secret ${NOME_SECRET} não encontrada no Secrets Manager — lead não enviado`, e);
		return;
	}

	try {
		const r = await fetch(URL_FUNCAO, {
			method: 'post',
			headers: { 'Content-Type': 'application/json', 'x-chave': chave },
			body: JSON.stringify(lead),
		});
		const texto = await r.text();
		if (!r.ok) {
			console.error(`lead-site: CRM respondeu ${r.status}: ${texto.slice(0, 300)}`);
			return;
		}
		let res = {};
		try {
			res = JSON.parse(texto);
		} catch (e) {
			/* resposta não-JSON */
		}
		const cli = res.cliente || {};
		const neg = res.negocio || {};
		console.log(
			`lead-site: OK · ${lead.marca} · ${lead.pagina} · cliente ${cli.novo ? 'novo' : 'existente'} ${cli.codigo || ''} · negócio ${neg.novo ? 'novo' : 'já aberto'} ${neg.codigo || ''}`,
		);
	} catch (e) {
		console.error('lead-site: falha ao chamar o CRM', e);
	}
}

function montarLead(formId, campos, enviadoEm) {
	const v = extrairCampos(campos);
	const config = FORMULARIOS[formId] || {};
	const url = v.url || '';

	let marca = normalizarMarca(v.marca) || normalizarMarca(config.marca);
	if (!marca) marca = /plumene/i.test(url) ? 'plumene' : 'cs';

	const pagina = v.pagina || config.pagina || paginaPelaUrl(url) || (formId ? `Formulário ${formId}` : 'site');

	return {
		marca,
		pagina,
		url,
		nome: v.nome,
		nome_loja: v.nome_loja,
		email: v.email,
		whatsapp: v.whatsapp,
		cnpj: v.cnpj,
		possui_cnpj: v.possui_cnpj,
		utm: { source: v.utm_source, medium: v.utm_medium, campaign: v.utm_campaign, term: v.utm_term },
		enviado_em: enviadoEm ? new Date(enviadoEm).toISOString() : new Date().toISOString(),
	};
}

// ---------------------------------------------------------------------------
// Leitura dos campos da submissão
// ---------------------------------------------------------------------------

// As chaves dos campos no Wix Forms são as "chaves de campo" definidas no
// editor (ex.: first_name, email_1a2b, phone_9f8e, inputWhatsapp…). Casamos
// por padrão no nome normalizado, em ordem de prioridade.
const REGRAS = [
	['marca', /^(input)?marca$/],
	['pagina', /^(input)?(pagina|nome_?da_?pagina|page_?name)$/],
	['url', /(url|page_?url|url_?page|urlpage)/],
	['utm_source', /utm_?source/],
	['utm_medium', /utm_?medium/],
	['utm_campaign', /utm_?campaign/],
	['utm_term', /utm_?term/],
	['nome_loja', /(loja|empresa|fantasia|company|razao)/],
	['email', /e_?mail/],
	['whatsapp', /(whats|phone|telefone|celular|fone)/],
	['cnpj', /cnpj/],
	['nome', /(first_?name|full_?name|^name$|nome|seu_?nome|^input_?name$)/],
];

function extrairCampos(campos) {
	const v = {};
	const usados = new Set();
	for (const [alvo, regex] of REGRAS) {
		for (const chave of Object.keys(campos || {})) {
			if (usados.has(chave)) continue;
			const norm = normalizarChave(chave);
			if (!regex.test(norm)) continue;
			const valor = texto(campos[chave]);
			if (!valor) continue;
			if (alvo === 'cnpj') {
				// "cnpj" pode ser o número OU a pergunta "Possui CNPJ?" (Sim/Não).
				const digitos = valor.replace(/\D/g, '');
				if (digitos.length >= 11) {
					if (!v.cnpj) v.cnpj = valor;
				} else if (!v.possui_cnpj) {
					v.possui_cnpj = valor;
				}
				usados.add(chave);
				continue;
			}
			if (!v[alvo]) {
				v[alvo] = valor;
				usados.add(chave);
			}
		}
	}
	// Campo "Possui CNPJ?" com nome sem "cnpj" (ex.: "tem_empresa") — última tentativa.
	if (!v.possui_cnpj) {
		for (const chave of Object.keys(campos || {})) {
			if (usados.has(chave)) continue;
			if (/possui|tem_/.test(normalizarChave(chave))) {
				v.possui_cnpj = texto(campos[chave]);
				break;
			}
		}
	}
	return v;
}

function normalizarChave(chave) {
	return String(chave || '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

// Valor do campo → texto: strings, números, listas (checkbox) e objetos do
// Wix (endereço {formatted}, telefone {phone|number}) viram uma string.
function texto(valor) {
	if (valor == null) return '';
	if (Array.isArray(valor)) return valor.map(texto).filter(Boolean).join(', ');
	if (typeof valor === 'object') {
		if (valor.formatted) return String(valor.formatted).trim();
		if (valor.phone) return String(valor.phone).trim();
		if (valor.number) return String(valor.number).trim();
		if (valor.value) return texto(valor.value);
		return '';
	}
	const s = String(valor).trim();
	return s === 'undefined' || s === 'null' ? '' : s;
}

function normalizarMarca(m) {
	const s = String(m || '').toLowerCase();
	if (!s) return '';
	if (/plumene|^pl$/.test(s)) return 'plumene';
	if (/corpo|sensual|^cs$/.test(s)) return 'cs';
	return '';
}

// Nome da página a partir do endereço (quando o campo oculto não existe).
function paginaPelaUrl(url) {
	const caminho = String(url || '')
		.toLowerCase()
		.replace(/^https?:\/\/[^/]+/, '')
		.split('?')[0];
	if (!caminho) return '';
	const plumene = /plumene/.test(caminho);
	if (/fabrica/.test(caminho)) return 'LP Fábrica Pijamas';
	if (/surpreenda/.test(caminho)) return 'Surpreenda Plumene';
	if (/catalogo/.test(caminho)) return 'Catálogo Verão';
	if (/verao/.test(caminho)) return plumene ? 'Coleção Verão Plumene' : 'Coleção Verão';
	if (/inverno/.test(caminho)) return plumene ? 'Coleção Inverno Plumene' : 'Coleção Inverno';
	return caminho.replace(/^\/|\/$/g, '') || 'Home';
}
