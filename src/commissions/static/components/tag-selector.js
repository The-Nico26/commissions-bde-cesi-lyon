(() => {

    // language=HTML
    const TEMPLATE = `
        <style>
    
            :host {
                display: block;
            }
            
            .tag-container {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
            }
            
            .tag-container > * {
                margin: 5px;
                background: transparent;
                padding: 0;
                cursor: pointer;
                border: solid transparent 5px;
                border-radius: 10px;
                transition: ease 0.5s;
                transition-property: border-color, transform, opacity;
            }
            
            .tag-container > .active {
                border-color: var(--primary-color);
                transform: scale(1.05);
            }
            
            .tag-container.out-of-choices > *:not(.active) {
                opacity: 0.5;
                cursor: default;
                pointer-events: none;
            }
            
        </style>
    
        <div class="tag-container" id="container">
            
        </div>
    `

    customElements.define("bde-tag-selector", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            requestAnimationFrame(() => {
                this.selectEl = this.querySelector("select")
                this.renderOptions()

                this.selectEl.addEventListener("change", () => this.updateSelected())
            })
        }

        renderOptions(){
            let options = Array.from(this.selectEl.querySelectorAll("option"))

            let container = this.root.getElementById("container")
            container.innerHTML = ""

            for(let index in options){

                let opt = options[index]

                let el = document.createElement("button")

                let tag = document.createElement("bde-tag")
                tag.innerHTML = opt.innerHTML
                tag.color = opt.getAttribute("data-color")

                el.appendChild(tag)
                el = container.appendChild(el)

                el.addEventListener("click", () => this.toggleOption(index))
            }
            this.updateSelected()
        }

        toggleOption(optionIndex){
            let option = this.selectEl.querySelectorAll("option").item(optionIndex)
            option.selected = !option.selected;
            this.selectEl.dispatchEvent(new Event("change"))
        }

        updateSelected() {
            let options = Array.from(this.selectEl.querySelectorAll("option"))
            let tags = Array.from(this.root.getElementById("container").children)
            for(let index in options){
                if(options[index].selected){
                    tags[index].classList.add("active")
                } else {
                    tags[index].classList.remove("active")
                }
            }

            if(this.selectEl.hasAttribute("data-max")){
                let max = parseInt(this.selectEl.getAttribute("data-max"))
                if(!isNaN(max)){
                    let selectionCount = options.reduce((acc,el) => acc + (el.selected ? 1 : 0), 0)
                    if(selectionCount >= max){
                        this.root.getElementById("container").classList.add("out-of-choices")
                    } else {
                        this.root.getElementById("container").classList.remove("out-of-choices")
                    }
                }
            }
        }

        static get observedAttributes(){
            return []
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'href':
                    this.href = newval
                    break;
            }
        }
    })

})()