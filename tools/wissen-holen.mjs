// Wissensquellen für Atlas aktualisieren (läuft auf GitHub, nicht im iPad).
// Holt den öffentlichen RSS-Feed, ergänzt NEUE Folgen (Titel, Nummer, Datum, Link, kurzer Auszug, Themen, Studienlinks)
// und lässt bereits aufbereitete Folgen unverändert. Keine Audiodateien, keine vollständigen Texte.
// Aufruf: node tools/wissen-holen.mjs [roh]   (roh = Rohdaten zur einmaligen Aufbereitung nach wissen/_roh/)
import fs from "node:fs";
const QUELLEN=JSON.parse(fs.readFileSync("wissen/quellen.json","utf8")).quellen;
const UA="Mozilla/5.0 (compatible; AtlasWissen/1.0; privater Assistent)";
const ent=s=>String(s||"").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,"$1").replace(/&#(\d+);/g,(m,n)=>String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi,(m,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&quot;/g,'"').replace(/&apos;|&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ").replace(/&amp;/g,"&");
const txt=h=>ent(ent(h)).replace(/<br\s*\/?>|<\/p>|<\/li>/gi,"\n").replace(/<[^>]+>/g," ").replace(/[ \t]+/g," ").replace(/\n\s*\n+/g,"\n").trim();
const tag=(x,t)=>{const m=x.match(new RegExp("<"+t+"(?:\\s[^>]*)?>([\\s\\S]*?)</"+t+">","i"));return m?m[1]:""};
const attr=(x,t,a)=>{const m=x.match(new RegExp("<"+t+"\\s[^>]*"+a+'="([^"]+)"',"i"));return m?ent(m[1]):null};
const THEMEN={"Schlaf":/schlaf|insomn|melatonin|nachtruhe|einschlaf|durchschlaf/i,"Müdigkeit/Energie":/müdigkeit|müde|energie|erschöpf|fatigue|mitochondri|leistungstief/i,"NAD+":/\bNAD\b|NAD\+|NMN|nicotinamid/i,"Infusionen":/infusion|vitamin-?c-?hochdosis|intravenös|\biv\b/i,"Supplements":/supplement|nahrungsergänzung|vitamin|mineral|magnesium|omega|kreatin|zink|präparat/i,
  "Training":/training|muskel|krafttraining|cardio|ausdauer|sport|laufen|hiit|vo2/i,"Ernährung":/ernährung|essen|fasten|diät|keto|protein|zucker|kohlenhydrat|darm|mikrobiom/i,"Fokus":/fokus|konzentration|kognitiv|gehirn|nootrop|gedächtnis|produktiv/i,"Stress":/stress|cortisol|atem|meditation|nervensystem|vagus|entspann/i,"Hormone":/hormon|testosteron|östrogen|schilddrüse|cortisol|insulin|wechseljahr/i,
  "Regeneration":/regeneration|erholung|recovery|hrv|sauna|kälte|eisbad|massage/i,"Licht":/licht|rotlicht|sonne|blaulicht|uv/i,"Kälte/Wärme":/kälte|eisbad|sauna|hitze|kryo/i,"Langlebigkeit":/longevity|langlebig|altern|biologisches alter|lebensspanne/i,"Messen/Tracking":/messen|tracking|wearable|blutwert|labor|test|hrv|glukose/i};
const STUDIE=/pubmed|ncbi\.nlm|doi\.org|sciencedirect|nature\.com|thelancet|jamanetwork|bmj\.com|frontiersin|mdpi\.com|springer|wiley|cell\.com|nejm|plos/i;
const out={};for(const q of QUELLEN){const r=await fetch(q.feed,{headers:{"user-agent":UA}});if(!r.ok){console.log(q.id,"HTTP",r.status);continue}const xml=await r.text();
  const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m=>m[1]);const roh=[];
  for(const it of items){const titel=txt(tag(it,"title")),beschr=txt(tag(it,"description")||tag(it,"itunes:summary")||tag(it,"content:encoded")).split(/Rabatte unserer Partner|Werbung:|Anzeige:/i)[0].trim();
    const nr=+(txt(tag(it,"itunes:episode"))||(titel.match(/^#?\s*0*(\d{1,4})\b/)||[])[1]||0)||null;
    const links=[...new Set([...ent(tag(it,"description")+" "+tag(it,"content:encoded")).matchAll(/https?:\/\/[^\s"'<>)]+/g)].map(m=>m[0].replace(/[.,;:]+$/,"")))];
    roh.push({nr,titel:titel.replace(/^#?\s*0*\d{1,4}\s*[:.\-–]\s*/,""),datum:new Date(txt(tag(it,"pubDate"))).toISOString().slice(0,10),link:txt(tag(it,"link"))||null,guid:txt(tag(it,"guid")),
      transkript:attr(it,"podcast:transcript","url"),dauer:txt(tag(it,"itunes:duration"))||null,beschreibung:beschr,links,
      themen:Object.entries(THEMEN).filter(([k,re])=>re.test(titel+" "+beschr)).map(([k])=>k),studien:links.filter(u=>STUDIE.test(u))})}
  out[q.id]=roh;console.log(q.id,"Folgen:",roh.length,"mit Transkript:",roh.filter(x=>x.transkript).length)}
if(process.argv[2]==="roh"){fs.mkdirSync("wissen/_roh",{recursive:true});for(const [id,r] of Object.entries(out))fs.writeFileSync(`wissen/_roh/${id}.json`,JSON.stringify(r,null,1));process.exit(0)}
// Aktualisieren: NEUE Folgen ergänzen – nur Kurzauszug aus den Shownotes, als „noch nicht aufbereitet“ markiert.
// Bereits aufbereitete Folgen (eigene Kurzfassung) bleiben unverändert; nur ein fehlender Transkript-Link wird nachgetragen.
for(const q of QUELLEN){const roh=out[q.id];if(!roh)continue;const f=`wissen/${q.id}.json`;const D=fs.existsSync(f)?JSON.parse(fs.readFileSync(f,"utf8")):{quelle:q.id,folgen:[]};
  const idx=new Map();for(const x of D.folgen){if(x.guid)idx.set(x.guid,x);if(x.link)idx.set(x.link,x)}let neu=0;
  for(const r of roh){const alt=idx.get(r.guid)||idx.get(r.link);if(alt){if(!alt.transkript_link&&r.transkript)alt.transkript_link=r.transkript;continue}
    neu++;const kurz=r.beschreibung.replace(/\s+/g," ").slice(0,240).replace(/\s\S*$/,"")+(r.beschreibung.length>240?" …":"");
    D.folgen.push({id:`w-${q.kurz}-${r.nr??r.guid.replace(/[^a-z0-9]/gi,"").slice(-8).toLowerCase()}`,nr:r.nr,titel:r.titel,datum:r.datum,link:r.link,guid:r.guid,format:null,themen:r.themen,
      zusammenfassung:null,auszug_shownotes:kurz,aussagen:[],unsicherheiten:["Noch nicht aufbereitet – nur automatischer Auszug aus der Folgenbeschreibung."],kommerziell:null,
      studien:r.studien.map(u=>({url:u})),transkript_link:r.transkript||null,grundlage:"nur Shownotes-Auszug (automatisch, nicht aufbereitet)",vollstaendig:false,aufbereitet:false})}
  D.folgen.sort((a,b)=>(b.datum||"").localeCompare(a.datum||""));D.stand=new Date().toISOString().slice(0,10);D.anzahl=D.folgen.length;
  fs.writeFileSync(f,JSON.stringify(D));console.log(q.id,"neu:",neu,"gesamt:",D.folgen.length)}
