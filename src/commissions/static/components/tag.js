(() => {

    const TEMPLATE = `
    <style>
    
    :host {
        display: inline-block;
    }
    
    .tag {
        display: inline-block;
        padding:  5px;
        font-size: 12px;
        background-color: #1e1e1e;
        color: white;
        border-radius: 5px;
    }
    
    ::slotted(*) {
        font-size: 12px;
        color: white;
    }
    
    </style>
    <div class="tag" id="tag">
        <slot></slot>
    </div>
    `

    customElements.define("bde-tag",class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        get color() {
            return this.$color
        }

        set color(val) {
            this.$color = val
            this.root.getElementById("tag").style.backgroundColor = this.$color
        }

        static get observedAttributes(){
            return ['color']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'color':
                    this.color = newval
                    break;
            }
        }

    })

})()