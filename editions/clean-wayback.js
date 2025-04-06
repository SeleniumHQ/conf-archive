const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const fse = require("fs-extra");

const inputRoot = process.argv[2];
const domainTLD = process.argv[3];

if (!inputRoot || !domainTLD) {
    console.error("❌ Usage: node clean-wayback.js <edition-folder> <com|org>");
    console.error("   Example: node clean-wayback.js editions/sf2011 com");
    console.error("         or: node clean-wayback.js editions/london2012 org");
    process.exit(1);
}

const BASE_DOMAIN = `www.seleniumconf.${domainTLD}`;
const resolvedRoot = path.resolve(inputRoot);

const rewriteMap = {
    js: "js",
    cs: "css",
    im: "images",
    if: "iframes",
};

function findIndexHtml(dir) {
    let indexCandidates = [];

    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile() && entry.name.toLowerCase() === "index.html") {
                indexCandidates.push(fullPath);
            }
        }
    }

    walk(dir);

    indexCandidates.sort((a, b) => a.split(path.sep).length - b.split(path.sep).length);
    return indexCandidates[0] || null;
}

function flattenFolder(folderPath) {
    const possibleHttpFolders = ["http", "http:"];

    let basePath = null;
    for (const folderName of possibleHttpFolders) {
        const candidate = path.join(folderPath, folderName, BASE_DOMAIN);
        if (fs.existsSync(candidate)) {
            basePath = candidate;
            break;
        }
    }

    console.log(`🔍 Checking for nested folder in ${basePath || "(none found)"}`);
    if (!basePath) {
        console.log(`❌ Nested path not found in ${folderPath}, skipping flattening.`);
        return;
    }

    const items = fs.readdirSync(basePath);
    items.forEach((name) => {
        const src = path.join(basePath, name);
        const dest = path.join(folderPath, name);
        fse.moveSync(src, dest, { overwrite: true });
    });

    possibleHttpFolders.forEach((name) => {
        const candidate = path.join(folderPath, name);
        if (fs.existsSync(candidate)) {
            fse.removeSync(candidate);
            console.log(`🧹 Removed leftover folder: ${candidate}`);
        }
    });

    console.log(`📁 Flattened ${folderPath} — moved contents up`);
}

function cleanIndexHtml(htmlPath) {
    const html = fs.readFileSync(htmlPath, "utf8");
    const $ = cheerio.load(html);

    $("#wm-ipp").remove();
    $("script, iframe").each((_, el) => {
        const src = $(el).attr("src") || $(el).attr("data-src");
        if (src && src.includes("web.archive.org")) $(el).remove();
    });

    ["script", "link", "img"].forEach((tag) => {
        const attr = tag === "link" ? "href" : "src";

        $(tag).each((_, el) => {
            const val = $(el).attr(attr);
            if (!val) return;

            const mappings = [
                { match: new RegExp(`.*?(\\d{14})cs_/http[:]?/${BASE_DOMAIN}/`), replaceWith: "css/" },
                { match: new RegExp(`.*?(\\d{14})js_/http[:]?/${BASE_DOMAIN}/`), replaceWith: "js/" },
                { match: new RegExp(`.*?(\\d{14})im_/http[:]?/${BASE_DOMAIN}/`), replaceWith: "images/" }
            ];

            let newVal = val;
            for (const rule of mappings) {
                if (rule.match.test(val)) {
                    newVal = val.replace(rule.match, rule.replaceWith);
                    break;
                }
            }

            $(el).attr(attr, newVal);
        });
    });

    $("iframe").each((_, el) => {
        const val = $(el).attr("src");
        if (!val) return;

        const match = val.match(/.*?(\d{14})if_\/(http[:]?\/.*)/);
        if (match) {
            const newVal = `iframes/${match[2]}`;
            $(el).attr("src", newVal);
        }
    });

    $("a[href]").each((_, el) => {
        let href = $(el).attr("href");
        const text = $(el).text().trim();

        if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

        const domainRegex = BASE_DOMAIN.replace(/\./g, "\\.");
        const fullArchive = href.match(new RegExp(`https?://web\\.archive\\.org/web/\\d+/http://${domainRegex}/(.*)`));
        const shortArchive = href.match(new RegExp(`/web/\\d+/http://${domainRegex}/(.*)`));
        const matchedPath = fullArchive?.[1] || shortArchive?.[1];

        // Special case: Home
        if (text === "Home") {
            const currentDir = path.dirname(htmlPath);
            let relToRoot = path.relative(currentDir, resolvedRoot).replace(/\\/g, "/");
            relToRoot = relToRoot === "" ? "./" : relToRoot + "/";
            $(el).attr("href", relToRoot);
            return;
        }

        if (!matchedPath) return; // Skip already-correct relative links

        const cleanTarget = matchedPath.replace(/^\/+/, "").replace(/index\.html$/, "").replace(/\/+$/, "");
        const targetAbsPath = path.resolve(resolvedRoot, cleanTarget);
        const currentDir = path.dirname(htmlPath);

        let relPath = path.relative(currentDir, targetAbsPath).replace(/\\/g, "/");
        if (!relPath.endsWith(".html") && !relPath.endsWith("/")) relPath += "/";
        if (relPath === "") relPath = "./";

        $(el).attr("href", relPath);
    });

    fs.writeFileSync(htmlPath, $.html(), "utf8");
    console.log(`✅ Cleaned ${path.relative(resolvedRoot, htmlPath)}`);
}

