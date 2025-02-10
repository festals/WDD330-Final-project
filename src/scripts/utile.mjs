async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}
  
export async function loadHeaderFooter(){
const headerTemplate = await loadTemplate("header.html");
const footerTemplate = await loadTemplate("footer.html");

const header = document.getElementById("mainheader");
const footer = document.getElementById("mainfooter");

renderWithTemplate(headerTemplate,header);
renderWithTemplate(footerTemplate,footer);
}

export function getDates(){
const dateContainer = document.querySelector("#currentyear");
const lastModifiedContainer = document.getElementById("lastModified");
const today = new Date()
const year = today.getFullYear()
const lastModified = document.lastModified

dateContainer.innerHTML=year;
lastModifiedContainer.innerHTML= lastModified;
}
