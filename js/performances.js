let performances = [];

const grid = document.getElementById("performance-grid");
const buttons = document.querySelectorAll(".filter-btn");
const yearFilter = document.getElementById("yearFilter");
const counter = document.getElementById("performance-counter");

let currentFilter = "all";

async function loadPerformances() {
    const response = await fetch("../data/performances.json");
    performances = await response.json();
    displayPerformances();
}

function displayPerformances() {
    grid.innerHTML = "";

    let filtered = [...performances];

    if (currentFilter !== "all") {
        filtered = filtered.filter(item => item.category === currentFilter);
    }

    if (yearFilter.value !== "all") {
        filtered = filtered.filter(item => item.year === yearFilter.value);
    }

    filtered.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
    });

    filtered.forEach(item => {
        const card = document.createElement("article");
        card.className = "performance-card";

        card.innerHTML = `
            <span>${item.category}</span>

            <h3>${item.title}</h3>

            <p class="performance-meta">
                ${item.type} • ${item.year}
            </p>

            <p>${item.description}</p>
        `;

        grid.appendChild(card);
    });

    counter.textContent =
        `Showing ${filtered.length} of ${performances.length} performances`;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        displayPerformances();
    });
});

yearFilter.addEventListener("change", displayPerformances);

loadPerformances();