// language=HTML
(() => {
    /**
     * @component bde-modal
     *
     * Components affichant une modal à l'utilisateur avec un quelconque contenu
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
                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2100;
            }

            .container {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                overflow: hidden;
            }

            .modal {
                width: auto;
                height: auto;

                max-height: 90vh;
                max-width: 90vw;

                background: white;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                border-radius: 3px;
                overflow: auto;
                position: relative;
            }

            .close {
                position: absolute;
                top: 0;
                right: 0;
                background: white;
                border: none;
                color: rgba(0, 0, 0, 0.5);
                z-index: 2101;
                width: 50px;
                height: 50px;
                border-radius: 0 0 0 100%;
                overflow: hidden;
                padding: 0 0 5px 5px;
                cursor: pointer;
            }
            
            .close bde-icon {
                width: 30px;
            }

            @media screen and (max-width: 800px) {
                .modal {
                    max-height: 100vh;
                    max-width: 100vw;
                }
            }
            
            @keyframes fadeBackground {
                from {
                    background: rgba(0, 0, 0, 0);
                }
                to {
                    background: rgba(0, 0, 0, 0.5);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            @keyframes enter {
                from {
                    transform: translateY(-25%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .container.closed, :host(.closed) {
                display: none;
            }
            
            .container:not(.closed) {
                animation: fadeBackground ease 0.5s;
            }
            
            .container:not(.closed) .modal {
                animation: enter ease 0.5s;
            }
            
            .container.closing {
                animation: fadeOut ease 0.5s;
                pointer-events: none;
            }

        </style>
        <div class="container closed" id="container">
            <div class="modal">
                <slot></slot>
                <button class="close" id="close">
                    <bde-icon icon="mdi-close"></bde-icon>
                </button>
            </div>
        </div>
    `

    customElements.define("bde-modal", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))

            this.container = this.root.getElementById("container")
            this.root.getElementById("close").addEventListener("click", () => this.close())
        }

        connectedCallback(){
            this.classList.add("closed")
        }

        close(){
            this.container.classList.add("closing")
            setTimeout(() => {
                this.container.classList.add("closed")
                this.classList.add("closed")
                this.container.classList.remove("closing")
            },500)
        }

        open(){
            this.container.classList.remove("closed")
            this.classList.remove("closed")
            this.container.classList.remove("closing")
        }

    })

})()