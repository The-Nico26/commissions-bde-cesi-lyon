import {object, select, text, withKnobs} from "@storybook/addon-knobs";
import {addDecorator, storiesOf} from "@storybook/html";

addDecorator(withKnobs)
const stories = storiesOf("Utilisateurs", module);

import "../src/users/static/components/user"
import UserDoc from "../doc/components/user.md"

stories.add("Utilisateur", () => {

    let name = text("Nom", "Tintin")
    let role = text("Role", "Président")
    let ppurl = text("URL d'image de profil", "https://pbs.twimg.com/profile_images/479882800737583104/l4l9QYs7.jpeg")
    let href = text("Lien", "mailto:tintin@example.org")

    return `
<style>
    bde-user {
        width: 200px;
    }
</style>
<bde-user
    role="${role}"
    image-src="${ppurl}"
    href="${href}"
>
    ${name}
</bde-user>
    `
},{notes:{markdown:UserDoc}})