(() => {
    /**
     * @component bde-mobile-header
     *
     * Component représentant le header de page permettant d'afficher le hamburger mobile
     * et/ou les éventuels outils contextuels de la page
     *
     */

    // language=HTML
    const TEMPLATE = `
        <style>
            
            :host {
                display: none;
                width: 100%;
                height: auto;
                background: white;
                box-shadow: 0 0 8px rgba(0,0,0,0.25);
                padding: 0 30px;
            }
            
            :host(:not(:empty)){
                display: block;
            }
            
            header {
                min-height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            
            header > *, .page-toolbar slot::slotted(*) {
                height: 40px;
                min-width: 40px;
            }
            
            .toolbar-button, .page-toolbar slot::slotted(.toolbar-button) {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin: 0;
                background: transparent;
                border: none;
                cursor: pointer;
            }
            
            .page-toolbar {
                flex: 1;
                display: flex;
                justify-content: right;
                align-items: center;
                overflow: visible;
            }
            
            .menu-activator {
                display: none;
            }
            
            .iconify {
                font-size: 35px;
            }
            
            @media screen and (max-width: 800px) {
                .menu-activator {
                    display: block;
                }
                
                :host {
                    padding: 0 10px;
                    display: block;
                }
            }
        </style>
    <header>
        <bde-class-switcher id="hamburger" target-class="activated" class="menu-activator toolbar-button">
            <bde-icon icon="mdi-menu"></bde-icon>
        </bde-class-switcher>
        <div class="page-toolbar">
            <slot></slot>
        </div>
    </header>
    `

    customElements.define("bde-mobile-header", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        get asideTarget(){
            return this.$asideTarget
        }

        set asideTarget(val){
            this.$asideTarget = val
            this.root.getElementById("hamburger").target = this.$asideTarget
        }

        static get observedAttributes(){
            return ['aside-target']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'aside-target':
                    this.asideTarget = newval
                    break;
            }
        }

    })

})()