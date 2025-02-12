
const activitiesJSON = "json/activities.json";

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
    activities.forEach(activity => {
        const card = document.createElement("li");
        const activityImg = document.createElement("img")
        const activityName = document.createElement("h3")
        const activityPrice = document.createElement("p")
        const activityHours = document.createElement("p")

        activityImg.setAttribute("src", activity.Images.PrimaryOne);
        activityImg.setAttribute("alt", activity.Name);
        activityImg.setAttribute("loading", "lazy");
        // memoryImg.setAttribute("width", "400");
        // memoryImg.setAttribute("height", "400");
        
    
        activityName.innerHTML = activity.Name;
        activityPrice.innerHTML = activity.Prices;
        activityHours.innerHTML = activity.Hours;

        card.classList.add(activity.activityName);
        card.appendChild(activityName);
        card.appendChild(activityImg);
        card.appendChild(activityPrice);
        card.appendChild(activityHours);

        const activityCard = document.querySelector(".activity-list");
        activityCard.appendChild(card);
    });
}

    

