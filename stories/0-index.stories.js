import { storiesOf} from "@storybook/html";

import Readme from "../README.md"
import ComponentsDoc from "../doc/components/index.md"

const stories = storiesOf("Bienvenue", module);

stories.add("Readme", () => `Voir notes`, { notes: {markdown: Readme} })

stories.add("Components", () => `Voir notes`, { notes: {markdown: ComponentsDoc} })