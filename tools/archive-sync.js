const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");

const inputPath = "data/article-links.json";
const outputPath = "data/articles.json";

function getMeta($, name) {
    return (
        $(`meta[property="${name}"]`).attr("content") ||
        $(`meta[name="${name}"]`).attr("content") ||
        ""
    );
}

function getSource(url) {
    const host = new URL(url).hostname.replace("www.", "");

    const sources = {
        "billboard.com": "Billboard",
        "latimes.com": "Los Angeles Times",
        "rollingstone.com": "Rolling Stone",
        "hollywoodreporter.com": "The Hollywood Reporter",
        "apnews.com": "Associated Press",
        "reuters.com": "Reuters",
        "gettyimages.com": "Getty Images",
        "vogue.com": "Vogue",
        "nbclosangeles.com": "NBC Los Angeles",
        "tmz.com": "TMZ",
        "usa.inquirer.net": "Inquirer USA",
        "pageone.ph": "PAGEONE",
        "envimedia.co": "EnVi Media",
        "pressenterprise.com": "Press Enterprise",
        "rollingstonejapan.com": "Rolling Stone Japan",
        "asiaent.net": "Asia Entertainment",
        "ellegirl.jp": "ELLE Girl Japan",
        "instagram.com": "Instagram",
        "x.com": "X",
        "t.co": "External Link"
    };

    return sources[host] || host;
}

function getCategory(url) {
    const lower = url.toLowerCase();

    if (lower.includes("instagram") || lower.includes("x.com") || lower.includes("t.co")) return "Others";
    if (lower.includes("photo") || lower.includes("getty") || lower.includes("slideshow") || lower.includes("foto")) return "Photos";
    if (lower.includes("video") || lower.includes("shorttakes")) return "Video";
    if (lower.includes("vogue") || lower.includes("elle") || lower.includes("fashion") || lower.includes("beauty") || lower.includes("outfits")) return "Fashion";
    if (lower.includes("interview") || lower.includes("talks")) return "Interview";

    return "News";
}

async function scrapeArticle(url, index) {
    try {
        console.log(`Syncing ${index + 1}: ${url}`);

        const response = await axios.get(url, {
            timeout: 15000,
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(response.data);

        const title =
            getMeta($, "og:title") ||
            $("title").text().trim() ||
            "Untitled Article";

        const description =
            getMeta($, "og:description") ||
            getMeta($, "description") ||
            "";

        const image =
            getMeta($, "og:image") ||
            "../images/articles/article-placeholder.jpg";

        const date =
            getMeta($, "article:published_time") ||
            getMeta($, "date") ||
            "";

        return {
            id: index + 1,
            title: title.trim(),
            source: getSource(url),
            category: getCategory(url),
            event: "Coachella 2026",
            date,
            description,
            image,
            url
        };

    } catch (error) {
        console.log(`Failed: ${url}`);

        return {
            id: index + 1,
            title: "External Coverage Link",
            source: getSource(url),
            category: getCategory(url),
            event: "Coachella 2026",
            date: "",
            description: "Article metadata could not be loaded automatically.",
            image: "../images/articles/article-placeholder.jpg",
            url
        };
    }
}

async function syncArticles() {
    const links = await fs.readJson(inputPath);

    const articles = [];

    for (let i = 0; i < links.length; i++) {
        const article = await scrapeArticle(links[i], i);
        articles.push(article);
    }

    await fs.writeJson(outputPath, articles, { spaces: 2 });

    console.log("Done! articles.json generated.");
}

syncArticles();