import {addDecorator, storiesOf} from "@storybook/html";

const stories = storiesOf("Formulaires", module);

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