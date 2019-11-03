import {object, select, text, withKnobs} from "@storybook/addon-knobs";
import {addDecorator, storiesOf} from "@storybook/html";

export default { title: "Commissions" }

addDecorator(withKnobs)

import CommissionCardDoc from "../doc/components/commission-card.md"
import CompactCommissionDoc from "../doc/components/compact-commission.md"

import "../src/index/static/components/card"
import "../src/index/static/components/icon"
import "../src/index/static/components/autoresize"
import "../src/commissions/static/components/commission-card"
import "../src/commissions/static/components/compact-commission"
import "../src/commissions/static/components/tag"
import '../src/index/static/css/vars.css';

const stories = storiesOf("Commission", module);

stories.add("Carte", () => {

    let name = text("Nom", 'Commission A')
    let banner = text("URL de bannière", 'https://bdecesilyon.fr/static/img/cesi.png')
    let logo = text("URL du logo", "https://bdecesilyon.fr/static/img/logo.png")
    let url = text("Lien", "https://bdecesilyon.fr")
    let meta = text("Métadonnées", "Création : 31 Décembre 2004 | Commission Approuvée")
    let description = text("Description", "Une bien belle commission")
    let organization = select("Organisation", {
        BDE: "bde",
        BDS: "bds"
    })
    let tags = object("Tags",[
        {color:"#bd574e", name:"Tag A"},
        {color:"#fa877f", name:"Tag B"},
        {color:"#ffad87", name:"Tag C"}
    ])

    let tagsHTML = tags.reduce((html, tag) => html+`<bde-tag slot="tags" color="${tag.color}">${tag.name}</bde-tag>`, "")

    return `
        <bde-commission-card
            banner-src="${banner}"
            logo-src="${logo}"
            commission-name="${name}"
            href="${url}"
            organization="${organization}"
        >
            <span slot="meta">
                ${meta}
            </span>
            
            ${tagsHTML}
            
            ${description}
            
        </bde-commission-card>
    `
}, { notes: {markdown: CommissionCardDoc} })

stories.add("Compact", () => {

    let name = text("Nom", 'Commission A')
    let logo = text("URL du logo", "https://bdecesilyon.fr/static/img/logo.png")
    let organization = select("Organisation", {
        BDE: "bde",
        BDS: "bds"
    })

    return `
        <bde-compact-commission
            logo-src="${logo}"
            organization="${organization}" >
                ${name}
        </bde-compact-commission>
    `
}, { notes: {markdown: CompactCommissionDoc} })