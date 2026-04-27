# NEXT_TASKS – Kouzelný srdíčkový lektvar

Poslední aktualizace: 2026-04-27

Stav projektu: **žádné kritické bugy**. Hra je funkční, nasazená a instalovatelná jako PWA.

---

## A. Kritické bugy

### A1. PWA instalace – po potvrzení se hra v zařízení neobjeví

**Popis:** Při otevření odkazu na hru se nabídne možnost stáhnout / nainstalovat hru do zařízení. Po potvrzení instalace se však hra nikde v zařízení nezobrazí (chybí ikona na ploše / v seznamu aplikací) a není možné ji najít.

**Dopad na hru:** Vysoký – uživatelé nemohou hru používat jako nainstalovanou PWA, přestože instalační dialog proběhl.

**Očekávaný výsledek:** Po potvrzení instalace se ikona aplikace objeví na ploše / v seznamu aplikací a hra je spustitelná offline.

**Místo v kódu:** `manifest.json` (ikony, `start_url`, `scope`, `display`), `sw.js` (registrace, cache), `index.html` (registrace SW, meta tagy).

**Postup (návrh):** Ověřit – zda jsou ikony v manifestu skutečně dostupné (cesta, MIME), zda `start_url` a `scope` odpovídají hostingu na Vercelu, zda je `display: standalone`, zda Service Worker projde install fází bez chyby. Otestovat v Chrome DevTools → Application → Manifest / Service Workers.

**Čemu se vyhnout:** Neměnit cache verzi bez důvodu; nepřepisovat funkční manifest – nejdřív diagnostika.

**Priorita:** Vysoká

**Vyžaduje rozhodnutí uživatele:** Ne – jde o bug, ale potřeba zjistit, na jakém zařízení / OS / prohlížeči se chyba projevuje.

---

### A2. Špatná responzivita herní plochy

**Popis:** Samotné prostředí hry (`#screen-game` – čarodějka, pohár, ingredience na louce) se na různých zařízeních zobrazuje špatně responzivně. Titulní obrazovka je v pořádku, problém je pouze na herní obrazovce.

**Dopad na hru:** Vysoký – některé prvky mohou být mimo viditelnou oblast, příliš malé / velké, překrývat se nebo nereagovat na drag.

**Očekávaný výsledek:** Herní plocha se přizpůsobí velikosti zařízení (mobil portrait, mobil landscape, tablet, desktop) tak, aby všechny ingredience, pohár i čarodějka byly viditelné a hratelné.

**Místo v kódu:** `styles.css` – sekce `#screen-game`, `.scene`, `.witch`, `.goblet`, `.ingredient`, media queries pro landscape breakpoint (`max-height: 500px + orientation: landscape`); `script.js` – `shufflePositions` (pozice ingrediencí v % vs. px).

**Postup (návrh):** Nejdřív od uživatele zjistit, na kterém konkrétním zařízení / rozlišení / orientaci problém vidí a co přesně je špatně (screenshot pomůže). Pak cílená oprava – ne plošný refaktor.

**Čemu se vyhnout:** Nepřepisovat funkční layout titulní obrazovky; neměnit `DIFFICULTIES` ani drag logiku; neřešit „od oka" bez konkrétního zařízení.

**Priorita:** Vysoká

**Vyžaduje rozhodnutí uživatele:** Ano – upřesnit zařízení a popis chyby (případně screenshot).

---

## B. Důležité opravy

Žádné aktuálně otevřené.

---

## C. Vizuální / UX úpravy

### C1. Ověřit hlasovou nápovědu na iOS

**Popis:** Web Speech API má na iOS Safari omezení – hlasy nemusí být dostupné nebo mohou fungovat jinak než na Chrome/Windows.

**Dopad:** Zvukové tlačítko může na iPhone/iPad mlčet nebo použít nečeský hlas.

**Očekávaný výsledek:** Ověřit na reálném zařízení; případně přidat vizuální fallback (zobrazit text receptu, pokud hlas není dostupný).

**Místo v kódu:** `script.js` – funkce `speakRecipe()`.

**Čemu se vyhnout:** Přepisovat celou funkci bez ověření problému.

**Priorita:** Střední

**Vyžaduje rozhodnutí uživatele:** Ano – po ověření chování na iOS.

---

### C2. Ověřit PWA instalaci na iOS

**Popis:** iOS nepodporuje automatický instalační banner pro PWA. Uživatel musí ručně použít „Sdílet → Přidat na plochu". Toto chování nelze změnit kódem.

