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

function cleanTitle(title) {
    return title
        .replace(/\s+/g, " ")
        .replace(" | Billboard", "")
        .replace(" – Rolling Stone", "")
        .replace(" - The Hollywood Reporter", "")
        .trim();
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
        "x.com": "X",
        "t.co": "External Link",
        "laweekly.com": "LA Weekly",
        "mymodernmet.com": "My Modern Met",
        "vogue.com": "Vogue",
        "nbclosangeles.com": "NBC Los Angeles",
        "whittierdailynews.com": "Whittier Daily News",
        "tmz.com": "TMZ",
        "kron4.com": "KRON4",
        "usa.inquirer.net": "Inquirer USA",
        "pageone.ph": "PAGEONE",
        "envimedia.co": "EnVi Media",
        "pressenterprise.com": "Press Enterprise",
        "rollingstonejapan.com": "Rolling Stone Japan",
        "asiaent.net": "Asia Entertainment",
        "ellegirl.jp": "ELLE Girl Japan",
        "vogue.co.jp": "Vogue Japan",
        "detik.com": "Detik",
        "rri.co.id": "RRI",
        "hops.id": "Hops ID",
        "ceknricek.com": "CekNRicek",
        "radarmadiun.jawapos.com": "Radar Madiun",
        "antaranews.com": "Antara News",
        "elle.in": "ELLE India",
        "instagram.com": "Instagram",
        "soycarmin.com": "Soy Carmín",
        "leadership.ng": "Leadership",
        "elle.com.sg": "ELLE Singapore",
        "cnalifestyle.channelnewsasia.com": "CNA Lifestyle",
        "vogue.sg": "Vogue Singapore",
        "elle.vn": "ELLE Vietnam",
        "gukjenews.com": "Gukje News",
        "kstationtv.com": "Kstation TV",
        "scmp.com": "South China Morning Post",
        "hellomagazine.com": "Hello! Magazine",
        "andasian.com": "Andasian",
        "popnow.com.br": "PopNow",
        "voguehk.com": "Vogue Hong Kong",
        "abc.net.au": "ABC News Australia",
        "en.wikipedia.org": "Wikipedia",
        "bini.fandom.com": "BINI Fandom",
        "youtube.com": "YouTube",
        "ent.abs-cbn.com": "ABS-CBN Entertainment",
        "pep.ph": "PEP.ph",
        "cosmo.ph": "Cosmopolitan Philippines"
    };

    return sources[host] || host;
}

function inferCategory(url) {
    const lower = url.toLowerCase();

    if (lower.includes("instagram") || lower.includes("x.com") || lower.includes("t.co")) return "Others";
    if (lower.includes("youtube")) return "Video";
    if (lower.includes("video") || lower.includes("shorttakes")) return "Video";
    if (lower.includes("photo") || lower.includes("getty") || lower.includes("slideshow") || lower.includes("foto")) return "Photos";
    if (lower.includes("vogue") || lower.includes("elle") || lower.includes("fashion") || lower.includes("beauty") || lower.includes("outfits") || lower.includes("style")) return "Fashion";
    if (lower.includes("interview") || lower.includes("talks")) return "Interview";

    return "News";
}

function inferEvent(url, title) {
    const text = `${url} ${title}`.toLowerCase();

    if (text.includes("coachella")) return "Coachella";
    if (text.includes("summer sonic")) return "Summer Sonic";
    if (text.includes("kcon")) return "KCON";
    if (text.includes("grammy museum") || text.includes("global spin")) return "Grammy Museum Global Spin Live";
    if (text.includes("filipino heritage") || text.includes("clippers")) return "Filipino Heritage Night";
    if (text.includes("pbb") || text.includes("pinoy big brother")) return "PBB";
    if (text.includes("star hunt")) return "Star Hunt Academy";

    return "General";
}

function extractYear(value, url) {
    const combined = `${value || ""} ${url}`;
    const match = combined.match(/20\d{2}|2018|2019/);

    if (match) return match[0];

    return "Unknown";
}

function fallbackTitle(url) {
    const link = new URL(url);

    if (link.hostname.includes("t.co")) return "External Link";
    if (link.hostname.includes("instagram")) return "Instagram Post";
    if (link.hostname.includes("youtube")) return "YouTube Video";

    const parts = link.pathname.split("/").filter(Boolean);
    const slug = parts[parts.length - 1] || link.hostname;

    return slug
        .replaceAll("-", " ")
        .replaceAll("_", " ")
        .replace(/\d+/g, "")
        .replace(/\b\w/g, letter => letter.toUpperCase())
        .trim();
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

        const rawTitle =
            getMeta($, "og:title") ||
            getMeta($, "twitter:title") ||
            $("title").text().trim() ||
            fallbackTitle(url);

        const title = cleanTitle(rawTitle);

        const description =
            getMeta($, "og:description") ||
            getMeta($, "twitter:description") ||
            getMeta($, "description") ||
            "";

        const image =
            getMeta($, "og:image") ||
            getMeta($, "twitter:image") ||
            "../images/articles/article-placeholder.jpg";

        const date =
            getMeta($, "article:published_time") ||
            getMeta($, "date") ||
            getMeta($, "pubdate") ||
            "";

        return {
            id: index + 1,
            title,
            source: getSource(url),
            category: inferCategory(url),
            event: inferEvent(url, title),
            year: extractYear(date || title, url),
            date,
            description,
            image,
            url
        };

    } catch (error) {
        console.log(`Failed: ${url}`);

        const title = fallbackTitle(url);

        return {
            id: index + 1,
            title,
            source: getSource(url),
            category: inferCategory(url),
            event: inferEvent(url, title),
            year: extractYear(title, url),
            date: "",
            description: "Metadata could not be loaded automatically.",
            image: "../images/articles/article-placeholder.jpg",
            url
        };
    }
}

async function syncArticles() {
    const links = await fs.readJson(inputPath);

    const uniqueLinks = [...new Set(links)];

    const articles = [];

    for (let i = 0; i < uniqueLinks.length; i++) {
        const article = await scrapeArticle(uniqueLinks[i], i);
        articles.push(article);
    }

    await fs.writeJson(outputPath, articles, { spaces: 2 });

    console.log(`Done. ${articles.length} articles saved to ${outputPath}`);
}

syncArticles();