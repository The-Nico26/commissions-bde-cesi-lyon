(() => {

    let progressionElements = []
    let sections = []
    let nextButton = null;

    function initForm(){

        nextButton = document.getElementById("next-button")
        progressionElements = Array.from(document.getElementById("progression").querySelectorAll("*[data-referer]"))
        sections = progressionElements.map((el,i) => ({
            sectionName: el.getAttribute("data-referer"),
            sectionEl: document.getElementById(el.getAttribute("data-referer")),
            progressionEl: el,
            index: i
        })).filter(el => !!el.sectionEl)

        document.addEventListener("scroll", scrollSpy)
        scrollSpy()

        nextButton.addEventListener("click",e => {
            e.preventDefault()
            goToNext()
        })

        sections.forEach(el => {
            el.progressionEl.addEventListener("click", e => {
                e.preventDefault()
                goTo(el.sectionName)
            })
        })
    }

    function getCurrentSection() {

        let currentSection = null;
        for(let section of sections){
            if(document.documentElement.scrollTop + (window.innerHeight/2) > section.sectionEl.offsetTop) {
                currentSection = section
            } else { break; }
        }
        return currentSection;
    }

    function scrollSpy(){
        let currentSection = getCurrentSection()
        if(currentSection){
            sections.forEach(el => el.progressionEl.classList.remove("active"))
            currentSection.progressionEl.classList.add("active")

            if(currentSection.progressionEl.hasAttribute("data-next-rainbow")){
                nextButton.classList.add("btn-rainbow")
            } else {
                nextButton.classList.remove("btn-rainbow")
            }

            if(currentSection.progressionEl.hasAttribute("data-next-name")){
                nextButton.children[0].innerHTML = currentSection.progressionEl.getAttribute("data-next-name")
            } else {
                nextButton.children[0].innerHTML = "Suivant"
            }
        }
    }

    function goToNext(){
        let current = getCurrentSection()

        if(!current)
            return

        if(current.index < sections.length - 1){
            goTo(sections[current.index + 1].sectionName)
        } else {
            document.getElementById("com-form").submit()
        }
    }

    function goTo(sectionName){
        let section = sections.find(el => el.sectionName == sectionName)
        if(!section)
            return;

        let top = Math.round(Math.max(0,section.sectionEl.offsetTop - 70));

        let interval = setInterval(() => {
            if(document.documentElement.scrollTop == top){
                document.documentElement.scrollTo(0, top)
                clearAll()
            }

            let nextScroll = 0;

            if(document.documentElement.scrollTop < section.sectionEl.offsetTop){
                nextScroll = Math.min(document.documentElement.scrollTop + 100,top)
            } else {
                nextScroll = Math.max(document.documentElement.scrollTop - 100,top)
            }

            document.documentElement.scrollTo(0, nextScroll)
        },10)

        let timeout = setTimeout(() => {
            clearAll()
        },2000)

        function clearAll(){
            clearTimeout(timeout)
            clearInterval(interval)
        }

    }

    document.addEventListener("DOMContentLoaded",initForm);

})()