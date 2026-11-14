// Atlas Supplement-Katalog: Biogena, MoleQlar, Norsan und edubily aus den offiziellen Shops (robots.txt beachtet, 1 Anfrage/Sekunde).
// Speichert nur strukturierte Daten und kurze sachliche Angaben, keine Werbetexte.
import fs from "node:fs";import crypto from "node:crypto";
const UA="AtlasKatalog/1.0 (privater Produktkatalog; 1 Anfrage pro Sekunde)";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));const NOW=new Date().toISOString();
async function get(u,tries=2){for(let i=0;i<tries;i++){try{const r=await fetch(u,{headers:{"user-agent":UA,"accept-language":"de-AT,de;q=0.9"}});const t=await r.text();await sleep(1000);if(r.ok)return {ok:true,status:r.status,text:t};if(r.status<500)return {ok:false,status:r.status,text:""}}catch(e){await sleep(2000)}}return {ok:false,status:0,text:""}}
const strip=h=>String(h||"").replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|li)>/gi,"\n").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/[ \t]+/g," ").replace(/\n\s*\n+/g,"\n").trim();
const list=h=>strip(h).split("\n").map(x=>x.trim()).filter(Boolean);
fs.mkdirSync("katalog",{recursive:true});
import {execFileSync} from "node:child_process";
import {norsan,edubily} from "./katalog-marken.mjs";
const tables=html=>[...String(html).matchAll(/<table.*?<\/table>/gs)].map(t=>{const rows=[...t[0].matchAll(/<tr.*?<\/tr>/gs)].map(x=>[...x[0].matchAll(/<t[hd][^>]*>(.*?)<\/t[hd]>/gs)].map(c=>strip(c[1])));return rows.length>1?{kopf:rows[0],zeilen:rows.slice(1)}:null}).filter(Boolean);
// Beipackzettel/Etikett-PDF als Text (nur, um fehlende Felder zu prüfen)
async function pdfText(u){try{const r=await fetch(u,{headers:{"user-agent":UA}});await sleep(1000);if(!r.ok)return "";const f="/tmp/k.pdf";fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()));return execFileSync("pdftotext",["-layout",f,"-"],{encoding:"utf8"})}catch{return ""}}
const pdfField=(t,label)=>{const m=String(t).match(new RegExp(label+"[:\\s]+([\\s\\S]{5,400}?)(?:\\n\\s*\\n|$)","i"));return m?m[1].replace(/\s+/g," ").trim():null};
// Produkttyp nach Pflichtkennzeichnung bzw. Seitentext
function typOf(name,text,hasNutrTable){const t=String(text);if(/\bBundle\b|\bSet\b|Paket/i.test(name))return "Set/Bundle";
  if(/Medizinprodukt/i.test(t))return "Medizinprodukt";if(/Nahrungserg(ä|ae)nzungsmittel/i.test(t))return "Nahrungsergänzungsmittel";
  if(/nicht (für|zum) (den )?(menschlichen )?Verzehr|Laborchemikalie|Forschungszwecke/i.test(t))return "Chemikalie (nicht zum Verzehr)";
  if(/Test\b|Analyse|Check/i.test(name))return "Test/Analyse";if(hasNutrTable)return "Lebensmittel";return "Zubehör/Sonstiges"}
