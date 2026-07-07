let performances = [];

const grid = document.getElementById("performance-grid");
const buttons = document.querySelectorAll(".filter-btn");
const yearFilter = document.getElementById("yearFilter");
const searchInput = document.getElementById("searchPerformance");
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

    const keyword = searchInput.value.toLowerCase().trim();

    if (keyword) {
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(keyword) ||
            item.description.toLowerCase().includes(keyword) ||
            item.category.toLowerCase().includes(keyword) ||
            item.type.toLowerCase().includes(keyword) ||
            item.year.toLowerCase().includes(keyword)
        );
    }

    filtered.sort((a, b) => {
        return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
    });

    counter.textContent = `${filtered.length} Archived Performance${filtered.length !== 1 ? "s" : ""}`;

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
searchInput.addEventListener("input", displayPerformances);

loadPerformances();