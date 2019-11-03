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

import "../src/commissions/static/components/user-autocomplete"
import "../src/users/static/components/user"
import UserAutocomplete from "../doc/components/user-autocomplete.md"

stories.add("Autompletion utilisateur", () => {
    return `
<style>
bde-user-autocomplete {
    max-width: 300px;
}
</style>
<bde-user-autocomplete>
    <select>
      <option value="" selected="">---------</option>
      <option value="-1" data-name="Dupond" data-email="dupond@example.com" data-profile-picture="http://gallery.marvelscollectionscustoms.com/albums/Statues-Collectibles/Weta/Others/Dupont-dupond_04.jpg">Dupond</option>
      <option value="0" data-name="Dupont" data-email="dupont@example.com" data-profile-picture="http://gallery.marvelscollectionscustoms.com/albums/Statues-Collectibles/Weta/Others/Dupont-dupond_04.jpg">Dupont</option>
      <option value="1" data-name="Tintin" data-email="tintin@example.com" data-profile-picture="https://pbs.twimg.com/profile_images/479882800737583104/l4l9QYs7.jpeg">Tintin</option>
      <option value="2" data-name="Tournesol" data-email="tournesol@example.com" data-profile-picture="https://laboussolite.files.wordpress.com/2016/11/image1322.png?w=414">Tournesol</option>
      <option value="3" data-name="Capitaine Haddock" data-email="capitaine@example.com" data-profile-picture="https://i.pinimg.com/originals/1f/11/6d/1f116d56d3da7b743f30e03a5e5629bb.jpg">Capitaine-haddock</option>
    </select>
</bde-user-autocomplete>
    `
},{notes:{markdown:UserAutocomplete}})