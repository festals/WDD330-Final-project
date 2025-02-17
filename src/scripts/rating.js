

const activityName = localStorage.getItem("activityName");
const note = localStorage.getItem("note");
if (activityName) {
    document.getElementById("activityName").textContent = `You've now rated "${activityName}" a note of ${note}! Thanks to you, people know what you liked!`;}
