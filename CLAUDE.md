# Kouzelný srdíčkový lektvar – CLAUDE.md

**Typ projektu:** Dětská webová hra (PWA)
**Jazyk:** čeština
**Cílová skupina:** děti 3–10 let

Hráč tahá ingredience do poháru čarodějky a plní recept. Tři obtížnosti.
Hra je nasazena na Vercelu a je instalovatelná jako PWA.

Podrobný stav: `docs/PROJECT_HANDOFF.md`
Aktuální úkoly: `docs/NEXT_TASKS.md`

---

## Pravidla práce – POVINNÉ

- **Nikdy nepřepisuj projekt od nuly.** Pouze minimální, cílené změny.
- **Před větším zásahem nejdřív vysvětli plán** – nečekej, že uživatel odhalí problém až po faktu.
- **Neměň funkční části bez důvodu.**
- **Bez externích knihoven** – žádný npm, žádný CDN bez výslovného souhlasu.
- **Používej pouze existující PNG assety** ze složky `assets/`. Nevytvářej vlastní grafiku.
- **Nevypisuj celý kód do chatu.** Ukazuj jen relevantní úryvky a diff.
- **Po každé úpravě stručně popiš, co se změnilo.**
- **Nepoužívej emoji** v kódu, HTML ani textu hry.
- Před přidáním nového assetu ověř, že soubor fyzicky existuje v `assets/`.

---

## Technologický stack

- Vanilla HTML / CSS / JavaScript (žádný framework, žádný build)
- Web Audio API (zvukové efekty)
- Web Speech API (hlasová nápověda, česky)
- Pointer Events API (drag & drop)
- PWA: `manifest.json` + Service Worker (`sw.js`, cache `lektvar-v3`)
- Hosting: GitHub → Vercel (auto-deploy z větve `main`)

---

## Struktura projektu

```
index.html          – HTML kostra, 3 obrazovky + overlaye
styles.css          – veškeré styly (bez frameworku)
script.js           – veškerá logika (bez frameworku)
manifest.json       – PWA manifest
sw.js               – Service Worker (cache-first, verze lektvar-v3)
assets/
  background/       background-meadow.png
  characters/       witch-idle.png  witch-making-magic.png  witch-happy.png
                    witch-scared.png  witch-reading.png
                    cat.png  bat.png
  goblet/           goblet-idle.png  goblet-success.png  goblet-fail.png
  ingredients/      flower-yellow.png  flower-red.png  flower-purple.png
                    pinecone.png  stone-white.png  stone-grey.png
                    leaf-green.png  camp-fire.png
                    heart-pink.png  heart-white.png
                    star-pink.png  star-white.png
                    mushroom.png  stump.png
  ui/               icon-home.png  icon-recipe.png  icon-sound.png
                    icon-back.png  icon-mobile.png
                    recipe-panel.png  readme.png  how-to-play.png
docs/
  PROJECT_HANDOFF.md
  NEXT_TASKS.md
```

---

## Jak spustit

Otevřít `index.html` přímo v prohlížeči (Chrome / Edge).
Žádný build, žádný server, žádné závislosti.

---

## Klíčové upozornění

- `recipe-card.png` **neexistuje** – bylo odstraněno. `.modal-box` používá `recipe-panel.png`.
- `anyFlower` je na všech úrovních `false` – každý typ se vyhodnocuje samostatně.
- `DECOY_FILTER` mapa řeší CSS filtr pro `brown-leaf` – nepoužívej `obj.decoy`.
- `state.errors` je definován, ale **nikdy se neinkrementuje** – dead code.
