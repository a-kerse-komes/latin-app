import { keys } from '../libs/idb-keyval/index.js';
const initialURL = "https://en.wiktionary.org/wiki/dominus";
if (!keyExists(initialURL)) {
    harvestHTML(initialURL);
}
function findLinks(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    el.querySelectorAll("a");
}
function devURL(url) {
    if (window.location.host.includes("locahost"))
        return "https://cors-anywhere.herokuapp.com/" + url;
    return url;
}
async function harvestHTML(url) {
    const data = await fetch(devURL(url), { headers: { "Access-Control-Allow-Origin": "*" } });
    const text = await data.text();
    const el = document.createElement('html');
    el.innerHTML = text;
    const firstLatinEl = el.querySelector(":has(> #Latin)");
    const div = document.createElement("div");
    div.append(el.cloneNode(true));
    let next = firstLatinEl.nextElementSibling;
    while (next !== null && next.tagName.toLowerCase() !== "h2") {
        div.append(next.cloneNode(true));
        next = next.nextElementSibling;
    }
    return div;
}
async function keyExists(ky) {
    const kys = await keys();
    return kys.includes(ky);
}
//set(url, div.outerHTML);
//# sourceMappingURL=index.js.map