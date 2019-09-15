(() => {

    customElements.define("bde-markdown",class extends HTMLElement {

        connectedCallback(){
            this.simplemde = new SimpleMDE({
                element: this.querySelector("textarea"),
                spellcheck: false
            });
        }

    })

})()