const articlesGrid = document.getElementById("articles-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

let articles = [];

async function loadArticles() {
    const response = await fetch("../data/articles.json");
    const links = await response.json();

    articles = links.map(url => {
        const link = new URL(url);
        const source = getSourceName(link.hostname);
        const title = getTitleFromUrl(link);
        const category = getCategory(url);

        return {
            title,
            source,
            category,
            url
        };
    });

    displayArticles("all");
}

function getSourceName(hostname) {
    return hostname
        .replace("www.", "")
        .replace(".com", "")
        .replace(".net", "")
        .replace(".co", "")
        .replace(".jp", "")
        .replace(".ph", "")
        .replace(".sg", "")
        .replace(".hk", "")
        .replace(".vn", "")
        .replace(".id", "")
        .replaceAll("-", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function getTitleFromUrl(link) {
    let path = link.pathname.split("/").filter(Boolean);
    let slug = path[path.length - 1] || link.hostname;

    if (slug.includes("search")) {
        return "BINI Coachella Editorial Images";
    }

    return slug
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .replace(/\d+/g, "")
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .trim();
}

function getCategory(url) {
    const lowerUrl = url.toLowerCase();

    if (
        lowerUrl.includes("video") ||
        lowerUrl.includes("youtube") ||
        lowerUrl.includes("shorttakes")
    ) {
        return "Video";
    }

    if (
        lowerUrl.includes("photo") ||
        lowerUrl.includes("getty") ||
        lowerUrl.includes("slideshow") ||
        lowerUrl.includes("foto")
    ) {
        return "Photos";
    }

    if (
        lowerUrl.includes("vogue") ||
        lowerUrl.includes("elle") ||
        lowerUrl.includes("beauty") ||
        lowerUrl.includes("fashion") ||
        lowerUrl.includes("outfits")
    ) {
        return "Fashion";
    }

    if (
        lowerUrl.includes("interview") ||
        lowerUrl.includes("talks")
    ) {
        return "Interview";
    }

    if (
        lowerUrl.includes("instagram") ||
        lowerUrl.includes("x.com") ||
        lowerUrl.includes("t.co")
    ) {
    return "Others";
}

    return "News";
}

function displayArticles(filter) {
    articlesGrid.innerHTML = "";

    const filtered = filter === "all"
        ? articles
        : articles.filter(article => article.category === filter);

    filtered.forEach(article => {
        const card = document.createElement("article");
        card.className = "article-card";

        card.innerHTML = `
            <span class="article-source">${article.source}</span>

            <h3>${article.title}</h3>

            <p class="article-meta">${article.category}</p>

            <a href="${article.url}" target="_blank" rel="noopener noreferrer">
                Read →
            </a>
        `;

        articlesGrid.appendChild(card);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        displayArticles(button.dataset.filter);
    });
});

loadArticles();