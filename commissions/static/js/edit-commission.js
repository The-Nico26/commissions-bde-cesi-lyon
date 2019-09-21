(() => {

    let submitButton = null
    let form = null

    function initForm(){
        submitButton = document.getElementById("save-button")
        form = document.getElementById("com-form")


        submitButton.addEventListener("click", submitForm)
        Array.from(form.querySelectorAll("input, select, textarea"))
            .forEach(el => {
                el.addEventListener("change", enableSave)
                el.addEventListener("keyup", enableSave)
            })

    }

    function submitForm(event){
        if(event.target.disabled)
            return
        form.submit()
    }

    function enableSave(){
        console.log("Enabled")
        if(submitButton.disabled)
            submitButton.parentElement.pulse()
        submitButton.disabled = false
    }

    document.addEventListener("DOMContentLoaded",initForm);

})()