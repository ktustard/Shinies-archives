const articlesGrid = document.getElementById("articles-grid");
const filterButtons = document.querySelectorAll(".filter-btn");

let articles = [];

async function loadArticles() {
    try {
        const response = await fetch("../data/articles.json");

        if (!response.ok) {
            throw new Error("Could not load articles.json");
        }

        const data = await response.json();

        articles = data.map(item => {
            if (typeof item === "string") {
                const link = new URL(item);

                return {
                    title: getTitleFromUrl(link),
                    source: getSourceName(link.hostname),
                    category: getCategory(item),
                    image: "../images/articles/article-placeholder.jpg",
                    url: item
                };
            }

            return {
                title: item.title || "Untitled Article",
                source: item.source || "Unknown Source",
                category: item.category || "Others",
                image: item.image || "../images/articles/article-placeholder.jpg",
                url: item.url
            };
        });

        displayArticles("all");

    } catch (error) {
        console.error(error);

        articlesGrid.innerHTML = `
            <p style="color:white;">
                Failed to load articles. Check articles.json and articles.js.
            </p>
        `;
    }
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
    const path = link.pathname.split("/").filter(Boolean);
    const slug = path[path.length - 1] || link.hostname;

    if (link.hostname.includes("t.co")) return "External Link";
    if (link.hostname.includes("instagram")) return "Instagram Post";

    return slug
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .replace(/\d+/g, "")
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .trim();
}

function getCategory(url) {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("instagram") || lowerUrl.includes("x.com") || lowerUrl.includes("t.co")) return "Others";
    if (lowerUrl.includes("video") || lowerUrl.includes("shorttakes")) return "Video";
    if (lowerUrl.includes("photo") || lowerUrl.includes("getty") || lowerUrl.includes("slideshow") || lowerUrl.includes("foto")) return "Photos";
    if (lowerUrl.includes("vogue") || lowerUrl.includes("elle") || lowerUrl.includes("fashion") || lowerUrl.includes("beauty") || lowerUrl.includes("outfits")) return "Fashion";
    if (lowerUrl.includes("interview") || lowerUrl.includes("talks")) return "Interview";

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
            <img 
                src="${article.image}" 
                alt="${article.title}" 
                class="article-image"
                onerror="this.onerror=null; this.src='../images/articles/article-placeholder.jpeg'"
>

            <div class="article-content">
                <span class="article-source">${article.source}</span>
                <h3>${article.title}</h3>
                <p class="article-meta">${article.category}</p>

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

        displayArticles(button.dataset.filter);
    });
});

loadArticles();