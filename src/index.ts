import { some } from "../libs/fp-ts/Option.js"
import { pipe } from "../libs/fp-ts/function.js"
import { option as O } from "../libs/fp-ts/index.js"
import { get, keys, set } from '../libs/idb-keyval/index.js';





const initialURL = "https://en.wiktionary.org/wiki/dominus"
if(! await keyExists(initialURL)){
    harvestHTML(initialURL)
}


function findLinks(html:string){
    const el = document.createElement( 'div' );
    el.innerHTML = html
    el.querySelectorAll("a")
    
}

function devURL(url:string){
   return "https://cors-anywhere.herokuapp.com/"+url
  
}
async function harvestHTML(url:string){

    const data = await fetch(devURL(url),{headers:{ "Access-Control-Allow-Origin": "*"}  })
    const text = await data.text()
    const el = document.createElement( 'html' );
    el.innerHTML = text
    const firstLatinEl = el.querySelector(":has(> #Latin)") as HTMLElement

    const div = document.createElement("div")
    div.append(el.cloneNode(true))
    let next = firstLatinEl.nextElementSibling
    while(next !== null && next.tagName.toLowerCase() !== "h2"){
        div.append(next.cloneNode(true))

        next = next.nextElementSibling
    }   
    return div
}

async function keyExists(ky:string){
    const kys = await keys<string>() 
    return kys.includes(ky)

}
//set(url, div.outerHTML);