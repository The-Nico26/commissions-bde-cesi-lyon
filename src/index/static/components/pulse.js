// language=HTML
(() => {
    /**
     * @component bde-pulse
     *
     * Components graphique affichant un cercle distinctif permettant d'attirer l'oeul de l'utilisateur
     *
     */

    const TEMPLATE = `
        <style>

            @keyframes pulse {
                0% {
                    transform: translateX(-50%) translateY(-50%) scale(0);
                    opacity: 1;
                }
                50% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateX(-50%) translateY(-50%) scale(1);
                    opacity: 0;
                }
            }

            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            :host {
                position: relative;
            }

            .circle {
                opacity: 1;
                border-radius: 100%;
                width: 300px;
                height: 300px;
                position: absolute;
                left: 50%;
                top: 50%;

                background: radial-gradient(ellipse at center, rgba(0, 167, 226, 0) 0%, rgba(0, 167, 226, 0.75) 100%);

                transform: translateY(-50%) translateX(-50%) scale(0);
                
                pointer-events: none;
            }
            
            .circle.medium {
                width: 200px;
                height: 200px;
            }
            
            .circle.small {
                width: 100px;
                height: 100px;
            }
            
            .circle.tiny {
                width: 50px;
                height: 50px;
            }
            
            .circle.pulse {
                animation: pulse 1.5s cubic-bezier(.12,.63,.43,.96);
                animation-iteration-count: 1;
            }
            
            .circle.pulse.infinite {
                animation-iteration-count: infinite;
            }

        </style>
        <div class="circle"></div>
        <div class="container">
            <slot></slot>
        </div>
    `

    customElements.define("bde-pulse", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))

            this.circle = this.root.querySelector(".circle")
        }

        pulse(){
            if(this.circle.classList.contains("pulse"))
                return
            this.circle.classList.add("pulse")
            setTimeout(() => {
                this.circle.classList.remove("pulse")
            }, 1500)
        }

    })

})()