**Dopad:** Uživatelé na iPhone/iPad nemusí vědět, jak hru nainstalovat.

**Očekávaný výsledek:** Případně přidat jednorázový hint v UI (např. malý tooltip nebo text pod tlačítky obtížnosti) pro iOS uživatele.

**Místo v kódu:** `index.html` – titulní obrazovka; `script.js` – detekce iOS (ověřit).

**Priorita:** Nízká

**Vyžaduje rozhodnutí uživatele:** Ano – zda hint přidat a v jaké formě.

---

## D. Pozdější rozšíření

### D1. Více variant receptu pro obtížnosti 2 a 3

**Popis:** Obtížnosti 2 a 3 mají aktuálně 3 varianty receptu. Přidání dalších variant zvyšuje znovuhratelnost.

**Místo v kódu:** `script.js` – `DIFFICULTIES[2].recipeVariants` a `DIFFICULTIES[3].recipeVariants`.

**Postup:** Přidat nový objekt do pole `recipeVariants` se stejnou strukturou (`recipe`, `recipeDisplay`, `objects`).

**Čemu se vyhnout:** Neměnit schéma objektu; nepoužívat typy assetů, které neexistují v `assets/ingredients/`.

**Priorita:** Nízká

---

### D2. Zvukové efekty pro jednotlivé ingredience

**Popis:** Aktuálně jsou jen tři zvuky (start, úspěch, neúspěch). Přidání zvuku při sbírání správné / špatné ingredience by zlepšilo zpětnou vazbu, zejména pro nejmenší.

**Místo v kódu:** `script.js` – `collectIngredient()`, zvukové funkce.

**Priorita:** Nízká

**Vyžaduje rozhodnutí uživatele:** Ano – zda funkci přidat.

---

### D3. Titulní obrazovka – popis obtížností

**Popis:** Tlačítka obtížností zobrazují jen hvězdičky (1–3). Věkový rozsah nebo krátký popis (např. „Pro nejmenší", „Pro předškoláky") by pomohl rodičům vybrat správnou úroveň.

**Místo v kódu:** `index.html` – `.diff-btn`; `styles.css` – `.diff-btn`.

**Priorita:** Nízká

**Vyžaduje rozhodnutí uživatele:** Ano – zda a jaký text přidat.

---

## Archiv opravených bugů

| # | Popis | Soubory |
|---|-------|---------|
| 1 | Úroveň 1 nezobrazuje instrukce před hrou | `index.html`, `styles.css`, `script.js` |
| 2 | Čarodějka a pohár na špatných stranách | `styles.css` |
| 3 | Bílý kamínek – false alarm (fungoval správně) | – |
| 4 | GrayStone broken image (`stone-gray.png` → `stone-grey.png`) | `script.js` |
| 5 | Recepty a pozice vždy stejné – přidány `recipeVariants` | `script.js` |
| 6 | Tlačítko Domů nefunguje po dohrání | `styles.css` |
| 7 | Zvuková nápověda – špatné české tvary | `script.js` |
| 8 | Úroveň 3 nemá dost obsahu; přidány vítrové ingredience | `script.js` |
| 9 | `anyFlower: true` na úr. 1 způsobovala chybné vyhodnocení | `script.js` |
| 10 | Úr. 1 vždy stejný recept – přidány 4 varianty | `script.js` |
| 11 | `goHome()` netistil wind timers a ESC listener | `script.js` |
| 12 | Landscape breakpoint nefungoval na iPhone SE | `styles.css` |
| 13 | Readme tlačítko nebylo centrované | `styles.css` |
| 14 | Overlay otočení telefonu se zobrazoval i na titulní obrazovce | `script.js`, `styles.css` |
| 15 | `recipe-card.png` neexistoval – modal bez pozadí | `styles.css` |
| 16 | `icon-mobile.png` nebyla přidána do gitu – chyběla na Vercelu | `git` |
| 17 | Špatná responzivita herní plochy v landscape (mobil) | `script.js`, `styles.css`, `assets/background/` |
| 18 | PWA instalace na Androidu – ikona se po instalaci neobjevila (manifest deklaroval 512px soubor jako 192px + maskable bez safe zone) | `manifest.json` |
| 19 | Implementace limitu chyb na úr. 3 (`maxErrors: 6`) | `script.js` |
| 20 | Implementace radostných bublin po 3 správných ingrediencích na úr. 2 (`bubbleAt: 3`) | `script.js`, `styles.css` |
