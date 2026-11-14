// Atlas Service Worker – Offline-Start. Version wird beim Bauen eingesetzt; jede neue App-Version = neuer Service Worker.
// Sicher aktualisieren: Die neue App-Oberfläche wird erst komplett geladen und geprüft, dann wird umgeschaltet.
// Schlägt der Download fehl, bleibt die alte, funktionierende Offline-Version unangetastet.
const VERSION="20261114-2230";
const SHELL="atlas-app-"+VERSION;   // App-Oberfläche dieser Version (index.html enthält alles: Code, Stil, Symbol)
const DATEN="atlas-daten-v1";       // Katalog, Bild-Verzeichnis, Wissensbibliothek (verschlüsselt), Bild-Zuordnung – je 1 Kopie
// Produktbilder/Nährwerttabellen verwaltet Atlas selbst im Speicher „atlas-bilder-v1“ (verschlüsselt, mit Schlüssel-Kennung).
const DATA=["kb.enc","katalog/supplement_catalog.json","katalog/bilder/index.json","produktbilder/zuordnung.json"];
const base=()=>new URL(self.registration.scope);

// Eine Datei gilt nur als gültig, wenn sie vollständig und lesbar ist – sonst wird die alte Kopie behalten.
async function valid(rel,res){try{if(!res||!res.ok)return false;
  if(rel==="kb.enc"){const t=(await res.text()).trim();return t.length>1000&&/^[A-Za-z0-9+/=]+$/.test(t)}
  const j=await res.json();
  if(rel==="katalog/supplement_catalog.json")return Array.isArray(j.produkte)&&j.produkte.length>0;
  if(rel==="katalog/bilder/index.json")return !!(j.bilder&&j.keys&&Object.keys(j.bilder).length);
  return typeof j==="object"&&j!==null}catch{return false}}

self.addEventListener("install",e=>{e.waitUntil((async()=>{
  const r=await fetch(new URL("./?sw="+VERSION,base()),{cache:"reload"});
  if(!r.ok)throw new Error("App-Datei nicht geladen: "+r.status);
  const t=await r.clone().text();
  // nur die passende, vollständige Version übernehmen (nicht eine veraltete Kopie vom Server-Zwischenspeicher)
  if(!t.includes('APP_VERSION="'+VERSION+'"')||!/<\/html>\s*$/i.test(t))throw new Error("App-Datei unvollständig oder veraltet");
  const c=await caches.open(SHELL);await c.put(new URL("./",base()),new Response(t,{headers:{"content-type":"text/html; charset=utf-8"}}));
  const d=await caches.open(DATEN);
  for(const rel of DATA){try{const u=new URL(rel,base());if(await d.match(u))continue;const x=await fetch(u,{cache:"no-store"});if(await valid(rel,x.clone()))await d.put(u,x)}catch{}}
  await self.skipWaiting()})())});

self.addEventListener("activate",e=>{e.waitUntil((async()=>{
  // erst jetzt (neue Version vollständig da) die alten App-Versionen löschen
  for(const k of await caches.keys())if(k.startsWith("atlas-app-")&&k!==SHELL)await caches.delete(k);
  await self.clients.claim()})())});

self.addEventListener("message",e=>{if(e.data==="version")e.source&&e.source.postMessage({sw:VERSION})});

self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  const b=base();if(!u.pathname.startsWith(b.pathname))return;const rel=u.pathname.slice(b.pathname.length);
  if(r.mode==="navigate"){if(rel===""||rel==="index.html")e.respondWith(nav(r));return}   // Rückfall-Versionen (alt/…) normal laden
  if(DATA.includes(rel))e.respondWith(daten(r,rel));
  // alles andere (version.json, Bilder, Claude, Hersteller) geht unverändert ans Netz bzw. an Atlas' eigenen Speicher
});

// App öffnen: mit Internet die aktuelle Seite (max. 4 s warten), sonst die gespeicherte Offline-Version
async function nav(r){try{const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),4000);const x=await fetch(r,{signal:ctl.signal});clearTimeout(t);if(x.ok)return x;throw 0}
  catch{const c=await caches.open(SHELL);let m=await c.match(new URL("./",base()));
    if(!m)for(const k of await caches.keys())if(k.startsWith("atlas-app-")){m=await (await caches.open(k)).match(new URL("./",base()));if(m)break}
    return m||new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><body style="background:#05080b;color:#cfe;font:17px system-ui;padding:40px;text-align:center"><h2>Atlas ist offline</h2><p>Die Offline-Version ist auf diesem Gerät noch nicht gespeichert. Bitte Atlas einmal mit Internet öffnen.</p>',{headers:{"content-type":"text/html; charset=utf-8"}})}}

// Daten: mit Internet frisch holen und nur gültige Dateien speichern; ohne Internet die gespeicherte Kopie
async function daten(r,rel){const d=await caches.open(DATEN),key=new URL(rel,base());
  try{const x=await fetch(r);if(x.ok&&await valid(rel,x.clone())){await d.put(key,x.clone());return x}const m=await d.match(key);if(m)return m;return x}
  catch{const m=await d.match(key);return m||new Response("",{status:504,statusText:"offline"})}}
