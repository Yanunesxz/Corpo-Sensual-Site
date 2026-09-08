// Guia de API: https://www.wix.com/velo/reference/api-overview/introduction

import wixLocationFrontend from 'wix-location-frontend';

$w.onReady(function () {

	$w.onReady(function () {
        const { utm_source, utm_medium, utm_campaign, utm_term } = wixLocationFrontend.query;

        $w("#inputUtmSource").value = `${utm_source}`;
        $w("#inputUtmSource").hide()

        $w("#inputUtmMedium").value = `${utm_medium}`;
        $w("#inputUtmMedium").hide()

        $w("#inputUtmCampaign").value = `${utm_campaign}`;
        $w("#inputUtmCampaign").hide()

        $w("#inputUtmTerm").value = `${utm_term}`;
        $w("#inputUtmTerm").hide()
    });

	

});