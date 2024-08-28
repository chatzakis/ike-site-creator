let templateHTML = "";
let etairoiForm = "";
let etairosField = "";

// Load templates
async function loadHtmlFile() {
    try {

        const template = await fetch('./template.html');
        const form = await fetch('./etairoiForm.html');
        const etairos = await fetch('./etairosField.html');
        
        if (!template.ok || !form.ok || !etairos.ok) {
            throw new Error('Failed to load HTML files');
        }

        templateHTML = await template.text();
        etairoiForm = await form.text();
        etairosField = await etairos.text();
    } catch (error) {
        console.error('Error:', error);
    }
}

loadHtmlFile()

// Handle file creation from form fields
function handleSubmit(event){
    event.preventDefault();

    const data = retrieveFormData(event);
    console.log(data);
    
    if(alertDataError(data)){
        return
    }

    addDataToTemplate(data);

    save('index.html', templateHTML, 'html');
}

function retrieveFormData(event){
    // Etairoi
    let etairoiCount = Number(event.target['etairoi'].value);
    let etairoi = [];
    for (let i = 0; i < etairoiCount; i++){        
        etairoi.push({
            name: event.target[`et${i+1}-name`].value,
            address: event.target[`et${i+1}-address`].value,
            post: event.target[`et${i+1}-post`].value,
            area: event.target[`et${i+1}-area`].value,
            pososto: event.target[`et${i+1}-pososto`].value,
            eisfores: event.target[`et${i+1}-eisfores`].value
        });
    }

    const data = {
        companyName : event.target['company-name'].value,
        afm : event.target['afm'].value,
        doy : event.target['doy'].value,
        gemi : event.target['gemi'].value,
        protiXrisi : event.target['proti-xrisi'].value,
        kefalaio : event.target['kefalaio'].value,
        diaxeiristis : event.target['diaxeiristis'].value,
        afmDiax : event.target['afm-diax'].value,
        // Contact info
        address : event.target['address'].value,
        post : event.target['post'].value,
        area : event.target['area'].value,
        tel : event.target['tel'].value,
        fax : event.target['fax'].value,
        email : event.target['email'].value,
        // Etairoi
        etairoi: etairoi,
        // Color
        color: event.target['color'].value
    }

    return data;
}

function alertDataError(data){
    let errorExists = false;
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerHTML = "";

    if (! /^\d{9}$/.test(data.afm)){
        errorMsg.innerHTML += 'Το ΑΦΜ πρέπει να έχει 9 ψηφία.<br>';
        errorExists = true;
    }
    if (! /^\d{9}$/.test(data.afmDiax)){
        errorMsg.innerHTML += 'Το ΑΦΜ διαχειριστή πρέπει να έχει 9 ψηφία.<br>';
        errorExists = true;
    }
    if (! /^\d{12}$/.test(data.gemi)){
        errorMsg.innerHTML += 'Ο αριθμός ΓΕΜΗ πρέπει να έχει 12 ψηφία.<br>';
        errorExists = true;
    }
    if (! /^\d{10,14}$/.test(data.tel)){
        errorMsg.innerHTML += 'Ο αριθμός τηλεφώνου πρέπει να έχει 10 ψηφία ή 14 με το πρόθεμα (0030).<br>';
        errorExists = true;
    }
    if (! /^\d{5}$/.test(data.post)){
        errorMsg.innerHTML += 'O ταχυδρομικός κώδικας πρέπει να έχει 5 ψηφία.<br>';
        errorExists = true;
    }
    return errorExists
}

function addDataToTemplate(data){
    // Company Info
    templateHTML = templateHTML.replaceAll("$company-name", data.companyName)
    .replaceAll("$afm", data.afm)
    .replaceAll("$doy", data.doy)
    .replaceAll("$gemi", data.gemi)
    .replaceAll("$proti-xrisi", data.protiXrisi)
    .replaceAll("$kefalaio", data.kefalaio)
    .replaceAll("$diaxeiristis", data.diaxeiristis)
    .replaceAll("$diax-afm", data.afmDiax)
    // Contact info
    .replaceAll("$address", data.address)
    .replaceAll("$post", data.post)
    .replaceAll("$area", data.area)
    .replaceAll("$tel", data.tel)
    .replaceAll("$fax", data.fax)
    .replaceAll("$email", data.email)
    .replaceAll("royalblue", data.color);

    let etairoiFields = "";
    data.etairoi.forEach((etairos) => {
        etairoiFields += etairosField.replaceAll("$et-name", etairos.name)
        .replaceAll("$et-address", etairos.address)
        .replaceAll("$et-post", etairos.post)
        .replaceAll("$et-area", etairos.area)
        .replaceAll("$et-pososto", etairos.pososto)
        .replaceAll("$et-eisfores", etairos.eisfores)
    }); 

    templateHTML = templateHTML.replace("$etairoi", etairoiFields)
}

function save(filename, data, fileType) {
    const blob = new Blob([data], {type: fileType});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
}

// Handle dynamic form fields for "etairoi"
const etairoiSelector = document.querySelector("#etairoi");

etairoiSelector.addEventListener("change", (event) => {
    const formContainer = document.querySelector("#etairoi-form");
    formContainer.innerHTML = '';
    let etairoiNum = event.target.value;
    for (let i = 0; i < etairoiNum; i++) {
        let identifier = "et" + (i + 1);
        let etairoiFormInstance =  etairoiForm.replace("$num", i+1).replaceAll("et", identifier);
        formContainer.insertAdjacentHTML('beforeend', etairoiFormInstance);
    } 
});
