// Probe: robots.txt, Sitemaps und je eine Beispielseite holen, damit der Parser gebaut werden kann.
import fs from "node:fs";
const UA="AtlasKatalog/0.1 (privater Produktkatalog; 1 Anfrage pro Sekunde)";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function get(u){try{const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"},redirect:"follow"});return {status:r.status,url:r.url,text:await r.text()}}catch(e){return {status:0,url:u,text:String(e)}}}
fs.mkdirSync("katalog/probe",{recursive:true});const out={};
for(const host of ["https://biogena.com","https://moleqlar.com","https://www.moleqlar.com"]){
  const rb=await get(host+"/robots.txt");out[host]={robots:rb.status,robotsText:rb.text.slice(0,3000)};await sleep(1000);
  const sm=await get(host+"/sitemap.xml");out[host].sitemap=sm.status;fs.writeFileSync("katalog/probe/"+host.replace(/\W+/g,"_")+"_sitemap.xml",sm.text.slice(0,200000));await sleep(1000)}
for(const u of ["https://biogena.com/de-at/produkte/magnesium-l-threonat-magtein-561","https://biogena.com/de-at/kategorien/produkte-1"]){const r=await get(u);fs.writeFileSync("katalog/probe/"+u.replace(/\W+/g,"_").slice(-60)+".html",r.text);out[u]=r.status;await sleep(1000)}
fs.writeFileSync("katalog/probe/report.json",JSON.stringify(out,null,1));
