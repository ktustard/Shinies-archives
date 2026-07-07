let achievements = [];

const achievementGrid = document.getElementById("achievement-grid");
const achievementButtons = document.querySelectorAll(".achievement-filter");
const achievementYearFilter = document.getElementById("achievementYearFilter");
const achievementCounter = document.getElementById("achievement-counter");

let currentAchievementFilter = "all";

async function loadAchievements(){
    const response = await fetch("data/achievements.json");
    achievements = await response.json();
    displayAchievements();
}

function displayAchievements(){
    achievementGrid.innerHTML = "";

    let filtered = [...achievements];

    if(currentAchievementFilter !== "all"){
        filtered = filtered.filter(item => item.type === currentAchievementFilter);
    }

    if(achievementYearFilter.value !== "all"){
        filtered = filtered.filter(item => item.year === achievementYearFilter.value);
    }

    filtered.sort((a,b) => Number(b.year) - Number(a.year));

    filtered.forEach(item => {
        const card = document.createElement("article");
        card.className = "achievement-card";

        card.innerHTML = `
            <span>${item.type}</span>
            <h3>${item.title}</h3>
            <p class="achievement-meta">${item.year} • ${item.category}</p>
            <p>${item.description}</p>
        `;

        achievementGrid.appendChild(card);
    });

    achievementCounter.textContent =
        `Showing ${filtered.length} of ${achievements.length} achievements`;
}

achievementButtons.forEach(button => {
    button.addEventListener("click", () => {
        achievementButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentAchievementFilter = button.dataset.filter;
        displayAchievements();
    });
});

achievementYearFilter.addEventListener("change", displayAchievements);

loadAchievements();