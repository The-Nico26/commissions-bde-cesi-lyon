(() => {

    let submitButton = null
    let form = null
    let presidentField = null
    let initialPresidentField = null
    let modal = null
    let modalField = null
    let modalSubmitBtn = null

    function initForm(){
        submitButton = document.getElementById("save-button")
        form = document.getElementById("com-form")

        presidentField = document.getElementById("id_president")
        modal = document.getElementById("president-changed-modal")
        initialPresidentField = modal.getAttribute("data-initialpresident")

        modalField = document.getElementById("validation-form")
        modalField.addEventListener("change", modalCheckName)
        modalField.addEventListener("keyup", modalCheckName)
        modalSubmitBtn = document.getElementById("modal-submit")
        modalSubmitBtn.addEventListener("click", modalSubmit)
        document.getElementById("modal-cancel").addEventListener("click", () => resetPresident())

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
        if(presidentField.value != initialPresidentField){
            modal.querySelector("#new-president").innerHTML = presidentField.options[presidentField.selectedIndex].getAttribute("data-name")
            modal.open()
        } else {
            form.submit()
        }
    }

    function modalCheckName(){
        let text = document.getElementById("commission-name").innerHTML.toLowerCase()
        if(modalField.value.toLowerCase() == text){
            modalSubmitBtn.disabled = false
        } else {
            modalSubmitBtn.disabled = true
        }
    }

    function resetPresident(){
        presidentField.value = initialPresidentField
        presidentField.dispatchEvent(new Event("change"))
        modal.close()
    }

    function modalSubmit(event){
        if(event.target.disabled)
            return
        form.submit()
    }

    function enableSave(e){
        if(submitButton.disabled)
            submitButton.parentElement.pulse()
        submitButton.disabled = false
    }

    document.addEventListener("DOMContentLoaded",initForm);

})()