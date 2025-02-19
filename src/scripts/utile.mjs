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

export const getTideData = async () => {
  const url = `https://www.worldtides.info/api/v3?heights&extremes&date=2025-02-19&lat=50.32&lon=1.54&key=c0c99155-b461-42cd-a3e9-31b74a758e2d`;


  try {
    const response = await fetch(url);
    const data = await response.json();

    // If tide data exists, process the tides for today
    if (data.heights && data.heights.length > 0) {
        // Find the closest tide data point to the current time
        const now = Date.now();  // Get the current time in milliseconds

        // Sort the tides by time (ascending)
        data.heights.sort((a, b) => a.dt - b.dt);

        // Find the closest tide (before or after the current time)
        let closestTide = null;
        let tideStatus = "Unknown";
        let previousTideHeight = null;

        for (let i = 0; i < data.heights.length; i++) {
            const tide = data.heights[i];
            const tideTime = new Date(tide.dt * 1000);  // Convert UNIX timestamp to date

            // Find the closest tide time
            if (tideTime > now) {
                closestTide = tide;
                break;
            }
            previousTideHeight = tide.height;
        }

        // If no tide after the current time, use the last tide (before the current time)
        if (!closestTide && previousTideHeight) {
            closestTide = data.heights[data.heights.length - 1];  // Use the last tide for the day
        }

        // Determine if the tide is ascending, descending or constant
        if (closestTide && previousTideHeight !== null) {
            const tideHeight = closestTide.height;  // Get the tide height
            if (tideHeight > previousTideHeight) {
                tideStatus = "Ascending (Rising)";
            } else if (tideHeight < previousTideHeight) {
                tideStatus = "Descending (Falling)";
            } else {
                tideStatus = "Constant";
            }

            const tideTime = new Date(closestTide.dt * 1000);  // Convert UNIX timestamp to date
            const tideTimeFormatted = tideTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });  // Get only the time in HH:MM format

            return `
                <p>Tide Time: ${tideTimeFormatted}<br>
                Height: ${closestTide.height} meters<br>
                Status: ${tideStatus}</p>
            `;
        } else {
            return "No tide data available for current time.";
        }
    } else {
        return "Error fetching tide data.";
    }
  } catch (error) {
    console.error("Error fetching tide data:", error);
    return "Error fetching tide data";
  }
};

