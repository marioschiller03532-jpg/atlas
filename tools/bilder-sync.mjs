// Produktbilder für den Offline-Betrieb: lädt das Hauptbild jedes Katalogprodukts, verschlüsselt es und legt es neben den Katalog.
// Verschlüsselung: pro Lauf ein zufälliger AES-256-GCM-Schlüssel, der mit dem öffentlichen RSA-Schlüssel (tools/bilder-public.pem) verpackt wird.
// Nur Atlas mit dem privaten Schlüssel (in der verschlüsselten Wissensbibliothek) kann die Bilder öffnen. Bereits geladene Bilder werden übersprungen.
import fs from "node:fs";import crypto from "node:crypto";
const UA="Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const katId=p=>p.id||(p.hersteller==="Biogena"?"b-":p.hersteller==="MoleQlar"?"m-":"x-")+String(p.url||"").replace(/[?#].*$/,"").replace(/\/+$/,"").split("/").pop().toLowerCase().replace(/[^a-z0-9-]/g,"");
const kat=JSON.parse(fs.readFileSync("katalog/supplement_catalog.json","utf8"));
const DIR="katalog/bilder",IDX=DIR+"/index.json";fs.mkdirSync(DIR,{recursive:true});
const idx=fs.existsSync(IDX)?JSON.parse(fs.readFileSync(IDX,"utf8")):{v:1,keys:{},bilder:{}};
const pub=fs.readFileSync("tools/bilder-public.pem","utf8");
const dataKey=crypto.randomBytes(32),kid=crypto.createHash("sha1").update(dataKey).digest("hex").slice(0,10);
const wrapped=crypto.publicEncrypt({key:pub,padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,oaepHash:"sha256"},dataKey).toString("base64");
let neu=0,fehler=[],gleich=0;const ids=new Set();
const todo=kat.produkte.filter(p=>p.bild);
for(const p of todo){const id=katId(p);ids.add(id);const old=idx.bilder[id];if(old&&old.url===p.bild&&fs.existsSync(DIR+"/"+old.f)){gleich++;continue}
  try{let r;for(let t=0;t<4;t++){r=await fetch(p.bild,{headers:{"user-agent":UA,"accept":"image/avif,image/webp,image/png,image/jpeg,image/*"}});await sleep(/cdn\.shopify\.com/.test(p.bild)?1200:250);
      if(r.status!==403&&r.status!==429)break;await sleep([15000,45000,90000][t]||90000)}   // Shopify-CDN drosselt: warten und erneut versuchen
    if(!r.ok)throw new Error("HTTP "+r.status);const typ=(r.headers.get("content-type")||"image/jpeg").split(";")[0];if(!/^image\//.test(typ))throw new Error("kein Bild: "+typ);
    const buf=Buffer.from(await r.arrayBuffer());if(buf.length<500||buf.length>3e6)throw new Error("Größe "+buf.length);
    const iv=crypto.randomBytes(12),c=crypto.createCipheriv("aes-256-gcm",dataKey,iv),ct=Buffer.concat([c.update(buf),c.final(),c.getAuthTag()]);
    const f=id+".bin";fs.writeFileSync(DIR+"/"+f,Buffer.concat([iv,ct]));idx.bilder[id]={f,kid,typ,url:p.bild,name:p.name,hersteller:p.hersteller,bytes:buf.length};neu++}
  catch(e){fehler.push({id,name:p.name,grund:String(e.message||e).slice(0,120)})}}
if(neu)idx.keys[kid]=wrapped;
// Bilder entfernter Produkte aufräumen
for(const id of Object.keys(idx.bilder))if(!ids.has(id)){try{fs.unlinkSync(DIR+"/"+idx.bilder[id].f)}catch{}delete idx.bilder[id]}
const used=new Set(Object.values(idx.bilder).map(b=>b.kid));for(const k of Object.keys(idx.keys))if(!used.has(k))delete idx.keys[k];
idx.stand=new Date().toISOString();idx.bericht={produkte_mit_bildadresse:todo.length,gespeichert:Object.keys(idx.bilder).length,neu,unveraendert:gleich,fehler};
fs.writeFileSync(IDX,JSON.stringify(idx,null,1));
console.log(JSON.stringify(idx.bericht).slice(0,500));
