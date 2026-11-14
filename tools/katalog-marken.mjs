// Norsan (WooCommerce-Shop norsan.de) und edubily (Shopify-Shop edubily.de) für den Atlas-Katalog.
// Gleiches Produktformat wie Biogena/MoleQlar. Nur Angaben, die als Text auf den Herstellerseiten stehen – nichts geschätzt.
// Nährwerttabellen liegen bei beiden Herstellern nur als Bild vor: diese Mengen werden NICHT übernommen, sondern als fehlend markiert.
const ent=s=>String(s||"").replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi,(m,n)=>String.fromCharCode(parseInt(n,16)))
  .replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&rsquo;|&lsquo;/g,"'").replace(/&ndash;/g,"–").replace(/&mdash;/g,"—").replace(/&lt;/g,"<").replace(/&gt;/g,">");
const txt=h=>ent(String(h||"").replace(/<(script|style)[\s\S]*?<\/\1>/gi," ").replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," ")).replace(/\s+/g," ").trim();
const slug=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ß/g,"ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const sentences=t=>String(t||"").split(/(?<!\b(?:ca|bzw|inkl|evtl|Nr|sp|max|min|z\.\s?B|d\.\s?h|u\.\s?a|I\.\s?E|Tel)\.)(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9])/).map(x=>x.trim()).filter(Boolean);
// Pflichthinweise für Nahrungsergänzungsmittel (Nahrungsergänzungsmittelverordnung) als Beleg für die Produktart
const NEMTXT=/Nahrungsergänzung|kein Ersatz für eine (?:ausgewogene|abwechslungsreiche)|(?:Tagesdosis|Verzehrmenge|Verzehrempfehlung) (?:darf|sollte) nicht überschritten/i;
const UNIT=/\d[\d.,]*\s?(?:mg|µg|μg|mcg|g|I\.\s?E\.|IE|ml)(?![a-zA-Zäöü])/;
const clip=(s,n=260)=>{s=String(s).trim();return s.length>n?s.slice(0,n-1).replace(/\s\S*$/,"")+" …":s};
const uniq=a=>[...new Set(a.filter(Boolean))];
const FELD={inhaltsstoffe:"Mengen pro Portion (Nährstofftabelle)",zutaten:"Zutaten",verzehrempfehlung:"Verzehr-/Einnahmeempfehlung",packung:"Packungsgröße"};
const BILDTAB="nur als Bild (Nährwerttabelle) auf der Herstellerseite – nicht als Text übernommen";
function finish(p,R,grund){if(!p.form&&/\d\s?ml$/.test(p.packung||"")&&p.typ!=="Zubehör/Sonstiges")p.form="flüssig";const nem=p.typ==="Nahrungsergänzungsmittel";const miss=["inhaltsstoffe","zutaten","verzehrempfehlung","packung"].filter(k=>!p[k]);
  p.fehlend=nem?miss:[];p.fehlend_grund=Object.fromEntries(p.fehlend.map(k=>[k,grund[k]||"nicht auf der Produktseite gefunden"]));p.vollstaendig=nem?miss.length===0:null;
  R.typen[p.typ]=(R.typen[p.typ]||0)+1;if(nem){R.nem++;if(p.vollstaendig)R.vollstaendig++;else R.teilweise.push({name:p.name,url:p.url,fehlende_angaben:Object.fromEntries(p.fehlend.map(k=>[FELD[k],p.fehlend_grund[k]]))})}
  return p}
const formOf=(name,t)=>/Jell(y|ies)/i.test(name)?"Fruchtgummi (Jelly)":/Fruchtgumm/i.test(name+" "+t)?"Fruchtgummis":/Kapseln|Softgels?/i.test(name)?"Kapseln":/Tropfen/i.test(name)||/pro Tropfen/i.test(t)?"Tropfen":/Pulver/i.test(name)?"Pulver":
  /Sticks?\b/i.test(name)?"Sticks":/\bÖl\b|Oel\b/i.test(name)?"Öl (flüssig)":/Riegel|Bar\b/i.test(name)?"Riegel":null;

