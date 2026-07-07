const fs = require("fs");

const inputPath = "data/article-links.json";
const outputPath = "data/articles.json";

const links = JSON.parse(fs.readFileSync(inputPath, "utf8"));

function getSource(url) {
    const hostname = new URL(url).hostname.replace("www.", "");

    return hostname
        .replace(".com", "")
        .replace(".net", "")
        .replace(".ph", "")
        .replace(".jp", "")
        .replace(".sg", "")
        .replace(".hk", "")
        .replaceAll("-", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

function getCategory(url) {
    const lower = url.toLowerCase();

    if (lower.includes("photo") || lower.includes("getty") || lower.includes("slideshow") || lower.includes("foto")) return "Photos";
    if (lower.includes("video") || lower.includes("shorttakes")) return "Video";
    if (lower.includes("vogue") || lower.includes("elle") || lower.includes("fashion") || lower.includes("beauty") || lower.includes("outfits")) return "Fashion";
    if (lower.includes("interview") || lower.includes("talks")) return "Interview";
    if (lower.includes("instagram") || lower.includes("x.com") || lower.includes("t.co")) return "Others";

    return "News";
}

function getTitle(url) {
    const link = new URL(url);
    const parts = link.pathname.split("/").filter(Boolean);
    const slug = parts[parts.length - 1] || link.hostname;

    if (link.hostname.includes("t.co")) return "External Social Link";
    if (link.hostname.includes("instagram")) return "Instagram Post";

    return slug
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .replace(/\d+/g, "")
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .trim();
}

const articles = links.map((url, index) => {
    return {
        id: index + 1,
        title: getTitle(url),
        source: getSource(url),
        category: getCategory(url),
        event: "Coachella 2026",
        image: "../images/articles/article-placeholder.jpg",
        url: url
    };
});

fs.writeFileSync(outputPath, JSON.stringify(articles, null, 2));

console.log("articles.json generated successfully!");