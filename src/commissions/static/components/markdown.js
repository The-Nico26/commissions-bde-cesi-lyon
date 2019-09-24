(() => {

    customElements.define("bde-markdown",class extends HTMLElement {

        connectedCallback(){
            requestAnimationFrame(() => {
                this.simplemde = new SimpleMDE({
                    element: this.querySelector("textarea"),
                    spellChecker: false
                });
            })
        }

    })

})()