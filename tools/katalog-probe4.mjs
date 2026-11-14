// Einmalige Prüfung: wie veröffentlichen Norsan und edubily ihre Produkte?
import fs from "node:fs";
const UA="AtlasKatalog/1.0 (privater Produktkatalog; 1 Anfrage pro Sekunde)";const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const out={};fs.mkdirSync("katalog/probe4",{recursive:true});
async function g(u){try{const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"},redirect:"follow"});const t=await r.text();await sleep(1000);return {status:r.status,url:r.url,typ:r.headers.get("content-type"),len:t.length,text:t}}catch(e){return {fehler:String(e)}}}
for(const [k,base] of [["norsan","https://norsan.de"],["norsan_at","https://norsan.at"],["edubily","https://edubily.de"]]){
  const o=out[k]={};
  for(const pth of ["/robots.txt","/products.json?limit=250","/sitemap.xml","/sitemap_index.xml","/product-sitemap.xml","/wp-json/wc/store/v1/products?per_page=100"]){const r=await g(base+pth);o[pth]={status:r.status,url:r.url,typ:r.typ,len:r.len,anfang:(r.text||r.fehler||"").slice(0,600)};
    if(r.status===200&&r.text)fs.writeFileSync(`katalog/probe4/${k}${pth.replace(/[^a-z0-9]+/gi,"_")}.txt`,r.text.slice(0,400000))}}
fs.writeFileSync("katalog/probe4/report.json",JSON.stringify(out,null,1));
