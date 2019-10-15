// language=HTML
(() => {
    /**
     * @component bde-shelf
     *
     * Components graphique d'une étagère d'élément avec titre et toolbar
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
                width: 100%;
            }
            
            .content-shelf {
            }
            
            .heading {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;
                margin-left: 2vw;
                width: 100%;
            }
            
            .shelf-title {
                flex: 1;
                margin-right: 10px;
                width: 100%;
            }
            
            .shelf-title {
                font-family: var(--title-fonts);
                font-size: 35px;
                color: var(--title-color);
            }
            
            .shelf-content {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .shelf-content *, .shelf-content ::slotted(*) {
                margin: 10px !important;
            }
            
            .shelf-toolbar slot {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .shelf-toolbar ::slotted(*) {
                margin: 0 5px !important;
            }
            
            @media screen and (max-width: 800px) {
                .heading {
                    flex-direction: column;
                }
                
                .shelf-toolbar {
                    width: 100%;
                    margin-top: 20px;
                }
            
                .shelf-title {
                    margin-right: 0;
                }
                
                .shelf-content {
                    justify-content: center;
                }
            }
    
        </style>
        <div class="content-shelf">
            <div class="heading">
                <div class="shelf-title"><slot name="title" ></slot></div>
                <div class="shelf-toolbar"><slot name="toolbar" ></slot></div>
            </div>
            <div class="shelf-content">
                <slot></slot>
            </div>
        </div>
    `

    customElements.define("bde-shelf", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

    })

})()