(() => {

    // language=HTML
    const TEMPLATE = `
        <style>
    
            :host {
                display: block;
                width: 100%;
                height: auto;
            }
            
            .hidden {
                display: none;
            }
            
            .selected-image {
                width: 100%;
                height: 100%;
                object-fit: scale-down;
                border-radius: 10px;
            }
            
            .drop-area {
                color: rgba(0,0,0,0.3);
                border: 5px dashed currentColor;
                border-radius: 10px;
                
                background: transparent;
                
                width: 100%;
                height: 200px;
                
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                text-align: center;
                
                transition: 0.5s ease color;
                padding: 5px;
            }
            
            .drop-area.active {
                color: var(--primary-color)
            }
            
            .icon {
                height: 60px;
            }
            
            .info {
                padding: 20px;
            }
            
        </style>
    
        <button class="drop-area" id="container">
            <img class="selected-image hidden" id="selected-image" />
            <div class="info" id="info">
                <div class="icon">
                    <bde-icon icon="mdi-image"></bde-icon>
                </div>
                <p>Clique ou glisse une image ici pour l'importer</p>
            </div>
        </button>
    `

    customElements.define("bde-image-selector", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            this.fieldEl = this.querySelector("input[type=\"file\"]")
            this.container = this.root.getElementById("container")

            this.container.addEventListener("click", e => this.handleCLick(e))

            this.fieldEl.addEventListener("change", () => this.updateImage())

            this.container.addEventListener('dragover', (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            });

            this.container.addEventListener("dragenter", e => {
                this.container.classList.add("active")
            })

            this.container.addEventListener("dragexit", e => {
                this.container.classList.remove("active")
            })

            this.container.addEventListener("drop", e => {
                e.preventDefault()
                e.stopPropagation()
                this.handleDrop(e)
            })

            this.updateImage()
        }

        handleCLick(e){
            e.preventDefault()
            this.fieldEl.click()
        }

        updateImage() {
            let img = this.root.getElementById("selected-image")
            let info = this.root.getElementById("info")

            if(this.fieldEl.files.length > 0) {
                let reader = new FileReader()

                reader.addEventListener("load", e => {
                    img.src = e.target.result
                    img.classList.remove("hidden")
                    info.classList.add("hidden")
                })

                img.src = reader.readAsDataURL(this.fieldEl.files[0])

                img.classList.add("hidden")
                info.classList.remove("hidden")

            } else {
                img.classList.add("hidden")
                info.classList.remove("hidden")
            }
        }

        handleDrop(e) {
            this.container.classList.remove("active")
            if(e.dataTransfer.files.length === 1){
                this.fieldEl.value = ""
                this.fieldEl.files = e.dataTransfer.files
                this.updateImage()
            }
        }
    })

})()