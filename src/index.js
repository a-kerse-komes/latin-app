import { get, keys } from '../libs/idb-keyval/index.js';
const tegst = 34;
console.log("tesdddt");
const url = "https://en.wiktionary.org/wiki/dominus";
const html = await get(url);
function findLinks(html) {
    const el = document.createElement('div');
    el.innerHTML = html;
    el.querySelectorAll("a");
}
async function harvestHTML(url) {
    const data = await fetch("https://cors-anywhere.herokuapp.com/" + url, { headers: { "Access-Control-Allow-Origin": "*" } });
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