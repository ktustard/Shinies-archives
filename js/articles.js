const articlesGrid = document.getElementById("articles-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const yearFilter = document.getElementById("yearFilter");
const sortOrder = document.getElementById("sortOrder");
const searchInput = document.getElementById("searchInput");
const articleCount = document.getElementById("articleCount");

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
    return match ? match[0] : "Unknown";
}

function matchesSearch(article, searchTerm) {
    const text = `
        ${article.title || ""}
        ${article.source || ""}
        ${article.category || ""}
        ${article.event || ""}
        ${article.description || ""}
        ${article.url || ""}
    `.toLowerCase();

    return text.includes(searchTerm.toLowerCase());
}

function displayArticles() {
    articlesGrid.innerHTML = "";

    let filtered = [...articles];

    const searchTerm = searchInput.value.trim();

    if (currentCategory !== "all") {
        filtered = filtered.filter(article => article.category === currentCategory);
    }

    if (yearFilter.value !== "all") {
        filtered = filtered.filter(article => getArticleYear(article) === yearFilter.value);
    }

    if (searchTerm !== "") {
        filtered = filtered.filter(article => matchesSearch(article, searchTerm));
    }

    filtered.sort((a, b) => {
        const yearA = getArticleYear(a) === "Unknown" ? 0 : Number(getArticleYear(a));
        const yearB = getArticleYear(b) === "Unknown" ? 0 : Number(getArticleYear(b));

        return sortOrder.value === "oldest"
            ? yearA - yearB
            : yearB - yearA;
    });

    articleCount.textContent = `${filtered.length} article${filtered.length === 1 ? "" : "s"} found`;

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

yearFilter.addEventListener("change", displayArticles);
sortOrder.addEventListener("change", displayArticles);
searchInput.addEventListener("input", displayArticles);

loadArticles();