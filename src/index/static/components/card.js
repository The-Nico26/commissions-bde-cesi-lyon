// language=HTML
(() => {
    /**
     * @component bde-card
     *
     * Components graphique d'une carte ayant un effet au survol et au clic
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
                display:  block;
                background: white;
                border-radius: 10px;
                box-shadow: 0 0 5px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.3);
                transition: ease 0.5s;
                transition-property: box-shadow transform;
            }
            
            :host(:hover) {
                box-shadow: 0 0 8px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.2);
                transform: translateY(-5px);
            }
    
            :host(:active) {
                box-shadow: 0 0 6px rgba(0,0,0,0.07), 0 6px 12px rgba(0,0,0,0.25);
                transform: translateY(-3px);
                transition-duration: 0.2s;
            }

            :host(.static:hover) {
                box-shadow: 0 0 5px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.3);
                transform: none;
            }

            :host(.static:active) {
                box-shadow: 0 0 5px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.3);
                transform: none;
            }
    
        </style>
        <slot></slot>
    `

    customElements.define("bde-card", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

    })

})()