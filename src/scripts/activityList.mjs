import { checkIfOpen, isWindStrongEnough } from "./utile.mjs";

const urlWeather = "https://api.openweathermap.org/data/2.5/weather?lat=50.32&lon=1.54&units=metric&appid=37c35753f34f3a37825f8d6a42ba3c16";
const activitiesJSON = "json/activities.json";

// Function to fetch weather data
async function apiFetch(urlWeather, activity) {
    try {
        const response = await fetch(urlWeather);
        if (response.ok) {
            const data = await response.json();
            
            // Assuming wind data is in the format data.wind.speed and data.wind.deg
            const windSpeed = data.wind.speed;
            const windDeg = data.wind.deg;
  
            // Check if the wind conditions are strong enough for the activity
            const isWindGoodForActivity = isWindStrongEnough(activity.Name, windSpeed, windDeg);
  
            // Proceed to display the activity info with wind status
            displayActivityInfo(activity, isWindGoodForActivity); // Pass the wind status to the display function
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
      console.log(error);
    }
  }

export async function getActivitiesInfo() {
    try {
        const response = await fetch(activitiesJSON);
        if (response.ok) {
            const data = await response.json();
            displayActivity(data.activities);    
        } else {
            throw Error(await response.text())
        }
    } catch (error) {
        console.log(error);
    };
};

const displayActivity = (activities) => {
    // Group activities by category
    const categorizedActivities = activities.reduce((categories, activity) => {
        if (!categories[activity.category]) {
            categories[activity.category] = []; // Create a new array for this category
        }
        categories[activity.category].push(activity); // Add activity to the appropriate category
        return categories;
    }, {});

    const activityContainer = document.querySelector(".activity-list");

    const iframeSources = {
        "Art": "https://www.google.com/maps/d/embed?mid=1IEQHSIxdND1cOHOovTb0crErCnOTq9E&ehbc=2E312F&noprof=1", // iframe for sport section
        "Restaurant": "https://www.google.com/maps/d/embed?mid=1h_CUYdx1oWkTe8qW_GhNzr-XTaoaxKs&ehbc=2E312F&noprof=1", // iframe for restaurant section
        "Shopping": "https://www.google.com/maps/d/embed?mid=1rUsXcpvgpISxyW507aylGJjKfkUze-E&ehbc=2E312F&noprof=1", // iframe for shopping section
        "Sport": "https://www.google.com/maps/d/embed?mid=1hsE3mmrhJiN4wXuE_BWCBWeR6DN2jeY&ehbc=2E312F&noprof=1" // iframe for art section
    };

    // Loop through each category and display the activities
    for (const category in categorizedActivities) {
        // Create a section for each category
        const categorySection = document.createElement("section");
        categorySection.setAttribute("id", category); // Assign the category as the ID for anchor linking 
        categorySection.setAttribute("class", "category-section");

        // Create a category title
        const categoryTitle = document.createElement("h2");
        categoryTitle.textContent = category; // Set category name as title
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1); 
        categorySection.appendChild(categoryTitle);

        // Create an unordered list for the activities
        const activityList = document.createElement("ul");
        categorySection.appendChild(activityList);

        // Loop through activities in this category
        categorizedActivities[category].forEach(activity => {
            const card = document.createElement("li");
            const activityImg = document.createElement("img");
            const activityName = document.createElement("h3");
            const activityPrice = document.createElement("p");
            const activityHours = document.createElement("p");

            card.setAttribute("class", "activity-card");

            activityImg.setAttribute("src", activity.Images.PrimaryOne);
            activityImg.setAttribute("alt", activity.Name);
            activityImg.setAttribute("loading", "lazy");
            activityImg.setAttribute("width", "200");
            activityImg.setAttribute("height", "133");

            activityName.textContent = activity.Name;
            activityPrice.textContent = activity.Prices;
            activityHours.textContent = activity.Hours;

            // Event listener for opening modal when image is clicked
            activityImg.addEventListener("click", () => {
                displayActivityInfo(activity);
            });

            card.classList.add(activity.activityName);
            card.appendChild(activityName);
            card.appendChild(activityImg);
            card.appendChild(activityPrice);
            card.appendChild(activityHours);

            activityList.appendChild(card);
        });

        // Add iframe at the end of each section (not card)
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", iframeSources[category]); // Get the iframe source for this section
        iframe.setAttribute("width", "600");
        iframe.setAttribute("height", "400");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "");

        categorySection.appendChild(iframe);

        // Append the category section to the main container
        activityContainer.appendChild(categorySection);
    }
};


const displayActivityInfo = (activity, isWindGoodForActivity) => {
    const modal = document.getElementById("activity-info");

    // Collect all the images into an array
    const images = [
    activity.Images.PrimaryOne,
    activity.Images.PrimaryTwo,
    activity.Images.PrimaryThree,
    activity.Images.PrimaryFour
    ];

    let imageHtml = '';
    images.forEach((img, index) => {
        imageHtml += `<img src="${img}" class="slideshow-image" style="display: ${index === 0 ? 'block' : 'none'}" width="400">`;
    });

    // Determine if the activity is open or closed
    const isOpen = checkIfOpen(activity.Hours);
    
    // If the activity is "Ozone", display if the wind conditions are good
    const windStatus = activity.Name === "Ozone" ? (isWindGoodForActivity ? "Wind conditions are suitable" : "Wind conditions are not suitable") : "";

    modal.innerHTML = `
    <button id="closeModal">X</button>
    <h2>${activity.Name}</h2>
    <div id="slideshow">
        ${imageHtml}
    </div> 

    <p class="open"> ${isOpen ? 'Open' : 'Closed'}</p>
    ${activity.Name === "Ozone" ? `<p class="open">Wind Status: ${windStatus}</p>` : ''}
    <p>Hours: ${activity.Hours}<br>
    Prices: ${activity.Prices}<br>
    Phone: ${activity.Phone}<br>
    Adress: ${activity.Adress}<br>
    Mail: ${activity.Mail}<br>
    Children Friendly: ${activity.Children}<br>
    Description: ${activity.Description}</p>
    `;

    // <!-- Display Reviews and Rating -->
    // <p>Number of Reviews: ${reviews}</p>
    // <p>Rating: ${rating}</p>



    modal.showModal();

    // Slideshow logic
    let currentImageIndex = 0;
    const imagesArray = document.querySelectorAll('.slideshow-image');
    const totalImages = imagesArray.length;

    const changeImage = () => {
        imagesArray[currentImageIndex].style.display = 'none';
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        imagesArray[currentImageIndex].style.display = 'block';
    };

    setInterval(changeImage, 2000);  // Change image every 3 seconds

    // Close the modal when the user clicks on the close button
    const closeModal = document.getElementById("closeModal");
    closeModal.addEventListener("click", () => {
        modal.close();
    });

    // Close the modal when the user clicks anywhere outside the modal content
    window.addEventListener("click", (event) => {
        const modal = document.getElementById("activity-info");
        if (event.target === modal) {
            modal.close();
        }
    });
}


// rating into the details info
