async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

export function renderWithTemplate(
    template,
    parentElement,
    data,
    callback) {
    parentElement.insertAdjacentHTML("afterbegin", template);
    if (callback){
        callback(data);
    }
}
  
export function renderListWithTemplate(
    templateFn,
    parentElement,
    list,
    position = "afterbegin",
    clear = false
  ) {
    const htmlStrings = list.map(templateFn);
    // if clear is true we need to clear out the contents of the parent.
    if (clear === "true") {
      parentElement.innerHTML = "";
    }
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function loadHeaderFooter(){
const headerTemplate = await loadTemplate("partials/header.html");
const footerTemplate = await loadTemplate("partials/footer.html");

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

export function formRating(){
  document.getElementById("ratings").addEventListener("submit", function(event) {
    event.preventDefault();
    const activityName = document.getElementById("activities").value;
    localStorage.setItem("activityName", activityName);
    const note = document.getElementById("note").value;
    localStorage.setItem("note", note);
    window.location.href = "rating.html";
});
}