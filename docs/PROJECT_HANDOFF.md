# PROJECT_HANDOFF – Kouzelný srdíčkový lektvar

Poslední aktualizace: 2026-04-27

---

## A. Shrnutí projektu

Dětská webová hra v češtině. Hráč táhne ingredience do poháru čarodějky a snaží se splnit recept.
Cílová skupina: děti 3–10 let, rozdělené do tří obtížností.

Stav: **funkční, nasazeno, instalovatelné jako PWA**.
Repozitář: GitHub (MlsnaMalina/Kouzelny_srdickovy_lektvar), nasazení: Vercel (auto-deploy z `main`).

---

## B. Aktuální funkce

### Hotové

- Tři obtížnosti s vlastními recepty a rušivými prvky.
- Náhodný výběr varianty receptu při každém spuštění (úr. 1: 4 varianty, úr. 2: 8 variant, úr. 3: 8 variant).
- Náhodné rozmístění ingrediencí na scéně (`shufflePositions`).
- Drag & drop ingrediencí pomocí Pointer Events API (`setPointerCapture`).
- Drop zona nad pohárem se zvýrazněním (dashed circle).
- Vyhodnocení receptu při naplnění poháru; úspěch / neúspěch s animacemi.
- Tlačítko Zpět – vrátí poslední ingredienci na scénu (`returnN(1)`).
- Tlačítko Recept – penalizace −2, zobrazí modal s receptem (úr. 2–3) nebo vizuální overlay (úr. 1).
- Zvukové tlačítko – penalizace −1, přečte recept česky (Web Speech API).
- Wiggle hint: špatná ingredience na úr. 1 se zavrtí před vstupem do poháru.
- Opacity hint: špatné ingredience v liště na úr. 2 mají `opacity: 0.45`.
- Vítrové ingredience (úr. 3): `windObjects` zmizí po vypršení časovače.
- Zvukové efekty start / úspěch / neúspěch (Web Audio API).
- PWA: `manifest.json` + Service Worker `sw.js` (cache `lektvar-v3`, cache-first).
- Ikona aplikace: `assets/ui/icon-mobile.png`.
- Overlay „otoč telefon" – zobrazí se pouze na `screen-recipe` a `screen-game` v portrait módu (ne na titulní obrazovce). Třída `game-screen-active` se přidává přes `showScreen()`.
- Landscape kompaktní layout: aktivní při výšce ≤ 500 px + `orientation: landscape`.
- Titulní obrazovka: gradient, průhledná karta, dekorace (kočka, netopýr, táborový oheň, srdíčka, hvězdičky), animace.
- Modál návodu (`readme-modal`) s obrázkem `how-to-play.png`.

### Neověřené

