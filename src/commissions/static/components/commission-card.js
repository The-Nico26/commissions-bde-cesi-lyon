(() => {
    /**
     * @components bde-commission-card
     *
     * @attr banner-src - URL de l'image d'arrière plan de la commission
     * @attr logo-src - URL de l'image de profil de la commission
     * @attr commission-name - Nom de la commission
     * @attr href - URL d'acces à la page de commission
     *
     * @slot Courte description de la commission
     * @slot meta - Les éléments du footer de la carte
     *
     * @requires bde-card
     *
     */

    // language=HTML
    const TEMPLATE = `
                <style>

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    :host {
                        display: block;
                    }

                    .card {
                        width: 300px;
                        height: 300px;
                        max-width: 100%;
                        position: relative;
                        padding: 75px 10px 10px;
                    }

                    .banner {
                        width: 100%;
                        height: 150px;
                        overflow: hidden;
                        border-radius: 10px 10px 0 0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: var(--primary-color);
                    }

                    .banner img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;

                        transition: 0.5s ease transform;
                    }

                    .card:hover .banner img {
                        transform: scale(1.05);
                    }

                    .logo {
                        width: 105px;
                        height: 105px;
                        border: solid 5px white;
                        border-radius: 10px;
                        overflow: hidden;
                        position: relative;
                        margin-left: auto;
                        margin-right: auto;
                        background: white;
                    }

                    .logo img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .name {
                        text-align: center;
                        margin-top: 0;
                        margin-bottom: 5px;
                        font-family: sans-serif;
                        font-size: 20px;
                        color: #414141;
                    }

                    .short-description {
                        font-style: italic;
                        text-align: center;
                        font-size: 15px;
                        max-height: 32px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        margin-bottom: 10px;
                        font-family: sans-serif;
                        flex: 1;
                    }

                    .meta {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        flex-wrap: wrap-reverse;

                        font-size: 10px;
                        color: #646464;
                        font-family: sans-serif;
                    }

                    .link {
                        text-decoration: inherit;
                        color: inherit;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: stretch;
                    }

                    .info {
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: stretch;
                        flex: 1;
                    }

                    .tags {
                        height: 22px;
                        margin-bottom: 10px;
                    }

                    .tags slot {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .tags slot::slotted(*) {
                        margin: 0 5px;
                        display: block;
                    }

                    .status {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        height: 40px;
                        min-width: 40px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: row;
                    }
                    
                    .status bde-icon {
                        height: 30px;
                    }
                    
                    .status .organization > * {
                        display: none;
                    }
                    
                    .bds .status .organization .bds-token {
                        display: block;
                        color: var(--bds-color);
                        
                        border-radius: 40px;
                        background: rgba(0,0,0,0.5);
                        height: 40px;
                        width: 40px;
                        text-align: center;
                        line-height: 40px;
                        padding-top: 5px;
                    }
                    
                    .president slot::slotted(*) {
                        color: white;
                        background-color: rgba(0, 0, 0, 0.3);
                        border-radius: 50px;
                        padding-right: 15px;
                    }

                    .autoresizer {
                        display: block;
                        width: 100%;
                        height: 20px;
                    }

                    .bds .logo {
                        border-color: var(--bds-color);
                    }

                </style>

                <bde-card class="card" id="root-el">
                    <a id="link" class="link">
                        <div class="banner">
                            <img id="banner"/>
                        </div>
                        
                        <span class="status">
                            <span class="organization">
                                <span class="bds-token" title="Dépendante du BDS">
                                    <bde-icon icon="mdi-run"></bde-icon>
                                </span>
                            </span>
                        </span>

                        <div class="logo">
                            <img id="logo"/>
                        </div>
                        <div class="info">
                            <h4 class="name">
                                <bde-autoresize id="name" class="autoresizer"></bde-autoresize>
                            </h4>

                            <p class="short-description">
                                <slot></slot>
                            </p>

                            <div class="tags">
                                <slot name="tags"></slot>
                            </div>

                            <div class="meta">
                                <slot name="meta"></slot>
                            </div>
                        </div>
                    </a>
                </bde-card>
        `

    customElements.define("bde-commission-card", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
            this.rootEl = this.root.getElementById("root-el");
        }

        /////// PROPERTIES ////////

        get bannerSrc() {
            return this.$bannerSrc
        }

        set bannerSrc(val) {
            this.$bannerSrc = val
            this.root.getElementById("banner").src = this.$bannerSrc
        }

        get logoSrc() {
            return this.$logoSrc
        }

        set logoSrc(val) {
            this.$logoSrc = val
            this.root.getElementById("logo").src = this.$logoSrc
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

        get href() {
            return this.$href
        }

        set href(val) {
            this.$href = val
            this.root.getElementById("link").href = this.$href
        }

        get commissionName() {
            return this.$commissionName
        }

        set commissionName(val) {
            this.$commissionName = val
            this.root.getElementById("name").innerHTML = this.$commissionName
        }

        static get observedAttributes(){
            return ['banner-src', 'logo-src', 'commission-name', 'href', 'organization']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'href':
                    this.href = newval
                    break;
                case 'banner-src':
                    this.bannerSrc = newval
                    break;
                case 'logo-src':
                    this.logoSrc = newval
                    break;
                case 'commission-name':
                    this.commissionName = newval
                    break;
                case 'organization':
                    this.organization = newval
                    break;
            }
        }

    })

})()