(() => {

    const MOUNTHS = [
        "JAN",
        "FEV",
        "MAR",
        "AVR",
        "MAI",
        "JUI",
        "JUL",
        "AOU",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ]

    const TEMPLATE = `
    <style>
    
    :host {
        display: block;
        width: 300px;
    }

    * {
        box-sizing: border-box;
    }

    .event {
        max-width: 100%;
        position: relative;
        padding: 10px;
        width: 100%;
        
        overflow: hidden;
    }

    .event > * {
        z-index: 1;
        position: relative;
    }

    .banner {
        width: 100%;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        overflow: hidden;
        z-index: 0;
    }
    
    :host(.big-banner) .banner {
        height: 200px;
    }

    .banner img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        transition: 0.5s ease transform;
    }

    .banner::after {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(17,11,11,0.6) 100%);
        z-index: 1;
    }

    .event:hover .banner img {
        transform: scale(1.05);
    }

    :host(.static) .event:hover .banner img {
        transform: scale(1);
    }
    
    .header {
        height: 80px;
        margin-bottom: 15px;

        display: flex;
        align-items: flex-end;
    }
    
    :host(.big-banner) .header {
        height: 180px;
    }

    .header .info {
        flex: 1;

        color: rgba(255, 255, 255, 0.9);
    }

    .header .info .place {
        font-size: 20px;
        font-weight: bold;
        margin-top: 10px;
    }

    .header .info .relative-time {
        font-size: 16px;
        margin-bottom: 5px;
    }

    .header .date {
        height: 80px;
        width: 80px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.6);
        margin-right: 10px;

        display: flex;
        flex-direction: column;

        overflow: hidden;
        text-align: center;

        backdrop-filter: blur(10px);
        -moz-backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .header .date .mounth {
        line-height: 25px;
        font-size: 16px;
        background: #ed4949;
        font-weight: bold;
        color: #f4d7d7;

    }

    .header .date .day {
        height: 30px;

        font-size: 30px;
        line-height: 33px;
        font-weight: 300;
    }

    .header .date .hour {
        line-height: 25px;
        font-size: 16px;

        background: rgba(0,0,0,0.05);
    }

    .name {
        font-family: var(--title-fonts);
        width: 100%;
        font-size: 23px;

        margin: 10px;

        margin: 0;
        height: 50px;
    }
    
    :host(.big-title) .name {
        font-size: 40px;
        height: 50px;
        padding: 10px 5vw;
    }

    .name .resizer {
        display: flex;
        flex-direction: column
        justify-content: flex-start;
        align-items: center;
    }

    </style>
    <bde-card class="event">
        <div class="banner"><img id="banner"></div>

        <div class="header">
            <div class="date">
                <div class="mounth" id="mounth">...</div>
                <div class="day" id="day">..</div>
                <div class="hour" id="hour">..:..</div>
            </div>
            <div class="info">
                <div class="relative-time"><slot name="relative-time"></slot></div>
                <div class="place" id="place"><slot name="location"></slot></div>
            </div>
        </div>

        <h3 class="name"><bde-autoresize id="name" class="resizer"></bde-autoresize></h3>

        <div class="body">
            <slot name="body"></slot>
        </div>

        <div class="commission">
            <slot name="commission"></slot>
        </div>
    </bde-card>
    `

    customElements.define("bde-event-card",class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
        }

        connectedCallback(){
            requestAnimationFrame(() => {
                if(this.classList.contains("static")){
                    this.root.querySelector("bde-card").classList.add("static")
                }
            })
        }

        get eventName() {
            return this.$eventName
        }

        set eventName(val) {
            this.$eventName = val
            this.root.getElementById("name").innerHTML = this.$eventName
        }

        get bannerSrc() {
            return this.$bannerSrc
        }

        set bannerSrc(val) {
            this.$bannerSrc = val
            this.root.getElementById("banner").src = this.$bannerSrc
        }

        get eventStart() {
            return this.$eventStart
        }

        set eventStart(val) {
            this.$eventStart = val
            this.root.getElementById("mounth").innerHTML = MOUNTHS[this.$eventStart.getMonth()]
            this.root.getElementById("day").innerHTML = this.$eventStart.getDate()

            let date = `${('0' + this.$eventStart.getHours()).slice(-2)}h`

            if(this.$eventStart.getMinutes() > 0){
                date += ('0' + this.$eventStart.getMinutes()).slice(-2)
            }

            this.root.getElementById("hour").innerHTML = date
        }

        get eventEnd() {
            return this.$eventEnd
        }

        set eventEnd(val) {
            this.$eventEnd = val
        }

        static get observedAttributes(){
            return ['banner-src', 'event-name', 'event-start', 'event-end']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'banner-src':
                    this.bannerSrc = newval
                    break;
                case 'event-name':
                    this.eventName = newval
                    break;
                case 'event-start':
                    this.eventStart = new Date(Date.parse(newval))
                    break;
                case 'event-end':
                    this.eventEnd = new Date(Date.parse(newval))
                    break;
            }
        }

    })

})()