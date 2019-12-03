(() => {
    customElements.define("bde-emoji", class extends HTMLElement {

        connectedCallback(){
            this.observer = new MutationObserver(this.parseEmojis.bind(this)).observe(this,{
                childList: true,
                characterData: true,
                subtree: true
            })

            requestAnimationFrame(() => this.parseEmojis())
        }

        parseEmojis() {
            twemoji.parse(this)
        }
    })

})()