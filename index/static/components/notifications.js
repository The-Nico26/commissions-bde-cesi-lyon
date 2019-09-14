(() => {

    window.notifications = new class NotificationManager {

        constructor(){
            this.registered = []
            this.TYPE = {
                DEBUG: "DEBUG",
                INFO: "INFO",
                SUCCESS: "SUCCESS",
                WARNING: "WARNING",
                ERROR: "ERROR",
            }
        }

        register(callback){
            this.registered.push(callback)
            return callback;
        }

        send(type, message){
            this.registered.forEach(callb => {
                callb({
                    type: type,
                    message: message
                })
            })
        }

        sendInfo(message){ this.send(this.TYPE.INFO,message) }
        sendSuccess(message){ this.send(this.TYPE.SUCCESS,message) }
        sendWarning(message){ this.send(this.TYPE.WARNING,message) }
        sendError(message){ this.send(this.TYPE.ERROR,message) }
        sendDebug(message){ this.send(this.TYPE.DEBUG,message) }

    }

    window.notifications.register(notif => {
        let message = `Notification ${notif.type} : ${notif.message}`
        switch (notif.type) {
            case window.notifications.TYPE.INFO:
            case window.notifications.TYPE.SUCCESS:
                console.info(message)
                break;
            case window.notifications.TYPE.WARNING:
                console.warn(message)
                break;
            case window.notifications.TYPE.ERROR:
                console.error(message)
                break;
            default:
                console.log(message)
                break;
        }
    })

})();

(() => {
    /**
     * @component bde-card
     *
     * Component affichant une unique notification
     *
     */

    const TEMPLATE = `
        <style>
            @keyframes appear {
                from { transform: translateY(-200%); opacity: 0; }            
                to { transform: translateY(0); opacity: 1; }            
            }
            
            @keyframes disappear {
                from { transform: translateX(0); opacity: 1; }            
                to { transform: translateX(100%); opacity: 0; }            
            }
            
            * {
                box-sizing: border-box;
            }
            
            :host {
                width: 100%;
                display: block;
            }
            
            .notif {
                width: calc(100% - 20px);
                margin: 10px;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 5px 10px rgba(0,0,0,0.2);
                
                background: rgba(19,19,19,0.9);
                color: white;
                
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                
                animation: ease appear 0.5s;
            }
            
            .notif.disappear {
                animation: ease disappear 0.5s;
            }
            
            .notif.info {
                background: rgba(0,128,179,0.9);
            }
            
            .notif.success {
                background: rgba(0,179,55,0.9);
            }
            
            .notif.warning {
                background: rgba(179,117,0,0.9);
            }
            
            .notif.error {
                background: rgba(179,19,0,0.9);
            }
            
            .message {
                flex: 1;
                padding: 7px 0;
            }
            
            .toolbar {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: flex-start;
                color: currentColor;
                opacity: 0.7;
            }
            
            .toolbar > * {
                height: 30px;
                width: 30px;
                background: transparent;
                border: none;
                padding: 0;
                
                display: flex;
                justify-content: center;
                align-items: center;
                color: currentColor;
                
                opacity: 0;
                cursor: pointer;
            }
            
            .toolbar > *:active, .notif:hover .toolbar > * {
                opacity: 100;
            }
        </style>
        <div class="notif" id="container">
            <div class="message">
                <slot></slot>
            </div>
            <div class="toolbar">
                <button id="close-btn"><bde-icon icon="mdi-close"></bde-icon></button>
            </div>
        </div>
    `

    customElements.define("bde-notification", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            this.setIdle()
            let el = this.root.getElementById("container")
            el.addEventListener("mouseenter", () => this.cancelIdle())
            el.addEventListener("mouseleave", () => this.setIdle())
            let closeEl = this.root.getElementById("close-btn")
            closeEl.addEventListener("click",async () => {
                await this.disappear();
                this.dispatchEvent(new Event("bde-notif-close"))
            })
        }

        setIdle(){
            this.$idleTimeout = setTimeout(async () => {
                await this.disappear()
                this.dispatchEvent(new Event("bde-notif-idleclose"))
                this.dispatchEvent(new Event("bde-notif-close"))
            },3000)
        }

        cancelIdle() {
            clearTimeout(this.$idleTimeout)
        }

        async disappear(){
            let el = this.root.getElementById("container")
            el.classList.add("disappear")
            await new Promise( resolve => setTimeout(() => resolve(),500))
        }

        get type(){
            return this.$type
        }

        set type(val){
            let el = this.root.getElementById("container")
            el.classList.remove(this.$type)
            this.$type = val.toLowerCase()
            el.classList.add(this.$type)
        }

        static get observedAttributes(){
            return ['type']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'type':
                    this.type = newval
                    break;
            }
        }
    })

})();

(() => {
    /**
     * @component bde-card
     *
     * Components affichant les notifications
     *
     */

    const TEMPLATE = `
        <style>
            :host {
                width: 100%;
                display: block;
            }
            
            .container {
                width: 100%;
                display: flex;
                flex-direction: column-reverse;
            }
            
        </style>
        <div class="container"> 
            <slot></slot>
        </div>
    `

    customElements.define("bde-notification-container", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            window.notifications.register(this.displayNotification.bind(this))
        }

        displayNotification(notification){
            let notif = document.createElement("bde-notification")
            notif.innerHTML = notification.message
            notif.type = notification.type
            let el = this.appendChild(notif)
            el.addEventListener("bde-notif-close", () => el.remove())
        }

    })

})();