- Hlasová nápověda na iOS Safari (Web Speech API má na iOS omezení).
- PWA instalace na iOS (vyžaduje „Přidat na plochu" ručně, ne banner).
- Chování landscape overlaye na konkrétních Android zařízeních.

---

## C. Struktura souborů

```
index.html       – HTML kostra; 3 .screen divy + #rotate-overlay + #readme-modal
styles.css       – veškeré styly; sekce odděleny komentáři
script.js        – veškerá logika; IMGS, DECOY_FILTER, GROUND_TYPES, DIFFICULTIES,
                   state, showScreen, startGame, beginGame, renderScene,
                   handleClick, collectIngredient, evaluateRecipe,
                   triggerSuccess, triggerFailure, returnN,
                   attachDrag, startDrag, showRecipeModal, speakRecipe,
                   openReadme / closeReadme, goHome, restartGame, zvukové funkce
manifest.json    – PWA manifest; ikona icon-mobile.png (192 + 512)
sw.js            – Service Worker; cache lektvar-v3; seznam ~35 assetů
CLAUDE.md        – instrukce pro Claude Code session (max 80 řádků)
docs/
  PROJECT_HANDOFF.md  (tento soubor)
  NEXT_TASKS.md       – úkoly pro další session
assets/
  background/    background-meadow.png
  characters/    witch-idle, witch-making-magic, witch-happy, witch-scared,
                 witch-reading, cat, bat
                 (witch-with-poison, witch-waving, witch-thinking, witch-broomstick
                  existují v složce, ale nejsou použity v hře)
  goblet/        goblet-idle, goblet-success, goblet-fail
  ingredients/   flower-yellow, flower-red, flower-purple, pinecone,
                 stone-white, stone-grey, leaf-green, camp-fire,
                 heart-pink, heart-white, star-pink, star-white,
                 mushroom, stump
  ui/            icon-home, icon-recipe, icon-sound, icon-back,
                 icon-mobile, recipe-panel, readme, how-to-play
```

---

## D. Technický stack

- HTML5 / CSS3 / JavaScript ES6+ – bez frameworku, bez build nástroje
- Web Audio API – zvukové efekty (oscillátor + gain)
- Web Speech API – hlasová nápověda (`SpeechSynthesisUtterance`, `lang: cs-CZ`)
- Pointer Events API – drag & drop (`setPointerCapture`, `pointermove`, `pointerup`, `pointercancel`)
- PWA – Service Worker (cache-first), Web App Manifest
- Hosting: Vercel (free tier), auto-deploy z GitHubu
- Verzování: Git / GitHub (větev `main`)

---

## E. Assety a podklady

Všechny assety jsou PNG soubory dodané uživatelem. Jsou uloženy v `assets/`.
**Nevytvářej náhradní grafiku.** Pokud asset chybí, označ to uživateli a počkej na dodání.

Fonty: systémové (`'Segoe UI', 'Comic Sans MS', cursive, sans-serif`) – žádný externí font.

`recipe-card.png` **neexistuje** a nesmí být znovu přidáváno do kódu.
`.modal-box` v `styles.css` používá místo něj `recipe-panel.png` + záložní barvu pozadí.

---

## F. Důležitá rozhodnutí

- **Interakce**: drag & drop (Pointer Events), ne klik. Přetažení na pohár = vložení.
- **Obtížnost 1**: `anyFlower: false`; každý typ (yellow-flower / red-flower) se hodnotí samostatně.
- **Rušivé prvky**: řešeny přes `DECOY_FILTER` mapu v JS; `obj.decoy` vlastnost byla odstraněna.
- **Overlay otočení telefonu**: pouze na herních obrazovkách (třída `game-screen-active`); na titulní se nezobrazuje.
- **Landscape breakpoint**: `max-height: 500px + orientation: landscape` (bez `hover/pointer` podmínek).
- **Herní scéna pozadí**: `bottom center / cover` – vždy viditelná louka, ne jen obloha.
- **Titulní obrazovka**: vizuálně dokončena, schválena uživatelem. Neupravovat bez pokynu.
- **PWA ikona**: `assets/ui/icon-mobile.png` (dodaná uživatelem).
- **Cache verze**: `lektvar-v3` – změna verze = vynucení aktualizace u stávajících instalací.
- **Commit jazyk**: zprávy bez diakritiky (bezpečnější přes heredoc v bash).

---

## G. Známé problémy

| Problém | Místo | Ověřeno? |
|---------|-------|----------|
| `state.errors` je definován, ale nikdy se neinkrementuje | `script.js` – `state` + chybí volání | Ano – dead code, bez dopadu na hru |
| `bubbleAt: 3` v konfiguraci obtížnosti 2 se nikde nepoužívá | `script.js` – `DIFFICULTIES[2]` | Ano – dead config, bez dopadu |
| `maxErrors: 6` v obtížnosti 3 se nikde nevynucuje | `script.js` – `DIFFICULTIES[3]` | Ano – dead config, bez dopadu |
| Hlasová nápověda nemusí fungovat na iOS Safari | Web Speech API omezení iOS | Neověřeno na zařízení |
| PWA na iOS nemá automatický instalační banner | Omezení iOS – nutné „Přidat na plochu" ručně | Neověřeno na zařízení |

---

## H. Co zatím neměnit

- Titulní obrazovka (`#screen-title`, `.title-bg`, `.title-card`, `.title-deco`) – vizuálně dokončena.
- Herní logika (`collectIngredient`, `evaluateRecipe`, `isNeeded`, `returnN`) – funkční.
- Struktura `DIFFICULTIES` a `recipeVariants` – lze přidávat varianty, neměnit schéma.
- Vizuální styl (barvy, border-radius, font, shadow) – zachovat konzistenci.
- Cesty k assetům – soubory mají přesné názvy, neměnit.
- `DECOY_FILTER` mapa – funkční řešení pro brown-leaf.

---

## I. Jak projekt spustit

1. Otevřít `index.html` přímo v prohlížeči (Chrome nebo Edge doporučeny).
2. Žádný build, žádný server, žádné závislosti.
3. Web Speech API (hlasová nápověda) funguje nejlépe v Chrome na Windows s hlasem Microsoft Zuzana.
4. PWA instalace: v Chrome klikni na ikonu instalace v adresním řádku (nebo „Přidat na plochu" na mobilu).

Produkční URL: nasazena na Vercelu – URL ověřit v nastavení Vercel projektu.
