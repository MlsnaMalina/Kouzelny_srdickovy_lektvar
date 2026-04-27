# NEXT_TASKS – Kouzelný srdíčkový lektvar

Poslední aktualizace: 2026-04-27

Stav projektu: **žádné kritické bugy**. Hra je funkční, nasazená a instalovatelná jako PWA.

---

## A. Kritické bugy

Žádné aktuálně známé.

---

## B. Důležité opravy

### B1. Dead code: `state.errors` se nikdy neinkrementuje

**Popis:** Proměnná `state.errors` je definována v objektu `state`, ale žádná část kódu ji nikdy nezvyšuje. `maxErrors: 6` v obtížnosti 3 se tedy nikdy nevyhodnocuje.

**Dopad na hru:** Žádný – hra funguje správně. Limit chyb pro úroveň 3 prostě není implementován.

**Očekávaný výsledek:** Buď implementovat (hráč prohraje po 6 špatných ingrediencích), nebo dead code odstranit.

**Místo v kódu:** `script.js` – objekt `state`, `DIFFICULTIES[3].maxErrors`, chybí volání v `collectIngredient`.

**Postup:** Rozhodnutí uživatele – viz poznámka.

**Čemu se vyhnout:** Neimplementovat bez pokynu – mění herní mechaniku.

**Priorita:** Nízká

**Vyžaduje rozhodnutí uživatele:** Chceš, aby úroveň 3 měla limit chyb (prohra po 6 špatných ingrediencích)?

---

### B2. Dead config: `bubbleAt: 3` v obtížnosti 2

**Popis:** Obtížnost 2 má v konfiguraci vlastnost `bubbleAt: 3`, která se nikde v kódu nepoužívá.

**Dopad na hru:** Žádný.

**Očekávaný výsledek:** Odstranit vlastnost z konfigurace, nebo implementovat (pohár začne bublat po 3 správných ingrediencích).

**Místo v kódu:** `script.js` – `DIFFICULTIES[2].bubbleAt`.

**Priorita:** Nízká

**Vyžaduje rozhodnutí uživatele:** Ano – zda funkci implementovat nebo konfiguraci smazat.

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