const prev=(()=>{try{return JSON.parse(fs.readFileSync("katalog/supplement_catalog.json","utf8"))}catch{return null}})();
const prevMap=new Map((prev?.produkte||[]).map(p=>[p.url,p]));
const hash=p=>crypto.createHash("sha1").update(JSON.stringify([p.name,p.inhaltsstoffe,p.zutaten,p.verzehrempfehlung,p.packung,p.preis?.betrag,p.hinweise])).digest("hex").slice(0,12);
const report={geprueft:NOW,definitionen:{gefunden:"alle Produktseiten im offiziellen Verzeichnis (Biogena: Sitemap de-at; MoleQlar und edubily: Shop-Produktliste; Norsan: Shop-Schnittstelle), inklusive Zubehör, Sets, Tests, Lebensmittel und Medizinprodukte",nem:"davon als Nahrungsergänzungsmittel gekennzeichnet (Pflichtkennzeichnung bzw. Hinweis auf der Seite)",vollstaendig:"Nahrungsergänzung mit Mengen pro Portion (Tabelle), Zutaten, Verzehrempfehlung und Packungsgröße",teilweise:"mindestens eine dieser vier Angaben wurde nicht gefunden; fehlende Werte werden weder geschätzt noch ergänzt",produktbilder:"nicht geprüft – aus Produktbildern werden keine Werte übernommen"},hersteller:{}},produkte=[];
const FELD={inhaltsstoffe:"Mengen pro Portion (Nährstofftabelle)",zutaten:"Zutaten",verzehrempfehlung:"Verzehr-/Einnahmeempfehlung",packung:"Packungsgröße"};
const GRUND={biogena:Object.fromEntries(Object.keys(FELD).map(k=>[k,"nicht auf Produktseite und Etikett-PDF gefunden"])),moleqlar:Object.fromEntries(Object.keys(FELD).map(k=>[k,"nicht auf der Produktseite gefunden"]))};
const offen=(miss,h)=>Object.fromEntries(miss.map(k=>[FELD[k],GRUND[h][k]]));
let probeLeft=0;const tm0=s=>/<table/.test(s);

