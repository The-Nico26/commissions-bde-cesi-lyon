// language=HTML
(() => {
    /**
     * @component bde-class-switcher
     *
     * Component permettant d'alterner la présence d'une classe sur un élément cible
     *
     */

    customElements.define("bde-class-switcher", class extends HTMLElement {

        connectedCallback(){
            this.addEventListener("click",() => this.switchClass())
        }

        switchClass(){
            if(!this.targetClass)
                return;
            let targets = []

            if(this.target){
                if(typeof this.target === "string"){
                    targets = Array.from(document.querySelectorAll(this.target))
                } else if(typeof this.target === "object") {
                    targets = this.target
                }
            } else {
                targets = [this]
            }

            targets.forEach(el => {
                if(el.classList.contains(this.targetClass)){
                    el.classList.remove(this.targetClass)
                } else {
                    el.classList.add(this.targetClass)
                }
            })
        }

        get targetClass(){
            return this.$targetClass
        }

        set targetClass(val){
            return this.$targetClass = val
        }

        get target(){
            return this.$target
        }

        set target(val){
            return this.$target = val
        }

        static get observedAttributes(){
            return ['target', 'target-class']
        }

        attributeChangedCallback(name,lastval,newval){
            switch(name){
                case 'target':
                    this.target = newval
                    break;
                case 'target-class':
                    this.targetClass = newval
                    break;
            }
        }

    })

})()