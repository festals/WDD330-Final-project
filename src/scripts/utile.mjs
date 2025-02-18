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

// Function to check if the activity is open based on hours
export const checkIfOpen = (hours) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;  // Convert current time to minutes

  // Assuming hours are in format '09:00-17:00'
  const [openingTime, closingTime] = hours.split('-');
  
  const [openHour, openMinute] = openingTime.split(':').map(Number);
  const [closeHour, closeMinute] = closingTime.split(':').map(Number);

  const openingTimeInMinutes = openHour * 60 + openMinute;  // Convert opening time to minutes
  const closingTimeInMinutes = closeHour * 60 + closeMinute;  // Convert closing time to minutes

  return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes <= closingTimeInMinutes;
};

// Function to check if the wind conditions are strong enough for the activity
export const isWindStrongEnough = (activityName, windSpeed, windDeg) => {
  if (activityName === "Ozone") {
      const minWindSpeed = 3.06;  // wind speed required for "Ozone" activity in km/h
      const maxWindSpeed = 15;
      const favorableWindDirection = 165;  

      // Check if wind speed is above the minimum threshold
      const isWindSpeedGood = windSpeed >= minWindSpeed && windSpeed <= maxWindSpeed ;

      // Check if the wind is coming from a favorable direction (within 30 degrees of the favorable direction)
      const isWindDirectionGood = Math.abs(windDeg - favorableWindDirection) <= 30;

      return isWindSpeedGood && isWindDirectionGood;
  }
  return true;
};

