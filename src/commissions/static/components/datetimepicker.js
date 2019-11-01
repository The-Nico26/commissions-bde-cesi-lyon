(() => {

    const MOUNTHS = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre"
    ]

    const PRESET_TIMES = [
        "00:00",
        "04:00",
        "06:00",
        "08:00",
        "10:00",
        "12:00",
        "13:00",
        "13:30",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00"
    ]

    function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function toFrWeek(day) {
        let newDay = day - 1
        if(newDay < 0){
            newDay = 7 + newDay
        }
        return newDay
    }

    const TEMPLATE = `
    <style>
    
    :host {
        display: block;
        width: 100%;
    }
    
    .fields {
        display: flex;
        justify-content: stretch;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .fields ::slotted(*) {
        flex: 1;
    }
    
    .content {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
    }
    
    @media screen and (max-width: 800px) {
        .fields {
            flex-direction: column;
        }
        
        .fields ::slotted(*) {
            width: 100%;
        }
    }

    .content {
        background: rgb(245, 245, 245);
        border-radius: 0 0 5px 5px;
        padding: 15px;
    }
    
    @media screen and (max-width: 800px) {
        .content {
            padding: 0;
        }
    }
    
    .calendar {
        width: 100%;
        max-width: 300px;
        padding: 10px;
    }
    
    .calendar .header {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        margin-bottom: 10px;
    }
    
    .calendar .header bde-icon {
        height: 25px;
    }
    
    .calendar .header button {
        border: none;
        background: none;
        cursor: pointer;
        padding: 10px;
        display: block;
    }
    
    
    .calendar .description {
        text-align: center;
        font-size: 20px;
        flex: 1;
    }
    
    .calendar .weeks table {
        width: 100%;
        text-align: center;
        table-layout: fixed;
    }
    
    .weeks td {
        height: 35px;
    }
    
    .days td:not(.empty) {
        background: white;
        cursor: pointer;
    }
    
    .time-presets {
        width: 200px;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    
    .time-presets > * {
        margin: 1px;
        padding: 9px;
        width: 64px;
        border: none;
        background: white;
        cursor: pointer;
        display: block;
    }
    
    .days td.current, .time-presets > .current {
        background: var(--primary-color);
        color: var(--on-primary-color);
        border-radius: 5px;
    }
    
    </style>
    <div class="fields">
        <slot></slot>
    </div>
    <div class="content">
        
        <div class="calendar">
            <div class="header">
                <button id="prev-month">
                    <bde-icon icon="mdi-chevron-left"></bde-icon>
                </button>
                <span class="description" id="description">###</span>
                <button id="next-month">
                    <bde-icon icon="mdi-chevron-right"></bde-icon>
                </button>
            </div>
            <div class="weeks">
                <table>
                    <tr>
                        <td>L</td>
                        <td>M</td>
                        <td>M</td>
                        <td>J</td>
                        <td>V</td>
                        <td>S</td>
                        <td>D</td>
                    </tr>
                </table>
                <table class="days" id="days">
                </table>
            </div>
        </div>
        <div class="time-presets" id="time-presets">
                
        </div>
        
    </div>
    `

    customElements.define("bde-datetimepicker",class extends HTMLElement {

        constructor(){
            super()
            this.root = this.attachShadow({mode: 'open'})
            let template = document.createElement("template")
            template.innerHTML = TEMPLATE
            this.root.appendChild(template.content.cloneNode(true))
            this.timePresets = this.root.getElementById("time-presets")
        }

        connectedCallback(){
            requestAnimationFrame(() => {
                this.fieldEls = Array.from(this.querySelectorAll("input[type=\"text\"]"))
                this.dateField = this.fieldEls[0]
                this.timeField = this.fieldEls[1]

                this.dateField.classList.add("centering")
                this.timeField.classList.add("centering")
                this.dateField.classList.add("big")
                this.timeField.classList.add("big")

                this.loadDateTimeField()
                if(!this.selectedDate)
                    this.selectedDate = new Date()

                this.root.getElementById("days").addEventListener("click", e => {
                    e.preventDefault()
                    this.selectDate(e.originalTarget)
                })

                this.timePresets.addEventListener("click", e => {
                    e.preventDefault()
                    this.selectPreset(e.originalTarget)
                })

                this.root.getElementById("prev-month").addEventListener("click", e => {
                    e.preventDefault()
                    this.displayMonth(-1)
                })

                this.root.getElementById("next-month").addEventListener("click", e => {
                    e.preventDefault()
                    this.displayMonth(+1)
                })

                this.dateField.addEventListener("change", () => this.loadDateTimeField())
                this.timeField.addEventListener("change", () => this.loadDateTimeField())

                PRESET_TIMES.forEach(el => {
                    this.createTimePreset(el)
                })
            })
        }

        loadDateTimeField(){
            let dateComp = this.dateField.value.split("/").map(el => parseInt(el))
            let timeComp = this.timeField.value.split(":").map(el => parseInt(el))

            dateComp = dateComp.concat([0,0,0])
            timeComp = timeComp.concat([0,0])

            this.selectedDate = new Date(
                    dateComp[2],
                    dateComp[1]-1,
                    dateComp[0],
                    timeComp[0],
                    timeComp[1]
                )
        }

        updateSelectedDate(currentDate,previousDate, displayDate=currentDate){

            this.dateField.value = `${pad(currentDate.getDate(),2)}/${pad(currentDate.getMonth()+1,2)}/${currentDate.getFullYear()}`
            this.timeField.value = `${pad(currentDate.getHours(),2)}:${pad(currentDate.getMinutes(),2)}`


            this.root.getElementById("description").innerHTML =
                MOUNTHS[displayDate.getMonth()] + " " + displayDate.getFullYear()
            this.renderMonth(displayDate)

            if(previousDate) {
                let lastDay = this.root.getElementById(`day-cell-${previousDate.getDate()}`)
                if(lastDay) {
                    lastDay.classList.remove("current")
                }
            }

            let currentDay = this.root.getElementById(`day-cell-${currentDate.getDate()}`)
            if(currentDay && displayDate.getMonth() == currentDate.getMonth()) {
                currentDay.classList.add("current")
            }

            let preset = Array.from(this.timePresets.children).find(el => el.dataset.value === this.timeField.value )

            Array.from(this.timePresets.children).forEach(el => el.classList.remove("current"))

            if(!preset){
                preset = this.createTimePreset(this.timeField.value,true)
            }

            preset.classList.add("current")

        }

        renderMonth(date){
            let weeks = this.root.getElementById("days")
            weeks.innerHTML = ""

            let dte = new Date(date)
            let mnt = dte.getMonth()
            dte.setDate(1)

            let currentRow = document.createElement("tr")
            for(let i = 0; i < toFrWeek(dte.getDay()); i++){
                let currentCell = document.createElement("td")
                currentCell.classList.add("empty")
                currentRow.appendChild(currentCell)
            }

            while (dte.getMonth() == mnt){

                if(toFrWeek(dte.getDay()) == 0){
                    weeks.appendChild(currentRow)
                    currentRow = document.createElement("tr")
                }

                let currentCell = document.createElement("td")
                currentCell.innerHTML = dte.getDate()
                currentCell.id = `day-cell-${dte.getDate()}`
                currentCell.dataset.date = dte.toJSON()
                currentRow.appendChild(currentCell)

                dte.setDate(dte.getDate() + 1)
            }

            weeks.appendChild(currentRow)
        }

        selectDate(target){
            if(target.dataset.date){
                this.selectedDate = new Date(Date.parse(target.dataset.date))
            }
        }

        get selectedDate() {
            return this.$selectedDate
        }

        set selectedDate(date) {
            this.updateSelectedDate(date,this.$selectedDate,date)
            this.$selectedDate = date
        }

        get displayedDate() {
            return this.$displayedDate ? this.$displayedDate : this.selectedDate
        }

        set displayedDate(date) {
            this.updateSelectedDate(this.$selectedDate,this.$selectedDate,date)
            this.$displayedDate = date
        }

        static get observedAttributes(){
            return ['selected-date']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'selected-date':
                    this.selectedDate = new Date(Date.parse(newval))
                    break;
            }
        }

        createTimePreset(value, isCustom=false) {
            let element = document.createElement("button")
            element.classList.add("time-preset")
            element.dataset.value = value
            element.innerHTML = value
            return this.timePresets.appendChild(element)
        }

        selectPreset(target) {
            if(!target.dataset.value) return

            let values = target.dataset.value.split(":").map(el => parseInt(el))

            let newDate = new Date(this.selectedDate)
            newDate.setHours(values[0])
            newDate.setMinutes(values[1])
            this.selectedDate = newDate
            return newDate
        }

        displayMonth(amount) {
            let newDate = new Date(this.displayedDate)
            newDate.setMonth(newDate.getMonth() + amount)
            this.displayedDate = newDate
            return newDate
        }
    })

})()