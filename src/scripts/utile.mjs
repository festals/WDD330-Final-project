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
