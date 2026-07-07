let performancesData = [];

const grid = document.getElementById("performance-grid");
const buttons = document.querySelectorAll(".filter-btn");

async function loadPerformances() {
    const response = await fetch("../data/performances.json");
    performancesData = await response.json();

    renderPerformances("all");
}

function renderPerformances(filter) {
    grid.innerHTML = "";

    const filtered = filter === "all"
        ? performancesData
        : performancesData.filter(item => item.category === filter);

    filtered.forEach(item => {
        grid.innerHTML += `
            <article class="performance-card">
                <span>${item.category} • ${item.type}</span>
                <h3>${item.title}</h3>
                <strong>${item.year}</strong>
                <p>${item.description}</p>
            </article>
        `;
    });
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        renderPerformances(button.dataset.filter);
    });
});

loadPerformances();