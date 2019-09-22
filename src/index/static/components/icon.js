// language=HTML
(() => {
    /**
     * @component bde-icon
     *
     * Components graphique affichant un icon en SVG
     *
     */

    const TEMPLATE = `
    <style>
        :host {
            display: inline-block;
            font-size: inherit;
            width: inherit;
            height: inherit;
        }
        
        svg {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    </style>
    <span id="icon"></span>
    `

    customElements.define("bde-icon", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            document.addEventListener("IconifyAddedIcons",() => {
                if(!this.icon)
                    return;

                if(Iconify.iconExists(this.icon)) {
                    this.setIconSvg()
                }
            })
        }

        requestIcon(){
            if(!this.icon)
                return;

            if(Iconify.iconExists(this.icon)){
                this.setIconSvg()
            } else {
                Iconify.preloadImages([this.icon])
            }
        }

        setIconSvg(){
            let fontSize = window.getComputedStyle(this, null).getPropertyValue('font-size')

            let height = parseFloat(fontSize)

            this.root.getElementById("icon").innerHTML = Iconify.getSVG(this.icon, isNaN(height) ? {} : {
                'data-height': height
            })
        }

        get icon(){
            return this.$iconName
        }

        set icon(val){
            this.$iconName = val
            this.requestIcon()
        }

        static get observedAttributes(){
            return ['icon']
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