// ---------------- Norsan ----------------
export async function norsan(get,NOW){
  const R={gefunden:0,nem:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[],ausgelassen:[],typen:{},quelle:"https://norsan.de/wp-json/wc/store/v1/products (offizieller Shop, Preise Deutschland)"};const out=[];
  const all=[];for(let page=1;page<6;page++){const r=await get(`https://norsan.de/wp-json/wc/store/v1/products?per_page=100&page=${page}`);if(!r.ok){if(page===1)R.nicht_abrufbar.push({url:"Store-API Seite "+page,status:r.status});break}
    let j;try{j=JSON.parse(r.text)}catch{break}if(!Array.isArray(j)||!j.length)break;all.push(...j);if(j.length<100)break}
  R.gefunden=all.length;
  const skip=(pr,name)=>{const cats=(pr.categories||[]).map(c=>ent(c.name)).join("|");
    if(/subscription/.test(pr.type)||/\bAbo\b/i.test(name))return "Abo-Variante eines vorhandenen Produkts";
    if(/3\s?[’']?er|Multipack/i.test(name)||/3er box/i.test(cats))return "Mehrfachpackung eines vorhandenen Produkts";
    if(/Beratungsmaterial|Bücher|Ausbildung|Fachartikel|Dekoration/i.test(cats)||/^(Buch|Broschüre|Flyer|Fachartikel|Rezept|Plakat|Leseprobe)|Freundebuch|Segelschein/i.test(name))return "kein Produkt zum Einnehmen (Info-/Fachmaterial, Buch, Kurs)";
    if(!+pr.prices?.price&&!pr.is_purchasable)return "im Shop nicht bestellbar, keine Produktangaben";
    if(!+pr.prices?.price)return "Aktions-/Gratisartikel ohne eigene Produktangaben";return null};
  for(const pr of all){const name=ent(pr.name).replace(/\s+/g," ").trim();const why=skip(pr,name);if(why){R.ausgelassen.push({name,grund:why});continue}
    const D=txt(pr.description),SD=txt(pr.short_description),ALL=SD+" "+D;
    // Rubriken stehen im Tab „Nährwerte & Hinweise“ (Omega-3) bzw. „Inhalts- und Wirkstoffe“ (NÀDARRA) – nur dort suchen, nicht in Werbetext/FAQ
    const st=Math.max(D.lastIndexOf("Nährwerte & Hinweise Inhaltsstoffe"),D.lastIndexOf("Inhalts- und Wirkstoffe"));const SEC=st>=0?D.slice(st):"";
    const sec=re=>{const m=SEC.match(re);return m&&m[1].length<1200?m[1].trim():null};
    let zut=sec(/Inhaltsstoffe\s+(.+?)\s+Einnahme\s/i)||sec(/Zutaten:\s*(.+?)\s+(?:Aktive?r?\s+Wirkstoff|Verzehrempfehlung)/i);
    let einn=/Verzehrempfehlung\s*&\s*Lagerhinweise/.test(SEC)?sec(/Verzehrempfehlung\s*&\s*Lagerhinweise\s+(.+?)\s+(?:Laboranalysen|Laborberichte|Häufige Fragen)\s/i):sec(/Einnahme\s+(.+?)\s+(?:Aufbewahrung|Laborzertifikate|Häufige Fragen)\s/i);
    const aufb=sec(/Aufbewahrung\s+(.+?)\s+(?:Laborzertifikate|Häufige Fragen|Angenehme|Laboranalysen)\s/i)||"";
    const eS=sentences(einn||"");
    const verz=einn?clip(eS.filter(s=>!/Kontaktieren|Telefon|Haben Sie Fragen|optimal verwerten|gewährleistet/i.test(s)).slice(0,4).join(" "),420):null;
    const hin=uniq(sentences(einn+" "+aufb).filter(s=>/Schwanger|Stillend|Kinder unter|nicht überschritten|Arzt|abführend|gerinnungs|Medikament|unter 3 Jahren|ab 3 Jahren|Kühlschrank|verbraucht werden/i.test(s)).map(s=>clip(s,220))).slice(0,6);
    const DOSE=/Tagesdos|pro Tag|täglich|pro Tropfen|pro Portion|enthält/i,NODOSE=/Health Claims|trägt zu|nachweislich|Defizit|Mangel auszugleichen|Polyphenol|Quelle:|Schwanger|Stillend|therapeutisch|rechtlichen Bestimmungen|Ein Großteil|Zufuhr ist|Inhaltsstoffe|kurzfristige|Jod-Gehalt/i;
    const dose=uniq([...(SD.match(/\d[\d.,]*\s?(?:mg|I\.E\.)[^.]{0,60}?pro (?:Tagesdosis|Tropfen)(?:\s\([^)]*\))?/g)||[]),
      ...sentences(D).filter(s=>UNIT.test(s)&&DOSE.test(s)&&!NODOSE.test(s)).map(s=>s.replace(/^.*?\b\d[\d.]*\s?MG OMEGA-3 PRO TAGESDOSIS\s+/i,""))].map(s=>clip(s,240))).slice(0,4);
    const tdoseS=dose.find(s=>/Tagesdos/i.test(s))||null;
    const pk=(D.match(/In einer (?:Dose|Flasche|Packung) sind (\d+\s?(?:Kapseln|ml|Stück))/i)||D.match(/Inhalt:\s*(\d+\s?ml(?: entsprechen \d+ Tropfen)?)/i)||name.match(/(\d+)er Packung/)&&[0,name.match(/(\d+)er Packung/)[1]+" Stück"]||D.match(/\((\d+ Stück)\)/)||(!/Kapseln|Jelly|Set\b|Trio/i.test(name)&&[...D.matchAll(/\((\d+)\s?ml\)/g)].map(m=>[0,m[1]+" ml"]).find(m=>parseInt(m[1])>=30))||[])[1]||null;
    let typ=/\bSet\b|Power Trio|Check-up/i.test(name)?"Set/Bundle":/Analyse/i.test(name)?"Test/Analyse":/Olivenöl|OLIVENÖL/i.test(name)?"Lebensmittel":NEMTXT.test(ALL)?"Nahrungsergänzungsmittel":"Zubehör/Sonstiges";
    const imgs=(pr.images||[]).map(i=>i.src).filter(u=>!/N(ae|ä)hrwert|Infografik|Labor|\.svg$/i.test(u));
    const price=pr.prices?{betrag:+pr.prices.price/10**(pr.prices.currency_minor_unit??2),waehrung:pr.prices.currency_code||"EUR",verfuegbar:!!pr.is_in_stock,abgerufen:NOW,hinweis:"Shoppreis norsan.de (Deutschland)"}:null;
    const base={hersteller:"Norsan",name,url:pr.permalink,abgerufen:NOW,bild:imgs[0]||null,linie:((pr.categories||[]).map(c=>ent(c.name)).find(c=>/^Omega-3 |^nadarra$/i.test(c))||null),kurz:null,
      kategorie:null,anwendungsbereiche_hersteller:[],inhaltsstoffe:null,mengen_aus_text:dose,zutaten:zut?clip(zut,700):null,verzehrempfehlung:verz,tagesdosis:tdoseS,packung:pk,form:formOf(name,D)||(/\d\s?ml\b|Teelöffel|Esslöffel/i.test(einn||"")&&!/Set\b|Trio|Check-up/i.test(name)?"Öl (flüssig)":null),
      hinweise:hin,allergene:[],preis:price,ean:pr.sku||null,dokumente:[],quelle_ergaenzt:[]};
    if(/NÀDARRA|NADARRA/i.test(name))base.linie="NÀDARRA (Vertrieb über Norsan)";
    base.kategorie=typ==="Nahrungsergänzungsmittel"?(/Vitamin D/i.test(name)?"Vitamin D":/Magnes/i.test(name)?"Magnesium":"Omega-3"):typ;
    const grund={inhaltsstoffe:BILDTAB,zutaten:"nicht als Text auf der Produktseite",verzehrempfehlung:"nicht als Text auf der Produktseite",packung:"nicht als Text auf der Produktseite"};
    // Varianten mit anderer Zusammensetzung/Geschmack als eigene Produkte (gleicher Preis laut Shop)
    const vars=(pr.variations||[]).filter(v=>v.attributes&&v.attributes.length);
    if(pr.type==="variable"&&vars.length>1){for(const v of vars){const a=v.attributes[0],val=ent(a.value);
        const p={...base,name:`${name} (${val})`,url:`${pr.permalink}?attribute_${slug(a.name)}=${encodeURIComponent(a.value)}`,variante:{[ent(a.name)]:val},typ,
          hinweise:[...base.hinweise],quelle_ergaenzt:["Variante des Shop-Produkts "+name+"; Zutatenliste gilt laut Herstellerseite für alle Varianten"]};
        if(/ohne Vitamin D3/i.test(val)&&p.zutaten&&/Cholecalciferol/i.test(p.zutaten))p.hinweise.unshift("Achtung: Die Zutatenliste der Herstellerseite nennt Cholecalciferol (Vitamin D3) – sie gilt für beide Varianten; für „ohne Vitamin D3“ nicht variantengenau.");
        p.id="n-"+slug(pr.slug)+"-"+slug(val);out.push(finish(p,R,grund))}}
    else{const p={...base,typ};p.id="n-"+slug(pr.slug);out.push(finish(p,R,grund))}}
  R.hinweis="Zutaten, Einnahme und Hinweise als Text von der Produktseite. Mengen pro Portion stehen dort nur in einer Bild-Tabelle: übernommen werden nur ausdrücklich im Text genannte Mengen (z. B. „Tagesdosis enthält …“).";
  return {produkte:out,report:R}}

// ---------------- edubily ----------------
export async function edubily(get,NOW){
  const R={gefunden:0,nem:0,vollstaendig:0,teilweise:[],nicht_abrufbar:[],ausgelassen:[],typen:{},quelle:"https://edubily.de/products.json (offizieller Shop) + Produktseiten"};const out=[];
  const all=[];for(let page=1;page<6;page++){const r=await get(`https://edubily.de/products.json?limit=250&page=${page}`);if(!r.ok){if(page===1)R.nicht_abrufbar.push({url:"products.json Seite "+page,status:r.status});break}
    let j;try{j=JSON.parse(r.text)}catch{break}if(!j.products?.length)break;all.push(...j.products);if(j.products.length<250)break}
  R.gefunden=all.length;
  for(const pr of all){const name=ent(pr.title).replace(/\s+/g," ").trim(),tags=(pr.tags||[]).map(String);
    if(tags.includes("digital")||/Gutschein/i.test(pr.product_type+" "+name)){R.ausgelassen.push({name,grund:"kein physisches Produkt (E-Book, Kurs, Gutschein)"});continue}
    if(/\bProben?\b|Probierpaket|Day Pack/i.test(name)){R.ausgelassen.push({name,grund:"Probiergröße eines vorhandenen Produkts"});continue}
    const url="https://edubily.de/products/"+pr.handle;const r=await get(encodeURI(url));if(!r.ok)R.nicht_abrufbar.push({url,status:r.status});
    const page=r.ok?r.text:"";const FAQ=[];let ldDesc="";
    for(const m of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){let j;try{j=JSON.parse(m[1])}catch{continue}
      if(j["@type"]==="FAQPage")for(const q of j.mainEntity||[])FAQ.push({q:ent(q.name).trim(),a:txt(q.acceptedAnswer?.text)});
      if(j["@type"]==="Product"&&j.description)ldDesc=txt(j.description)}
    const body=txt(pr.body_html)||ldDesc,faqTxt=FAQ.map(f=>f.a).join(" "),ALL=body+" "+faqTxt;
    const fq=re=>{const f=FAQ.find(x=>re.test(x.q));return f?f.a:null};
    const einn=fq(/eingenommen|einnehmen|Einnahme|dosier|Verzehr|anwenden|Anwendung|verwende|zubereit/i);
    const zutM=(txt(page).match(/Zutaten:?\s+([^.]{10,600}\.)/)||[])[1]||null;
    const hin=uniq([...sentences(fq(/beachten|Hinweis|Warnhinweis/i)||""),...sentences(faqTxt).filter(s=>/Schwanger|Stillzeit|Kinder|ab \d+ Jahren|Arzt|Medikament|nicht überschritten|Kühlschrank/i.test(s))].map(s=>clip(s,220))).slice(0,6);
    const dose=uniq([body,...FAQ.map(f=>f.a)].flatMap(t=>sentences(t.replace(/(\d)\s*(mg|µg|μg)(?=[A-ZÄÖÜ\d])/g,"$1 $2 · "))).filter(s=>UNIT.test(s)&&/enthält|enthalten|pro (Tagesdos|Portion|Kapsel|Tropfen|ml|Messlöffel|Stick)|Tagesdos|je Kapsel|in \d+ Kapseln/i.test(s)&&!/Zufuhr|Weltbevölkerung|Studie|Forsch|Probanden|empfiehlt|Referenzwert|legen nahe|Bedarf|Index|optimal|Lebensmittel|Fisch|Nahrung|Fleisch|\bEi\b|Eies|Tasse|Ernährung|Synthese|Quellen|pro 100 g/i.test(s)&&/Kapsel|Portion|Tagesdosis|Tropfen|Messlöffel|Stick|\bunser|Produkt|1 ml Öl/i.test(s)).map(s=>clip(s,240))).slice(0,4);
    let typ=/Bundle|Routine/i.test(name)?"Set/Bundle":/Shaker|Tasse|Pillenbox|Nachfülldose/i.test(name)?"Zubehör/Sonstiges":
      NEMTXT.test(ALL+" "+txt(page).slice(0,200000))&&!/Protein|Whey|Bar\b|Beef|Casein|Riegel/i.test(name)?"Nahrungsergänzungsmittel":
      /Protein|Whey|Bar\b|Beef|Casein|Riegel|Proteinwasser|Clear Vegan/i.test(name)||/Whey|Eiweiß|Clear-Whey/i.test(pr.product_type||"")?"Lebensmittel":"Produktart nicht angegeben";
    const grund={inhaltsstoffe:BILDTAB,zutaten:"nur als Bild (Inhalt & Nährwerte) auf der Herstellerseite – nicht als Text übernommen",verzehrempfehlung:"nicht als Text auf der Produktseite",packung:"nicht im Shop angegeben"};
    const V=(pr.variants||[]).map(v=>({t:String(v.title).replace(/\s+/g," ").trim(),p:+v.price,a:!!v.available}));
    const opt=(pr.options||[])[0]||{},splitBy=/^(Variante|Darreichungsform)$/i.test(String(opt.name).trim())&&new Set(V.map(v=>v.t.split(" - ")[0].trim())).size>1;
    const groups=splitBy?[...new Set(V.map(v=>v.t.split(" - ")[0].trim()))].map(g=>({g,V:V.filter(v=>v.t.split(" - ")[0].trim()===g)})):[{g:null,V}];
    for(const G of groups){const sizes=uniq(G.V.map(v=>(v.t.match(/(\d+\s?(?:x\s?\d+\s?)?(?:Kapseln|g|ml|Sticks|Fruchtgummis|Tropfen|Fächer)(?: Tropfen)?)\b/i)||[])[1]));
      const flav=uniq(G.V.map(v=>v.t.split(" / ").length>1?v.t.split(" / ")[0]:null));
      const pk=sizes.length?sizes.join(" / "):(G.V.length===1&&G.V[0].t!=="Default Title"&&/\d/.test(G.V[0].t)?G.V[0].t:null);
      const v0=G.V[0]||{};const nm=G.g?`${name} (${G.g.replace(/\s*\(.*?\)\s*/g," ").trim()})`:name;
      const p={hersteller:"edubily",name:nm,url:G.g?url+"?variant="+(pr.variants.find(v=>String(v.title).startsWith(G.g))||{}).id:url,abgerufen:NOW,bild:pr.images?.[0]?.src||null,linie:/Vitasauri/i.test(name)?"Vitasauri (Kinder)":/BLU100/i.test(pr.handle)?"BLU100":null,kurz:null,
        kategorie:pr.product_type||null,anwendungsbereiche_hersteller:[],inhaltsstoffe:null,mengen_aus_text:dose,zutaten:zutM?clip(zutM,700):null,verzehrempfehlung:einn?clip(einn,420):null,
        tagesdosis:dose.find(s=>/Tagesdos|pro Tag/i.test(s))||null,packung:pk,form:formOf(nm+" "+(G.g||"")+" "+V.map(v=>v.t).join(" "),ALL),hinweise:hin,allergene:[],
        preis:v0.p?{betrag:v0.p,waehrung:"EUR",verfuegbar:v0.a,abgerufen:NOW,hinweis:G.V.length>1?"für "+v0.t:"Shoppreis edubily.de"}:null,
        varianten:G.V.length>1?G.V.map(v=>({variante:v.t,preis:v.p})):null,geschmack:flav.length?flav:null,ean:null,dokumente:[],typ,quelle_ergaenzt:G.g?["Variante „"+G.g+"“ des Shop-Produkts "+name]:[]};
      if(typ==="Produktart nicht angegeben")p.hinweise.unshift("Produktart (z. B. Nahrungsergänzungsmittel) steht nicht als Text auf der Produktseite.");
      p.id="d-"+slug(pr.handle)+(G.g?"-"+slug(G.g.replace(/\(.*?\)/g,"")):"");out.push(finish(p,R,grund))}}
  R.hinweis="Einnahme und Hinweise aus den Fragen & Antworten der Produktseite; Mengen nur, wo sie im Text stehen. Zutaten und Nährwerttabelle zeigt edubily nur als Bild – daher als fehlend markiert.";
  return {produkte:out,report:R}}
