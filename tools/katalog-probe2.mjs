// Probe 2: fehlende Biogena-Angaben und MoleQlar-Mengenquellen (Bilder, PDFs, Metafelder) untersuchen.
import fs from "node:fs";
const UA="AtlasKatalog/1.0 (privater Produktkatalog; 1 Anfrage pro Sekunde)";const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function get(u){try{const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"}});const t=await r.text();await sleep(1000);return {status:r.status,text:t}}catch(e){return {status:0,text:""}}}
const strip=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
fs.mkdirSync("katalog/probe2",{recursive:true});const out={biogena:{},moleqlar:{}};
const FIELD=/"([A-Za-z0-9_]+)","([^"]{2,80})",\[\d+(?:,\d+)*\],\{"fieldSet":\d+,"groupSet":\d+\},\[\d+\],\[\d+\],\{"value":\d+\},("(?:[^"\\]|\\.)*"|\d+|true|false)/g;
for(const slug of ["biogena-sports-magnesium-wasser-428","hallsteinwasser-416","biogena-moments-beauty-bites-314","zeolith-500-296","zeolith-ultrafein-245","bio-schwarzkuemmeloel-233","bio-leinoel-74"]){
  const r=await get("https://biogena.com/de-at/produkte/"+slug);const F={};for(const m of r.text.matchAll(FIELD)){let v=m[3];try{v=JSON.parse(v)}catch{}F[m[1]]={label:m[2],v:String(v).slice(0,400)}}
  const tbl=(r.text.match(/<table.*?<\/table>/s)||[""])[0];
  out.biogena[slug]={status:r.status,keys:Object.fromEntries(Object.entries(F).filter(([k])=>!/picture|Picture|countryLock|readyForSale|deposit|subscribable|legalsentence|tiered|discount|computedWebName|synonyms|taxCode|legalUnit/.test(k))),tabelle:strip(tbl).slice(0,600),pdfs:[...new Set(r.text.match(/https:\/\/static\.biogena\.com\/[^"'\s]+\.pdf/g)||[])]}}
const pj=JSON.parse((await get("https://moleqlar.com/products.json?limit=250")).text);
const pick=["nr-pro-kapseln","lutein-zeaxanthin-kapseln","uthever-nmn-pulver","kreatin-pulver","magnesium-l-threonat-kapseln","omega-3-kapseln-vegan"];
for(const pr of pj.products.filter(p=>pick.some(x=>p.handle.startsWith(x))).slice(0,6)){
  const r=await get("https://moleqlar.com/products/"+pr.handle);const s=r.text;
  const imgs=[...s.matchAll(/<img[^>]+>/g)].map(m=>m[0]).filter(x=>/alt="[^"]*(Inhalt|Nährwert|Zutat|Etikett|Label|Supplement|Tabelle|facts|Rückseite|Packung)/i.test(x)).map(x=>({src:(x.match(/src="([^"]+)"/)||[])[1],alt:(x.match(/alt="([^"]*)"/)||[])[1]})).slice(0,10);
  const pdfs=[...new Set(s.match(/https?:[^"'\s]+\.pdf[^"'\s]*/g)||[])].slice(0,10);
  const allImgs=(pr.images||[]).map(i=>({src:i.src,alt:i.alt,w:i.width,h:i.height}));
  const meta=[...s.matchAll(/metafield-[a-z_]+"[^>]*>(.*?)<\/div>/gs)].map(m=>strip(m[1]).slice(0,300)).slice(0,10);
  const tables=[...s.matchAll(/<table.*?<\/table>/gs)].map(m=>strip(m[0]).slice(0,500));
  out.moleqlar[pr.handle]={status:r.status,body_html:strip(pr.body_html).slice(0,800),imgsMitAlt:imgs,produktbilder:allImgs,pdfs,meta,tables,mgStellen:(strip(s.replace(/<script.*?<\/script>/gs,"")).match(/[^.]{0,80}\d+(?:[.,]\d+)?\s?(?:mg|µg|g)\b[^.]{0,60}/g)||[]).slice(0,15)}}
// Produktbilder eines Beispiels herunterladen, um zu sehen, ob ein Etikett/Tabelle dabei ist
const ex=out.moleqlar["nr-pro-kapseln"]||Object.values(out.moleqlar)[0];
if(ex){let i=0;for(const im of ex.produktbilder.slice(0,8)){try{const r=await fetch(im.src.replace(/(\.\w+)(\?|$)/,"_800x$1$2"));const b=Buffer.from(await r.arrayBuffer());fs.writeFileSync(`katalog/probe2/nrpro_${i++}.jpg`,b);await sleep(500)}catch{}}}
fs.writeFileSync("katalog/probe2/report.json",JSON.stringify(out,null,1));
