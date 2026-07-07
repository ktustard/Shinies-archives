const grid = document.getElementById("performance-grid");
const buttons = document.querySelectorAll(".filter-btn");

let performances = [];

async function loadPerformances() {
    const response = await fetch("../data/performances.json");
    performances = await response.json();

    displayPerformances("all");
}

function displayPerformances(filter) {
    grid.innerHTML = "";

    const filtered = filter === "all"
        ? performances
        : performances.filter(item => item.category === filter);

    filtered.forEach(item => {
        const card = document.createElement("article");
        card.classList.add("performance-card");

        card.innerHTML = `
            <span>${item.category}</span>
            <h3>${item.title}</h3>
            <p class="performance-meta">${item.year} • ${item.type}</p>
            <p>${item.description}</p>
        `;

        grid.appendChild(card);
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        displayPerformances(button.dataset.filter);
    });
});

loadPerformances();