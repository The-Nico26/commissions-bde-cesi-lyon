(() => {

    // language=HTML
    const TEMPLATE = `
        <link rel="stylesheet" href="/static/css/framework.css">
        <style>
    
            :host {
                display: block;
                width: 100%;
                height: auto;
            }
            
            .hidden {
                display: none;
            }
            
            .input-field {
                height: 45px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
            }
            
            .autocompletion-panel {
                position: relative;
                width: 100%;
                flex: 1;
            }
            
            .autocompletion-panel.focus {
                background: white;
                box-shadow: 0 5px 10px rgba(0,0,0,0.3);
                border-radius: 5px 5px 0 0;
            }
            
            .autocompletion-panel input {
                width: 100%;
            }
            
            .autocompletion-panel.focus input {
                border: none;
                padding: 10px;
                background: white;
                z-index: 2;
                position: relative;
                display: block;
            }
            
            .autocomplete-content {
                position: absolute;
                bottom: 1px;
                left: 0;
                width: 100%;
                transform: translateY(100%);
                box-shadow: 0 5px 10px rgba(0,0,0,0.3);
                background: white;
                border-radius: 0 0 5px 5px;
                padding: 10px;
                z-index: 1;
            }
            
            .autocompletion-panel:not(.focus) .autocomplete-content {
                display: none;
            }
            
            .notext, .not-found {
                font-size: 13px;
                color: rgba(0,0,0,0.5);
                text-align: center;                
            }
            
            .propositions {
                max-height: 25vh;
                overflow-y: auto;
                overflow-x: hidden;
            }
            
            .propositions > * {
                margin: 5px;
            }
            
            .current-user {
                cursor: pointer;
            }
            
        </style>
    
        <div class="input-field">
            <bde-user id="current-user" class="current-user hidden"></bde-user>
            <div class="autocompletion-panel" id="panel">
                <input type="text" id="text-field" class="hidden" placeholder="Chercher un utilisateur..."/>
                <div class="autocomplete-content">
                    <div class="propositions" id="propositions" ></div>
                    <div class="notext" id="notext-info">Tapes le nom d'un utilisateur pour le chercher dans la base de données</div>
                    <div class="not-found hidden" id="notfound-info">Aucun utilisateur trouvé, assures toi qu'il se soit connecté au moin une fois au site...</div>
                </div>
            </div>
        </div>
    `

    customElements.define("bde-user-autocomplete", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            this.fieldEl = this.querySelector("select")
            this.currentUser = this.root.getElementById("current-user")
            this.textField = this.root.getElementById("text-field")
            this.propositions = this.root.getElementById("propositions")

            this.fieldEl.addEventListener("change", () => this.updateInput())

            this.textField.addEventListener("focus", () => this.showAutocomplete())
            this.root.getElementById("panel").addEventListener("mouseleave", () => {
                this.hideAutocomplete()
            })

            this.textField.addEventListener("change", () => this.updateAutocomplete())
            this.textField.addEventListener("keyup", e => {
                if(e.key == "Enter"){
                    this.hideAutocomplete()
                    this.flushValue()
                } else {
                    this.showAutocomplete()
                    this.updateAutocomplete()
                }
            })

            this.currentUser.addEventListener("click", () => {
                this.showInput()
                this.textField.focus()
            })

            this.users = Array.from(this.fieldEl.querySelectorAll("option")).filter(el => el.value != "").map(el => {
                return {
                    name: el.getAttribute("data-name"),
                    image: el.hasAttribute("data-profile-picture") ? el.getAttribute("data-profile-picture") : null,
                    email: el.getAttribute("data-email"),
                    value: el.value
                }
            })

            this.users.forEach(el => {
                let element = document.createElement("bde-user")
                element.innerHTML = el.name
                element.role = el.email
                if(el.image){
                    element.imageSrc = el.image
                }
                element.classList.add("hidden")
                element.setAttribute("data-normalized-text",`${el.name} ${el.email}`.toLowerCase().normalize("NFC"))
                element.setAttribute("data-value", el.value)
                element = this.propositions.appendChild(element)
                element.addEventListener("click", () => this.flushValue(element))
            })

            requestAnimationFrame(() => this.updateInput())
        }

        updateInput(){

            let selectedOption = Array.from(this.fieldEl.querySelectorAll("option")).find(el => el.selected)

            if(selectedOption && selectedOption.value != ""){

                this.currentUser.innerHTML = selectedOption.getAttribute("data-name")
                if(selectedOption.hasAttribute("data-profile-picture")) {
                    this.currentUser.imageSrc = selectedOption.getAttribute("data-profile-picture")
                } else {
                    this.currentUser.imageSrc = ""
                }
                this.currentUser.role = selectedOption.getAttribute("data-email")
                this.showUser()
            } else {
                this.showInput()
            }

        }

        showInput(){
                this.textField.classList.remove("hidden")
                this.currentUser.classList.add("hidden")
        }

        showUser(){
                this.currentUser.classList.remove("hidden")
                this.textField.classList.add("hidden")
        }

        showAutocomplete() {
            this.root.getElementById("panel").classList.add("focus")
        }

        hideAutocomplete() {
            this.root.getElementById("panel").classList.remove("focus")
        }

        flushValue(forceElement) {
            let foundElement = forceElement ? forceElement : this.propositions.querySelector(":not(.hidden)")
            if(foundElement) {
                this.fieldEl.value = foundElement.getAttribute("data-value")
            } else {
                this.fieldEl.value = ""
            }
            this.updateInput()
        }

        updateAutocomplete() {
            let text = this.textField.value.toLowerCase().normalize("NFC")

            if(text.length == 0){
                this.root.getElementById("notext-info").classList.remove("hidden")
                this.root.getElementById("notfound-info").classList.add("hidden")
                Array.from(this.propositions.children).forEach(el => {
                        el.classList.add("hidden")
                })
                this.flushValue()
                return
            } else {
                this.root.getElementById("notext-info").classList.add("hidden")
            }

            let foundSomething = false

            Array.from(this.propositions.children).forEach(el => {
                if(el.getAttribute("data-normalized-text").includes(text)){
                    el.classList.remove("hidden")
                    foundSomething = true
                } else {
                    el.classList.add("hidden")
                }
            })

            if(!foundSomething){
                this.root.getElementById("notfound-info").classList.remove("hidden")
                return
            } else {
                this.root.getElementById("notfound-info").classList.add("hidden")
            }
        }
    })

})()