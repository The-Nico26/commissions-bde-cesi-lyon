import {object, select, text, withKnobs} from "@storybook/addon-knobs";
import {addDecorator, storiesOf} from "@storybook/html";

addDecorator(withKnobs)
const stories = storiesOf("Éléments d'interface", module);

import "../src/index/static/components/pulse"
import PulseDoc from "../doc/components/pulse.md"

stories.add("Pulse", () => {
    return `
<bde-pulse id="pulse">
    <button id="btn" onclick="document.getElementById('pulse').pulse()">Pulser maintenant</button>
</bde-pulse>
    `
},{notes:{markdown:PulseDoc}})

import "../src/index/static/components/autoresize"
import AutoresizeDoc from "../doc/components/autoresize.md"

stories.add("Texte Adaptatif", () => {
    return `
<style>
    body {
        font-size: 100px;
    }

    bde-autoresize {
        height: 100px;
    }
</style>
<bde-autoresize>Lorem ipsum dolor si amet</bde-autoresize>
`
},{notes:{markdown:AutoresizeDoc}})