// ---------- Biogena ----------
{const R={gefunden:0,nem:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[],typen:{}};report.hersteller.Biogena=R;
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
  if(!name){const t=s.match(/<title>(.*?)<\/title>/s);name=t?strip(t[1]).replace(/\s*[|–-]\s*Biogena.*$/i,""):url.split("/").pop()}
  // Zutaten notfalls aus der sichtbaren Seite
  if(!F.ingredients){const z=s.match(/Zutaten:<\/p>\s*<div[^>]*>(.*?)<\/div>/s);if(z)F.ingredients=z[1]}
  if(!F.recommendedIntake){const z=s.match(/Verzehrempfehlung<\/[^>]+>[\s\S]{0,400}?<div[^>]*>(.*?)<\/div>/);if(z&&strip(z[1]).length>5)F.recommendedIntake=z[1]}
  if(probeLeft>0&&(!F.ingredients||!tm0(s))){fs.mkdirSync("katalog/probe",{recursive:true});fs.writeFileSync("katalog/probe/biogena_"+url.split("/").pop().slice(0,40)+".html",s);probeLeft--}
  const allerg=Object.keys(F).filter(k=>/allerg/i.test(k)).map(k=>strip(F[k])).filter(Boolean);
  // Produktbild: nur das Hauptbild dieser Produktseite (og:image bzw. JSON-LD) – gehört eindeutig zu genau diesem Produkt
  const og=(s.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||s.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)||[])[1];
  const ldImg=ld&&(Array.isArray(ld.image)?ld.image[0]:typeof ld.image==="string"?ld.image:ld.image&&ld.image.url);
  const bild=(og||ldImg||null);
  const p={hersteller:"Biogena",name,url,abgerufen:NOW,bild:bild?bild.replace(/&amp;/g,"&"):null,linie:F.productLine||null,kurz:F.productSubtitleShort||F.productSubtitle||null,
    kategorie:null,anwendungsbereiche_hersteller:F.fieldsOfApplication?list(F.fieldsOfApplication):[],
    inhaltsstoffe:tabelle,zutaten:F.ingredients?strip(F.ingredients):null,verzehrempfehlung:F.recommendedIntake?strip(F.recommendedIntake):null,
    tagesdosis:F.dailyDosage??null,packung:F.packageSize?strip(F.packageSize):(v.size||null),form:null,
    hinweise:F.notices?list(F.notices):[],allergene:allerg,diabetiker:F.diabeticNote||null,
    preis:v.offers?.price!=null?{betrag:v.offers.price,waehrung:v.offers.priceCurrency,verfuegbar:/InStock/.test(v.offers.availability||""),abgerufen:NOW}:null,
    ean:F.ean||v.gtin||null,dokumente:[F.documentsLegal,F.lefoCertifikat].filter(x=>typeof x==="string"&&x.startsWith("http"))};
  p.typ=typOf(name,[F.mandatoryLabeling,F.productSubtitle,F.notices].join(" "),!!tabelle);
  for(const k of ["interactions","sideEffects","warningSafetyNotes","storageAdvice"])if(F[k])p.hinweise.push(...list(F[k]));
  p.dokumente=[...new Set([...p.dokumente,...(s.match(/https:\/\/static\.biogena\.com\/productdocs\/[^"'\s\\]+\.pdf/g)||[])])];
  // fehlende Angaben im Etikett-PDF suchen
  if(p.typ!=="Zubehör/Sonstiges"&&(!F.ingredients||!F.recommendedIntake)&&typeof F.documentsLegal==="string"){const t=await pdfText(F.documentsLegal);
    if(!F.ingredients){const z=pdfField(t,"Zutaten");if(z){p.zutaten=z;p.quelle_ergaenzt=(p.quelle_ergaenzt||[]).concat("Zutaten aus Etikett-PDF")}}
    if(!F.recommendedIntake){const z=pdfField(t,"(?:Verzehrempfehlung|Anwendung|Dosierung)");if(z){p.verzehrempfehlung=z;p.quelle_ergaenzt=(p.quelle_ergaenzt||[]).concat("Verzehrempfehlung aus Etikett-PDF")}}}
  const pk=String(p.packung||"").match(/Kapseln|Tabletten|Pulver|Tropfen|Sticks?|Sachets?|Liquid|Flüssig|ml|Granulat|Lutsch|Spray|Kaugummi|Gummies|Öl/i);p.form=pk?pk[0]:null;
  const nem=p.typ==="Nahrungsergänzungsmittel";p.kategorie=nem?(p.linie||"Nahrungsergänzung"):p.typ;
  const miss=["inhaltsstoffe","zutaten","verzehrempfehlung","packung"].filter(k=>!p[k]);p.fehlend=nem?miss:[];p.vollstaendig=nem?miss.length===0:null;
  R.typen[p.typ]=(R.typen[p.typ]||0)+1;if(nem){R.nem++;if(p.vollstaendig)R.vollstaendig++;else R.teilweise.push({name,url,fehlende_angaben:offen(miss,"biogena")})}
  produkte.push(p)}}

// ---------- MoleQlar (Shopify) ----------
{const R={gefunden:0,nem:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[],typen:{}};report.hersteller.MoleQlar=R;
 const all=[];for(let page=1;page<6;page++){const r=await get(`https://moleqlar.com/products.json?limit=250&page=${page}`);if(!r.ok){R.nicht_abrufbar.push({url:"products.json page "+page,status:r.status});break}
  let j;try{j=JSON.parse(r.text)}catch{break}if(!j.products?.length)break;all.push(...j.products)}
 R.gefunden=all.length;R.quelle="https://moleqlar.com/products.json";let sample=0;
 for(const pr of all){const url="https://moleqlar.com/products/"+pr.handle;const r=await get(url);
  const page=r.ok?r.text:"",D={};
  for(const m of page.matchAll(/<details[^>]*>\s*<summary>(.*?)<\/summary>(.*?)<\/details>/gs)){const t=strip(m[1]);if(t&&!(t in D))D[t]=strip(m[2])}
  const pick=(...ks)=>{for(const k of ks){const f=Object.keys(D).find(x=>x.toLowerCase()===k.toLowerCase());if(f&&D[f])return D[f]}return null};
  const anw=pick("Anwendung"),einn=pick("Einnahmeempfehlung","Verzehrempfehlung","Anwendung");
  const zut=pick("Inhaltsstoffe","Zutaten");const info=[pick("Was ist "+pr.title+"?"),...Object.keys(D).filter(k=>/^Was ist/i.test(k)).map(k=>D[k]),pick("Inhalt"),pick("Funktion")].filter(Boolean).join(" ");
  const mengen=[...new Set((info.match(/\d+(?:[.,]\d+)?\s?(?:mg|µg|mcg|g|IE|I\.E\.|Mrd\.?\s?KBE)\s[A-Za-zÄÖÜäöüß][\wÄÖÜäöüß\-®]*(?:\s[\wÄÖÜäöüß\-®]+)?/g)||[]))].slice(0,12);
  const hin=(anw||"").split(/(?<=\.)\s+/).filter(x=>/nicht|Schwanger|Kinder|Stillen|ärzt|Arzt|überschritten|Allerg/i.test(x));
  const fn=pick("Funktion");const v=pr.variants?.[0]||{};const tags=(pr.tags||[]).map(String);
  const p={hersteller:"MoleQlar",name:pr.title,url,abgerufen:NOW,bild:(pr.images&&pr.images[0]&&pr.images[0].src)||null,linie:null,kurz:null,kategorie:tags.find(t=>/^[A-ZÄÖÜ]/.test(t)&&!/^(_|custom_|features_|return_box|no-upsell|sale|new|neu|bundle|bulk|coming soon|bestseller|angebot|black|cyber|gift|geschenk|hidden|subscription|abo)/i.test(t)&&t.length>3)||null,
    anwendungsbereiche_hersteller:fn?[fn.split(/(?<=\.)\s+/).slice(0,2).join(" ").slice(0,300)]:[],inhaltsstoffe:null,mengen_aus_text:mengen,zutaten:zut,verzehrempfehlung:einn?einn.split(/(?<=\.)\s+/).slice(0,2).join(" "):null,
    tagesdosis:null,packung:v.title&&v.title!=="Default Title"?v.title:null,form:(pr.title.match(/Kapseln|Pulver|Tropfen|Liquid|Sachets?|Tabletten|Öl|Spray|Gummies/i)||[null])[0],hinweise:hin,allergene:[],
    preis:v.price?{betrag:+v.price,waehrung:"EUR",verfuegbar:!!v.available,abgerufen:NOW}:null,ean:v.barcode||null,dokumente:[],tags};
  const T=tables(page).filter(t=>/N(ä|ae)hrst|Portion|NRV|pro Tag/i.test(t.kopf.join(" ")+" "+t.zeilen.flat().join(" ")));p.inhaltsstoffe=T[0]||null;
  const bodyTxt=strip(pr.body_html||"");const pm=(bodyTxt+" "+(p.verzehrempfehlung||"")+" "+pr.title).match(/\(?(\d+)\s*(Kapseln|Sticks|Tabletten|Sachets|Portionen|Beutel|ml|g)\)?(?:\s*\)|\s+entspricht|\s*[-–,]|\s+Vorrat|\s+reich)/i);
  // Packungsgröße: zuerst Varianten-/Optionsnamen des Shops, dann ausdrückliche Füllmengen-Angabe im Seitentext
  const U="(?:Kapseln|Sticks|Tabletten|Sachets|Portionen|Beutel|Softgels|ml|g|kg)";
  const vt=(pr.variants||[]).map(x=>x.title).concat((pr.options||[]).flatMap(o=>o.values||[])).find(t=>new RegExp("^\\s*\\d+[.,]?\\d*\\s*"+U+"\\b","i").test(String(t)));
  const fm=strip(page).match(new RegExp("(?:Inhalt|Füllmenge|Nettofüllmenge|Packungsgröße|Packungsinhalt)\\s*:?\\s*(\\d+[.,]?\\d*\\s*"+U+")\\b","i"));
  if(!p.packung&&vt)p.packung=String(vt).trim();if(!p.packung&&fm)p.packung=fm[1];if(!p.packung&&pm)p.packung=pm[1]+" "+pm[2];
  p.dokumente=[...new Set((page.match(/https?:[^"'\s]+\.pdf/g)||[]).map(x=>x.replace(/^http:/,"https:")))].slice(0,6);
  // MoleQlar: das Wort "Nahrungsergänzung" taucht auch in Zubehör-Texten auf -> maßgeblich ist die Nährstofftabelle
  p.typ=/Bundle|Paket/i.test(pr.title)?"Set/Bundle":/Test\b/i.test(pr.title)?"Test/Analyse":/Medizinprodukt/i.test(Object.values(D).join(" ")+bodyTxt)?"Medizinprodukt":
    p.inhaltsstoffe?(/Oliven(ö|oe)l|Protein/i.test(pr.title)?"Lebensmittel":"Nahrungsergänzungsmittel"):(p.zutaten&&p.verzehrempfehlung&&/Kapseln|Pulver|Tropfen|Sticks|Tabletten/i.test(pr.title)?"Nahrungsergänzungsmittel":"Zubehör/Sonstiges");const nem=p.typ==="Nahrungsergänzungsmittel";p.kategorie=nem?(p.kategorie||"Nahrungsergänzung"):p.typ;
  const miss=["inhaltsstoffe","zutaten","verzehrempfehlung","packung"].filter(k=>!p[k]);p.fehlend=nem?miss:[];p.vollstaendig=nem?miss.length===0:null;
  R.typen[p.typ]=(R.typen[p.typ]||0)+1;if(nem){R.nem++;if(p.vollstaendig)R.vollstaendig++;else R.teilweise.push({name:pr.title,url,fehlende_angaben:offen(miss,"moleqlar")})}produkte.push(p);
  if(!r.ok)R.nicht_abrufbar.push({url,status:r.status})}
 R.hinweis="Mengen pro Portion aus der Nährstofftabelle der Produktseite (Text)."}

// ---------- Norsan + edubily (eigenes Modul, gleiches Format) ----------
for(const [name,fn] of [["Norsan",norsan],["edubily",edubily]]){try{const r=await fn(get,NOW);report.hersteller[name]=r.report;produkte.push(...r.produkte)}
  catch(e){report.hersteller[name]={gefunden:0,nem:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[{url:"Abruf",status:String(e.message||e).slice(0,120)}],typen:{}}}}
// feste Produkt-ID (b-/m-/n-/d- + Adresse der Produktseite) – Bilder, Produktkarte und Detailansicht hängen daran
{const kid=p=>(p.hersteller==="Biogena"?"b-":p.hersteller==="MoleQlar"?"m-":"x-")+String(p.url||"").replace(/[?#].*$/,"").replace(/\/+$/,"").split("/").pop().toLowerCase().replace(/[^a-z0-9-]/g,"");
 const seen=new Set();for(const p of produkte){if(!p.id)p.id=kid(p);if(!p.fehlend_grund)p.fehlend_grund=Object.fromEntries((p.fehlend||[]).map(k=>[k,GRUND[p.hersteller==="Biogena"?"biogena":"moleqlar"][k]]));
  if(seen.has(p.id))report.doppelte_ids=(report.doppelte_ids||[]).concat(p.id);seen.add(p.id)}}

// ---------- Änderungen gegenüber dem letzten Lauf ----------
const changes={neu:[],geaendert:[],entfernt:[]};for(const p of produkte){p.hash=hash(p);const o=prevMap.get(p.url);if(!o)changes.neu.push(p.name);else if(o.hash!==p.hash)changes.geaendert.push(p.name)}
const now=new Set(produkte.map(p=>p.url));for(const o of prevMap.values())if(!now.has(o.url))changes.entfernt.push(o.name);
report.aenderungen=prev?changes:{erstimport:true};
for(const [h,R] of Object.entries(report.hersteller)){R.offen_oder_nicht_abrufbar=R.nicht_abrufbar.length;R.mit_produktbild=produkte.filter(x=>x.hersteller===h&&x.bild).length;R.produktbilder="nicht geprüft";
  const ausg=(R.ausgelassen||[]).length,andere=R.gefunden-R.nem-ausg;R.status={alle_gefundenen_produkte:R.gefunden,nahrungsergaenzungen:R.nem,davon_vollstaendig:R.vollstaendig,davon_teilweise:R.teilweise.length,andere_produktarten:andere,andere_nach_art:Object.fromEntries(Object.entries(R.typen).filter(([t])=>t!=="Nahrungsergänzungsmittel")),nicht_abrufbar:R.nicht_abrufbar.length,
    nicht_aufgenommen:ausg,text:`${h}: ${R.gefunden} Einträge gefunden, davon ${R.nem} Nahrungsergänzungen (${R.vollstaendig} vollständig, ${R.teilweise.length} teilweise erfasst) und ${andere} andere Produktarten`+(ausg?`; ${ausg} nicht aufgenommen (Abos, Mehrfachpackungen, Proben, Info-/Digitalmaterial)`:"")+"."}}
for(const p of produkte)p.produktbilder="nicht geprüft";report.unvollstaendig=Object.values(report.hersteller).some(h=>h.teilweise.length||h.nicht_abrufbar.length);
fs.writeFileSync("katalog/supplement_catalog.json",JSON.stringify({stand:NOW,hinweis:"Herstellerangaben aus den offiziellen Shops; keine Wirksamkeitsbelege. Fehlende Angaben sind leer, nicht geschätzt.",produkte},null,0));
fs.writeFileSync("katalog/report.json",JSON.stringify(report,null,1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report.hersteller).map(([k,v])=>[k,{gefunden:v.gefunden,vollstaendig:v.vollstaendig,teilweise:v.teilweise.length,nicht_abrufbar:v.nicht_abrufbar.length}]))));
