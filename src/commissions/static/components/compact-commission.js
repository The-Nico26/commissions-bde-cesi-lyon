(() => {

    const TEMPLATE = `
    <style>
    
    :host {
        display: block;
    }

    .commission {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .small-commission-info {
        flex: 1;
        text-align: left;
    }
    
    .small-commission-logo {
        width: 40px;
        height: 40px;
        border: solid 2px white;
        margin: 3px;
        border-radius: 10px;
        background: white;
        overflow: hidden;
        margin-right: 15px;
    }

    .small-commission-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .bds .small-commission-logo {
        border-color: var(--bds-color);
    }
    
    </style>
    <div class="commission" id="root">
        <div class="small-commission-logo"><img id="logo" /></div>
        <div class="small-commission-info"><slot></slot></div>
    </div>
    `

    customElements.define("bde-compact-commission",class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
            this.rootEl = this.root.getElementById("root")
        }

        get organization() {
            return this.$organization
        }

        set organization(val) {
            this.$organization = val

            this.rootEl.classList.remove("bds")
            this.rootEl.classList.remove("bde")

            switch(this.$organization){
                case "bde":
                    this.rootEl.classList.add("bde");
                    break;
                case "bds":
                    this.rootEl.classList.add("bds");
                    break;
            }
        }

        get logoSrc() {
            return this.$logoSrc
        }

        set logoSrc(val) {
            this.$logoSrc = val
            this.root.getElementById("logo").src = this.$logoSrc
        }

        static get observedAttributes(){
            return ['logo-src', 'organization']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'logo-src':
                    this.logoSrc = newval
                    break;
                case 'organization':
                    this.organization = newval
                    break;
            }
        }

    })

})()