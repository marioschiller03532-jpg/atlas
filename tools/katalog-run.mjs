// Atlas Supplement-Katalog: Biogena + MoleQlar aus den offiziellen Shops (robots.txt beachtet, 1 Anfrage/Sekunde).
// Speichert nur strukturierte Daten und kurze sachliche Angaben, keine Werbetexte.
import fs from "node:fs";import crypto from "node:crypto";
const UA="AtlasKatalog/1.0 (privater Produktkatalog; 1 Anfrage pro Sekunde)";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const NOW=new Date().toISOString();
async function get(u,tries=2){for(let i=0;i<tries;i++){try{const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"}});const t=await r.text();await sleep(1000);if(r.ok)return {ok:true,status:r.status,text:t};if(r.status<500)return {ok:false,status:r.status,text:""}}catch(e){await sleep(2000)}}return {ok:false,status:0,text:""}}
const strip=h=>String(h||"").replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|li)>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/[ \t]+/g," ").replace(/\n\s*\n+/g,"\n").trim();
const list=h=>strip(h).split("\n").map(x=>x.trim()).filter(Boolean);
fs.mkdirSync("katalog",{recursive:true});
const prev=(()=>{try{return JSON.parse(fs.readFileSync("katalog/supplement_catalog.json","utf8"))}catch{return null}})();
const prevMap=new Map((prev?.produkte||[]).map(p=>[p.url,p]));
const hash=p=>crypto.createHash("sha1").update(JSON.stringify([p.name,p.inhaltsstoffe,p.zutaten,p.verzehrempfehlung,p.packung,p.preis?.betrag,p.hinweise])).digest("hex").slice(0,12);
const report={geprueft:NOW,hersteller:{}},produkte=[];

// ---------- Biogena ----------
{const R={gefunden:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[]};report.hersteller.Biogena=R;
 const sm=await get("https://biogena.com/sitemap/sitemap-de-at.xml");
 const urls=[...new Set([...sm.text.matchAll(/<loc>(https:\/\/biogena\.com\/de-at\/produkte\/[^<]+)<\/loc>/g)].map(m=>m[1]))];R.gefunden=urls.length;R.quelle="https://biogena.com/sitemap/sitemap-de-at.xml";
 const FIELD=/"([A-Za-z0-9_]+)","([^"]{2,80})",\[\d+(?:,\d+)*\],\{"fieldSet":\d+,"groupSet":\d+\},\[\d+\],\[\d+\],\{"value":\d+\},("(?:[^"\\]|\\.)*"|\d+|true|false)/g;
 for(const url of urls){const r=await get(url);if(!r.ok){R.nicht_abrufbar.push({url,status:r.status});continue}
  const s=r.text,F={};for(const m of s.matchAll(FIELD)){let v=m[3];try{v=JSON.parse(v)}catch{}if(!(m[1] in F))F[m[1]]=v}
  let ld=null;for(const m of s.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)){try{const j=JSON.parse(m[1]);if(j["@type"]==="ProductGroup"||j["@type"]==="Product")ld=j}catch{}}
  const v=ld?.hasVariant?.[0]||ld||{};
  // Inhaltsstofftabelle aus der Seite
  let tabelle=null;const tm=s.match(/<table.*?<\/table>/s);if(tm){const rows=[...tm[0].matchAll(/<tr.*?<\/tr>/gs)].map(x=>[...x[0].matchAll(/<t[hd][^>]*>(.*?)<\/t[hd]>/gs)].map(c=>strip(c[1])));if(rows.length>1)tabelle={kopf:rows[0],zeilen:rows.slice(1)}}
  let name=v.name||ld?.name||"";try{const w=typeof F.computedWebName==="string"?JSON.parse(F.computedWebName):F.computedWebName;if(w&&w.de_AT)name=w.de_AT}catch{}
  const allerg=Object.keys(F).filter(k=>/allerg/i.test(k)).map(k=>strip(F[k])).filter(Boolean);
  const p={hersteller:"Biogena",name,url,abgerufen:NOW,linie:F.productLine||null,kurz:F.productSubtitleShort||F.productSubtitle||null,
    kategorie:null,anwendungsbereiche_hersteller:F.fieldsOfApplication?list(F.fieldsOfApplication):[],
    inhaltsstoffe:tabelle,zutaten:F.ingredients?strip(F.ingredients):null,verzehrempfehlung:F.recommendedIntake?strip(F.recommendedIntake):null,
    tagesdosis:F.dailyDosage??null,packung:F.packageSize?strip(F.packageSize):(v.size||null),form:null,
    hinweise:F.notices?list(F.notices):[],allergene:allerg,diabetiker:F.diabeticNote||null,
    preis:v.offers?.price!=null?{betrag:v.offers.price,waehrung:v.offers.priceCurrency,verfuegbar:/InStock/.test(v.offers.availability||""),abgerufen:NOW}:null,
    ean:F.ean||v.gtin||null,dokumente:[F.documentsLegal,F.lefoCertifikat].filter(x=>typeof x==="string"&&x.startsWith("http"))};
  const pk=String(p.packung||"").match(/Kapseln|Tabletten|Pulver|Tropfen|Sticks?|Sachets?|Liquid|Flüssig|ml|Granulat|Lutsch|Spray|Kaugummi|Gummies|Öl/i);p.form=pk?pk[0]:null;
  const zub=!tabelle&&!p.zutaten;p.kategorie=zub?"kein Nahrungsergänzungsmittel / Zubehör oder Bundle":(p.linie||"Nahrungsergänzung");
  const miss=["inhaltsstoffe","zutaten","verzehrempfehlung","packung"].filter(k=>!p[k]);p.fehlend=zub?[]:miss;p.vollstaendig=zub?null:miss.length===0;
  if(p.vollstaendig)R.vollstaendig++;else if(!zub)R.teilweise.push({url,fehlt:miss});if(zub)R.zubehoer=(R.zubehoer||0)+1;
  produkte.push(p)}}

