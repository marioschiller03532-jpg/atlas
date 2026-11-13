// Einmalige Prüfung: dürfen die Produktbilder von einer fremden Seite (Atlas auf github.io) geladen werden?
import fs from "node:fs";
const urls=JSON.parse(fs.readFileSync("katalog/supplement_catalog.json","utf8")).produkte.filter(p=>/Omega 3 forte 700|Omega 3 Kapseln Vegan|Kreatin/.test(p.name)).slice(0,6).map(p=>[p.hersteller,p.name,p.bild]);
const out=[];const ORIGIN="https://marioschiller03532-jpg.github.io";
for(const [h,n,u] of urls){for(const mode of ["ohne Referer","mit Referer+Origin von Atlas"]){
  const hd={"user-agent":"Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1","accept":"image/avif,image/webp,image/png,image/*,*/*"};
  if(mode.startsWith("mit")){hd.referer=ORIGIN+"/atlas/";hd.origin=ORIGIN}
  try{const r=await fetch(u,{headers:hd,redirect:"follow"});const b=Buffer.from(await r.arrayBuffer());
    out.push({hersteller:h,name:n,modus:mode,status:r.status,typ:r.headers.get("content-type"),bytes:b.length,cors:r.headers.get("access-control-allow-origin"),url:u.slice(0,120)})}
  catch(e){out.push({hersteller:h,name:n,modus:mode,fehler:String(e).slice(0,200)})}}}
fs.mkdirSync("katalog/probe3",{recursive:true});fs.writeFileSync("katalog/probe3/bilder.json",JSON.stringify(out,null,1));
