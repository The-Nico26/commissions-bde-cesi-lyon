// language=HTML
(() => {
    /**
     * @component bde-timeline
     *
     */

    const MONTH = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        'Juin',
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre"
    ]

    const TEMPLATE = `
        <style>
            
            :host {
                display: block;
                width: inherit;
            }

            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            .timeline {
                width: 100%;

                padding-left: 24px;
                padding-top: 12px;
            }

            .timeline-content {
                min-height: 200px;
                border-left: solid 1px rgba(0, 0, 0, 0.2);
            }

            .timeline-segment {
                width: 100%;
                padding-left: 24px;

                padding-bottom: 50px;
            }

            .timeline-segment-title {
                padding-bottom: 50px;
                margin-left: -45px;

                display: flex;
                justify-content: flex-start;
                align-items: center;

                font-family: var(--title-fonts);
                color: rgba(0, 0, 0, 0.3);
            }

            .timeline-segment:first-child .timeline-segment-title {
                padding-top: 0;
                position: relative;
                top: -12px;
                padding-bottom: 38px;
            }

            .timeline-segment-title::before {
                content: "";
                display: block;
                width: 40px;

                margin-right: 15px;

                border-bottom: solid 1px rgba(0, 0, 0, 0.3);
                background: white;
            }

            .timeline-end {
                padding-left: 24px;
                color: rgba(0, 0, 0, 0.2);
                font-style: italic;
                font-size: 12px;
            }

            .timeline-end::before {
                content: "";
                display: block;
                height: 0;
                width: 0;
                border-top: 15px solid rgba(0, 0, 0, 0.2);
                border-right: 12px solid transparent;
                border-left: 13px solid transparent;

                margin-left: -36px;
                margin-bottom: 10px;
            }

            .timeline-segment-content {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
            }
            
            
            .timeline-segment-content ::slotted(*) {
                margin: 10px 10px 10px 0 !important;
            }
            
            @media screen and (max-width: 800px) {

                .timeline, .timeline-segment {
                    padding-left: 0;
                }
                
                .timeline-content {
                    border: none;
                }
                
                .timeline-end::before {
                    display: none;
                }
                
                .timeline-end {
                    text-align: center;
                }
            
            }
            
        </style>
        <template id="segment-template">
            <div class="timeline-segment">
                <h2 class="timeline-segment-title">###</h2>
                <div class="timeline-segment-content">
                    <slot namd="template-slot"></slot>
                </div>
            </div>
        </template>
        <div class="timeline">
            <div class="timeline-content" id="content">
            </div>
            <div class="timeline-end">
                <slot name="end-toolbar">L'histoire ne demande qu'à être écrite</slot>
            </div>
        </div>
    `

    customElements.define("bde-timeline", class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
            this.segmenttemplate = this.root.getElementById("segment-template")
            this.content = this.root.getElementById("content")
        }

        connectedCallback(){

            requestAnimationFrame(() => {
                this.renderTimeline()
            })
        }

        mutateTimeline(mutations){
            mutations.forEach(mutation => {
                console.log("mutation",mutation)
            })
        }

        addElement(element){

            if(!element.hasAttribute("timeline-date") || element.hasAttribute("slot"))
                return

            let eventDate = new Date(Date.parse(element.getAttribute("timeline-date")))

            if(isNaN(eventDate.getTime()))
                return

            let segmentSlot = this.getSlot(eventDate)

            let slotName = segmentSlot.querySelector("slot").name

            element.slot = slotName
        }

        renderTimeline(){

            this.content.innerHTML = ""

            let timeElements = Array.from(this.children)
                .filter(el => el.hasAttribute("timeline-date") && !el.hasAttribute("slot"))

            let sortedElements = timeElements.sort((a, b) => Date.parse(b.getAttribute("timeline-date")) - Date.parse(a.getAttribute("timeline-date")))

            sortedElements.forEach( (el, i) => {
                let allChild = Array.from(this.children)
                if(allChild[i] !== el){
                    allChild[i].parentElement.insertBefore(el,allChild[i])
                }
            })

            sortedElements.forEach(el => this.addElement(el))
        }

        getSlot(date){
            let segmentSlot = this.content.querySelector(`#${this.generateSlotName(date,"segment")}`)

            if(!segmentSlot)
                segmentSlot = this.createSegment(date)

            return segmentSlot
        }

        createSegment(date){
            let segment = this.segmenttemplate.content.cloneNode(true)
            segment.querySelector(".timeline-segment-title")
                .innerHTML = `${date.getDate()} ${MONTH[date.getMonth()]} ${date.getFullYear()}`
            segment.querySelector(".timeline-segment").id = this.generateSlotName(date,"segment")
            segment.querySelector("slot").name = this.generateSlotName(date)
            this.content.appendChild(segment)
            return this.content.querySelector(`#${this.generateSlotName(date,"segment")}`)
        }

        generateSlotName(date,prefix="slot"){
            return `${prefix}-${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
        }

    })

})()