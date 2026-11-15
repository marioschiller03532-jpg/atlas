// Einmalig: Schriften (Unbounded, IBM Plex Sans/Mono, Lizenz: SIL Open Font License) von Google Fonts holen und im Repo ablegen,
// damit Atlas sie selbst ausliefert und beim Start KEINE Verbindung zu Google mehr aufbaut.
import fs from "node:fs";
const CSS="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
const UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const css=await (await fetch(CSS,{headers:{"user-agent":UA}})).text();
fs.mkdirSync("fonts",{recursive:true});let out="/* Selbst gehostet (OFL). Quelle: Google Fonts, nur Zeichensatz latin. */\n";let n=0;
for(const m of css.matchAll(/\/\*\s*latin\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)){const block=m[1];
  const fam=block.match(/font-family:\s*'([^']+)'/)[1],w=block.match(/font-weight:\s*(\d+)/)[1],url=block.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const name=fam.toLowerCase().replace(/\s+/g,"-")+"-"+w+".woff2";const buf=Buffer.from(await (await fetch(url)).arrayBuffer());fs.writeFileSync("fonts/"+name,buf);n++;
  out+=block.replace(/src:\s*url\([^)]+\)\s*format\('woff2'\);/,`src: url(fonts/${name}) format('woff2');`)+"\n"}
fs.writeFileSync("fonts/fonts.css",out);console.log("Schriften:",n);
