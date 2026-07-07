const articlesGrid = document.getElementById("articles-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const yearFilter = document.getElementById("yearFilter");
const sortOrder = document.getElementById("sortOrder");

let articles = [];
let currentCategory = "all";

async function loadArticles() {
    const response = await fetch("../data/articles.json");
    articles = await response.json();
    displayArticles();
}

function getArticleYear(article) {
    const year = article.year || article.date || "";

    const match = String(year).match(/\d{4}/);

    if (match) return match[0];

    return "Unknown";
}

function displayArticles() {
    articlesGrid.innerHTML = "";

    let filtered = [...articles];

    if (currentCategory !== "all") {
        filtered = filtered.filter(article => article.category === currentCategory);
    }

    if (yearFilter && yearFilter.value !== "all") {
        filtered = filtered.filter(article => getArticleYear(article) === yearFilter.value);
    }

    filtered.sort((a, b) => {
        const yearA = getArticleYear(a) === "Unknown" ? 0 : Number(getArticleYear(a));
        const yearB = getArticleYear(b) === "Unknown" ? 0 : Number(getArticleYear(b));

        if (sortOrder && sortOrder.value === "oldest") {
            return yearA - yearB;
        }

        return yearB - yearA;
    });

    filtered.forEach(article => {
        const card = document.createElement("article");
        card.className = "article-card";

        card.innerHTML = `
            <img
                src="${article.image || "../images/articles/article-placeholder.jpg"}"
                alt="${article.title || "Article image"}"
                class="article-image"
                onerror="this.onerror=null; this.src='../images/articles/article-placeholder.jpeg';"
            >

            <div class="article-content">
                <span class="article-source">${article.source || "Unknown Source"}</span>

                <h3>${article.title || "Untitled Article"}</h3>

                <p class="article-meta">
                    ${article.category || "Others"} • ${getArticleYear(article)}
                </p>

                <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                    Read →
                </a>
            </div>
        `;

        articlesGrid.appendChild(card);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentCategory = button.dataset.filter;
        displayArticles();
    });
});

if (yearFilter) {
    yearFilter.addEventListener("change", displayArticles);
}

if (sortOrder) {
    sortOrder.addEventListener("change", displayArticles);
}

loadArticles();