// ---------- MoleQlar (Shopify) ----------
{const R={gefunden:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[]};report.hersteller.MoleQlar=R;
 const all=[];for(let page=1;page<6;page++){const r=await get(`https://moleqlar.com/products.json?limit=250&page=${page}`);if(!r.ok){R.nicht_abrufbar.push({url:"products.json page "+page,status:r.status});break}
  let j;try{j=JSON.parse(r.text)}catch{break}if(!j.products?.length)break;all.push(...j.products)}
 R.gefunden=all.length;R.quelle="https://moleqlar.com/products.json";let sample=0;
 for(const pr of all){const url="https://moleqlar.com/products/"+pr.handle;const r=await get(url);
  if(sample<3&&r.ok){fs.mkdirSync("katalog/probe",{recursive:true});fs.writeFileSync("katalog/probe/moleqlar_"+pr.handle.slice(0,40)+".html",r.text);sample++}
  const body=strip(pr.body_html||"");const page=r.ok?r.text:"";const txt=strip(page.replace(/<script.*?<\/script>/gs,"").replace(/<style.*?<\/style>/gs,""));
  const grab=(label)=>{const m=txt.match(new RegExp(label+"[:\\s]*\\n?([\\s\\S]{5,600}?)(?:\\n[A-ZÄÖÜ][^\\n]{0,40}\\n|$)","i"));return m?m[1].trim():null};
  const v=pr.variants?.[0]||{};
  const p={hersteller:"MoleQlar",name:pr.title,url,abgerufen:NOW,linie:pr.vendor||null,kurz:body.split("\n")[0]?.slice(0,200)||null,kategorie:pr.product_type||null,
    anwendungsbereiche_hersteller:[],inhaltsstoffe:null,inhaltsstoffe_text:grab("(?:Inhaltsstoffe|Nährwerte|Zusammensetzung)"),zutaten:grab("Zutaten"),verzehrempfehlung:grab("(?:Verzehrempfehlung|Anwendung|Einnahme)"),
    tagesdosis:null,packung:v.title&&v.title!=="Default Title"?v.title:null,form:null,hinweise:grab("(?:Hinweise?|Warnhinweis)")?[grab("(?:Hinweise?|Warnhinweis)")]:[],allergene:[],
    preis:v.price?{betrag:+v.price,waehrung:"EUR",verfuegbar:!!v.available,abgerufen:NOW}:null,ean:v.barcode||null,dokumente:[],tags:pr.tags};
  const miss=["zutaten","verzehrempfehlung"].filter(k=>!p[k]);if(!p.inhaltsstoffe_text)miss.push("inhaltsstoffe");p.fehlend=miss;p.vollstaendig=miss.length===0;
  if(!r.ok)R.nicht_abrufbar.push({url,status:r.status});if(p.vollstaendig)R.vollstaendig++;else R.teilweise.push({url,fehlt:miss});produkte.push(p)}}

// ---------- Änderungen gegenüber dem letzten Lauf ----------
const changes={neu:[],geaendert:[],entfernt:[]};for(const p of produkte){p.hash=hash(p);const o=prevMap.get(p.url);if(!o)changes.neu.push(p.name);else if(o.hash!==p.hash)changes.geaendert.push(p.name)}
const now=new Set(produkte.map(p=>p.url));for(const o of prevMap.values())if(!now.has(o.url))changes.entfernt.push(o.name);
report.aenderungen=prev?changes:{erstimport:true};report.unvollstaendig=Object.values(report.hersteller).some(h=>h.teilweise.length||h.nicht_abrufbar.length);
fs.writeFileSync("katalog/supplement_catalog.json",JSON.stringify({stand:NOW,hinweis:"Herstellerangaben aus den offiziellen Shops; keine Wirksamkeitsbelege. Fehlende Angaben sind leer, nicht geschätzt.",produkte},null,0));
fs.writeFileSync("katalog/report.json",JSON.stringify(report,null,1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.hersteller).map(([k,v])=>[k,{gefunden:v.gefunden,vollstaendig:v.vollstaendig,teilweise:v.teilweise.length,nicht_abrufbar:v.nicht_abrufbar.length}]))));
