(() => {
    /**
     * @component bde-autoresize
     *
     * Components redimentionnant automatiquement la taille du texte pour que cela tienne dans la boite définie
     *
     */

    const TEMPLATE = `
        <style>
    
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }
            
            :host {
                display:  inline-block;
                height: inherit;
                width: inherit;
            }
    
        </style>
        <div class="container" id="container">
            <slot></slot>
        </div>
    `

    customElements.define("bde-autoresize", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))

            this.container = this.root.getElementById("container")
        }

        connectedCallback(){
            this.observer = new MutationObserver(this.findSize.bind(this)).observe(this,{
                childList: true,
                characterData: true,
                subtree: true
            })

            window.addEventListener("resize", () => this.findSize())

            requestAnimationFrame(() => this.findSize())
        }

        disconnectedCallback(){
            if(this.observer)
                this.observer.disconnect()
        }

        findSize(){
            this.style.fontSize = "inherit"

            let style = window.getComputedStyle(this, null).getPropertyValue('font-size');
            let initialFontSize = parseFloat(style);

            let fontSize = initialFontSize
            while(this.getBoundingClientRect().height < this.container.getBoundingClientRect().height){
                fontSize -= 1
                this.style.fontSize = `${fontSize}px`
            }

        }

    })

})()