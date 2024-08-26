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
    // Company Info
    let companyName = event.target['company-name'].value;
    let afm = event.target['afm'].value;
    let doy = event.target['doy'].value;
    let gemi = event.target['gemi'].value;
    let protiXrisi = event.target['proti-xrisi'].value;
    let kefalaio = event.target['kefalaio'].value;
    let diaxeiristis = event.target['diaxeiristis'].value;
    let afmDiax = event.target['afm-diax'].value;
    // Contact info
    let address = event.target['address'].value;
    let post = event.target['post'].value;
    let area = event.target['area'].value;
    let tel = event.target['tel'].value;
    let fax = event.target['fax'].value;
    let email = event.target['email'].value;
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
    // Color
    let color = event.target['color'].value;

    // Company Info
    templateHTML = templateHTML.replaceAll("$company-name", companyName)
    .replaceAll("$afm", afm)
    .replaceAll("$doy", doy)
    .replaceAll("$gemi", gemi)
    .replaceAll("$proti-xrisi", protiXrisi)
    .replaceAll("$kefalaio", kefalaio)
    .replaceAll("$diaxeiristis", diaxeiristis)
    .replaceAll("$diax-afm", afmDiax)
    // Contact info
    .replaceAll("$address", address)
    .replaceAll("$post", post)
    .replaceAll("$area", area)
    .replaceAll("$tel", tel)
    .replaceAll("$fax", fax)
    .replaceAll("$email", email)
    .replaceAll("royalblue", color);

    let etairoiFields = "";
    etairoi.forEach((etairos) => {
        etairoiFields += etairosField.replaceAll("$et-name", etairos.name)
        .replaceAll("$et-address", etairos.address)
        .replaceAll("$et-post", etairos.post)
        .replaceAll("$et-area", etairos.area)
        .replaceAll("$et-pososto", etairos.pososto)
        .replaceAll("$et-eisfores", etairos.eisfores)
    }); 

    templateHTML = templateHTML.replace("$etairoi", etairoiFields)

    save('index.html', templateHTML, 'html');
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
const result = document.querySelector(".result");

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
