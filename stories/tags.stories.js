import {object, select, text, withKnobs} from "@storybook/addon-knobs";
import {storiesOf} from "@storybook/html";

const stories = storiesOf("Tags", module);

stories.addDecorator(withKnobs)

import "../src/commissions/static/components/tag"
import TagDoc from "../doc/components/tag.md"

stories.add("Tag", () => {
    let name = text("Nom", "Tag A")
    let color = text("Couleur", "#e94545")

    return `<bde-tag color="${color}">${name}</bde-tag>`
},{notes:{markdown:TagDoc}})