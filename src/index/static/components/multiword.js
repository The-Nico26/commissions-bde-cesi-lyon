// language=HTML
(() => {
    /**
     * @component bde-multiword
     *
     * Components graphique affichant un de ses sous-éléments à la fois pendant 1 seconde avant de passer au suivant
     *
     */

    const TEMPLATE = `
    <style>
        :host {
            display: inline-block;
            overflow: hidden;
            
            position: relative;
            bottom: -5px;
        }
        
        #next.rolling, #current.rolling {
            transition: transform 0.5s linear;
            display: inline-block;
        }
        
        #next {
            position: absolute;
            top: 0;
            left: 0;
            white-space: nowrap;
            transform: translateY(-100%);
        }
        
        #next.rolling {
            transform: translateY(0);
        }
        
        #current {
            transform: translateY(0);
        }
        
        #current.rolling {
            transform: translateY(100%);
        }
    </style>
    <span id="current"></span>
    <span id="next"></span>
    `

    customElements.define("bde-multiword", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))

            this.$currentChild = -1
        }

        connectedCallback(){
            this.nextWord()
            this.$rollingInterval = setInterval(() => this.nextWord(), 3500)
        }

        disconnectedCallback(){
            clearInterval(this.$rollingInterval)
        }

        nextWord() {
            let numChildren = this.children.length

            let currentEl = this.root.getElementById("current")
            let nextEl = this.root.getElementById("next")

            if(numChildren <= 0){
                currentEl.innerHTML = ""
                nextEl.innerHTML = ""
                return
            }

            let nextChildIndex = (this.$currentChild + 1) % numChildren

            let nextChild = this.children.item(nextChildIndex)

            this.$currentChild = nextChildIndex

            nextEl.appendChild(nextChild.cloneNode(true))

            this.classList.add("rolling")
            currentEl.classList.add("rolling")
            nextEl.classList.add("rolling")

            let nextWidth = nextEl.getBoundingClientRect().width;
            if(nextWidth > this.getBoundingClientRect().width) {
                this.style.width = `${nextWidth}px`
            }

            setTimeout(() => {
                this.classList.remove("rolling")
                currentEl.classList.remove("rolling")
                nextEl.classList.remove("rolling")
                currentEl.innerHTML = ""
                currentEl.appendChild(nextEl.children.item(0))
                this.style.width = "auto"
            }, 500)
        }

        static get observedAttributes(){
            return []
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'icon':
                    this.icon = newval
                    break;
            }
        }
    })

})()