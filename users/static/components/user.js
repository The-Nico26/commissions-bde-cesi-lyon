(() => {

    const TEMPLATE = `
    <style>

    :host {
        display: block;
        width: 100%;
        color: inherit;
    }

    .user {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: inherit;
        text-decoration: inherit;
        border-radius: 50px;
        padding-right: 5px;
    }
    
    .user[href]:hover {
        background-color: #ebebeb;
    }

    .image {
        padding-right: 10px;
    }
    
    .image > * {
        width: 40px;
        height: 40px;
        background: #e1e1e1;
        border-radius: 100%;
        border: none;
        overflow: hidden;
    }
    
    .info {
        flex: 1;
    }

    .role {
        font-size: 13px;
        margin-bottom: 4px;
        color: inherit;
        opacity: 0.8;
    }
    
    .hidden {
        display: none;
    }
    
    .name {
        color: inherit;
    }
    
    </style>
    <a class="user" id="link">
        <div class="image">
            <div class="placeholder" id="placeholder-pic"></div>
            <img class="hidden" id="pic"/>
        </div>
        <div class="info">
            <div class="role hidden" id="role"></div>
            <div class="name"><slot></slot></div>
        </div>
    </a>
    `

    customElements.define("bde-user", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        get role(){
            return this.$role
        }

        set role(val){
            this.$role = val;
            let role = this.root.getElementById("role")
            if(typeof this.$role != "undefined" && this.$role != ""){
                role.classList.remove("hidden")
                role.innerHTML = this.$role
            } else {
                role.classList.add("hidden")
            }
        }

        get href(){
            return this.$href
        }

        set href(val){
            this.$href = val;
            let link = this.root.getElementById("link")
            if(typeof this.$href != "undefined" && this.$href != ""){
                link.href = this.$href
            } else {
                link.href = null
            }
        }

        set imageSrc(val){
            this.$imageSrc = val;
            let img = this.root.getElementById("pic")
            let placeholder = this.root.getElementById("placeholder-pic")
            if(typeof this.$imageSrc != "undefined" && this.$imageSrc != ""){
                img.classList.remove("hidden")
                placeholder.classList.add("hidden")
                img.src = this.$imageSrc
            } else {
                img.classList.add("hidden")
                placeholder.classList.remove("hidden")
            }
        }

        static get observedAttributes(){
            return ['role', 'image-src', 'href']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'role':
                    this.role = newval
                    break;
                case 'image-src':
                    this.imageSrc = newval
                    break;
                case 'href':
                    this.href = newval
                    break;
            }
        }

    })

})()