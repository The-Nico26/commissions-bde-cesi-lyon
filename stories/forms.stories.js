import {addDecorator, storiesOf} from "@storybook/html";
import {number, withKnobs} from "@storybook/addon-knobs";

const stories = storiesOf("Formulaires", module);

stories.addDecorator(withKnobs)

import "../src/commissions/static/components/datetimepicker"
import DateTimePickerDoc from "../doc/components/datetimepicker.md"

stories.add("DateTimePicker", () => {
    return `
<style>
    bde-datetimepicker {
        max-width: 600px;
    }
</style>
<bde-datetimepicker>
    <input type="text" value="02/11/2019" />
    <input type="text" value="12:27:32" />
</bde-datetimepicker>
    `
},{notes:{markdown:DateTimePickerDoc}})

import "../src/commissions/static/components/image-selector"
import ImageSelectorDoc from "../doc/components/image-selector.md"

stories.add("Selecteur d'image", () => {
    return `
<style>
    bde-image-selector {
        max-width: 300px;
    }
</style>
<bde-image-selector>
    <input type="file" />
</bde-image-selector>
    `
},{notes:{markdown:ImageSelectorDoc}})

import "../src/commissions/static/components/markdown"
import MarkdownDoc from "../doc/components/markdown.md"

stories.add("Éditeur Markdown", () => {
    return `
<style>
    bde-markdown {
        max-width: 400px;
    }
</style>
<bde-markdown>
    <textarea>
# Titre

Un texte en **markdown**
    </textarea>
</bde-markdown>
    `
},{notes:{markdown:MarkdownDoc}})

import "../src/commissions/static/components/tag-selector"
import TagSelectorDoc from "../doc/components/tag-selector.md"

stories.add("Selecteur de Tag", () => {

    let max = number("Nombre maximum", 3)

    return `
<bde-tag-selector>
    <select data-max="${max}" multiple>
      <option value="Tag A" data-color="#04ade5">Tag A</option>
      <option value="Tag B" data-color="#e58704">Tag B</option>
      <option value="Tag C" data-color="#ad04e5">Tag C</option>
      <option value="Tag D" data-color="#00a53c">Tag D</option>
      <option value="Tag E" data-color="#0156b7">Tag E</option>
    </select>
</bde-tag-selector>
    `
},{notes:{markdown:TagSelectorDoc}})