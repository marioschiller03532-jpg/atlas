// Einmalige Prüfung (vollständig): Norsan WooCommerce-Schnittstelle, edubily Shopify-Feed, je eine Produktseite
import fs from "node:fs";
const UA="AtlasKatalog/1.0 (privater Produktkatalog; 1 Anfrage pro Sekunde)";const sleep=ms=>new Promise(r=>setTimeout(r,ms));
fs.mkdirSync("katalog/probe5",{recursive:true});
async function g(u){const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"}});const t=await r.text();await sleep(1000);return {status:r.status,t,h:Object.fromEntries(r.headers)}}
const nor=[];for(let pg=1;pg<6;pg++){const r=await g("https://norsan.de/wp-json/wc/store/v1/products?per_page=100&page="+pg);if(r.status!==200)break;const j=JSON.parse(r.t);if(!j.length)break;nor.push(...j)}
fs.writeFileSync("katalog/probe5/norsan.json",JSON.stringify(nor));
const ed=await g("https://edubily.de/products.json?limit=250");fs.writeFileSync("katalog/probe5/edubily.json",ed.t);
const ej=JSON.parse(ed.t).products;const om=ej.find(p=>/omega/i.test(p.title))||ej[0];
const ep=await g("https://edubily.de/products/"+om.handle);fs.writeFileSync("katalog/probe5/edubily_seite.html",ep.t);
const np=nor.find(p=>/vegan-epa-kapseln$/.test(p.slug))||nor[0];const nps=await g(np.permalink);fs.writeFileSync("katalog/probe5/norsan_seite.html",nps.t);
fs.writeFileSync("katalog/probe5/info.json",JSON.stringify({norsan:nor.length,edubily:ej.length,edubily_seite:om.handle,norsan_seite:np.permalink}));