const archiveDir = path.join(resolvedRoot, "web.archive.org", "web");
if (!fs.existsSync(archiveDir)) {
    console.error("❌ Could not find web.archive.org/web in", resolvedRoot);
    process.exit(1);
}

// Find snapshot folder
const snapshotFolder = fs.readdirSync(archiveDir).find(name =>
    /^\d{14}$/.test(name) && fs.statSync(path.join(archiveDir, name)).isDirectory()
);
if (!snapshotFolder) {
    console.error("❌ No snapshot folder found");
    process.exit(1);
}
const snapshotPath = path.join(archiveDir, snapshotFolder);

// Find and clean main index.html
const indexPath = findIndexHtml(snapshotPath);
if (!indexPath) {
    console.error("❌ Could not find index.html in snapshot");
    process.exit(1);
}
console.log("📄 Found index.html at", path.relative(resolvedRoot, indexPath));
cleanIndexHtml(indexPath);

// Move all content from snapshot folder
const htmlRoot = path.dirname(indexPath);
console.log("📦 Moving full static site content...");

fse.readdirSync(htmlRoot).forEach((entry) => {
    const from = path.join(htmlRoot, entry);
    const to = path.join(resolvedRoot, entry);

    if (!fs.existsSync(to)) {
        fse.moveSync(from, to, { overwrite: true });
    }
});

console.log("✅ Moved full site content to edition root");

// Rename asset folders
fs.readdirSync(archiveDir).forEach(name => {
    const fullPath = path.join(archiveDir, name);
    if (!fs.statSync(fullPath).isDirectory()) return;
    const match = name.match(/^(\d+)(js|cs|im|if)_$/);
    if (match) {
        const suffix = match[2];
        const newName = rewriteMap[suffix];
        const target = path.join(resolvedRoot, newName);
        if (!fs.existsSync(target)) {
            fs.renameSync(fullPath, target);
            console.log(`📦 Renamed: ${name} → ${newName}`);
        }
    }
});

// Flatten folders
["css", "js", "images"].forEach(type => {
    const folder = path.join(resolvedRoot, type);
    if (fs.existsSync(folder)) {
        flattenFolder(folder);
    }
});

// Recursively clean all index.html files
function cleanAllHtmls(rootDir) {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            cleanAllHtmls(fullPath);
        } else if (entry.name.toLowerCase() === "index.html") {
            cleanIndexHtml(fullPath);
        }
    }
}
cleanAllHtmls(resolvedRoot);

console.log("🎉 All done!");