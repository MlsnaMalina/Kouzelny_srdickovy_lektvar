# PROJECT_HANDOFF – Kouzelný srdíčkový lektvar

## Co hra aktuálně umí

- Výběr ze tří obtížností na úvodní obrazovce.
- **Úroveň 1:** vizuální overlay před hrou zobrazí obrázky ingrediencí (počet = počet v receptu). Tlačítka Recept a Zvuk jsou dostupná i na úrovni 1 – Recept znovu zobrazí overlay s obrázky.
- **Úrovně 2–3:** obrazovka receptu s čarodějkou a panelem před startem hry.
- Herní scéna s čarodějkou (vlevo), pohárem (vpravo) a ingrediencemi v % pozicích.
- Ingredience na louce (květiny, šišky, kameny) se zobrazují při dolním okraji (y 6–22 %), lístky výše (y 24–40 %).
- Klik na ingredienci → animace `flying` → přidání do poháru + lišta nahoře.
- Vyhodnocení receptu při naplnění poháru.
- Úspěch: létající srdíčka, `witch-happy`, overlay „Hrát znovu!".
- Neúspěch: třes poháru, rozlití vody, `witch-scared`, overlay „Zkusit znovu!".
- Tlačítko Zpět: vrátí poslední ingredienci na scénu.
- Tlačítko Recept: penalizace −2 + modál (úr. 2–3) nebo vizuální overlay (úr. 1).
- Zvukové tlačítko: penalizace −1 + čtení receptu česky; preferuje ženský hlas (Zuzana/Dagmar).
- Vizuální hint úr. 2: špatné ingredience v liště s `opacity: 0.45`.
- Wiggle hint úr. 1: špatná ingredience se zavrtí před vstupem do poháru.
- Každé spuštění vybere náhodnou variantu receptu (úr. 2 = 3 varianty, úr. 3 = 3 varianty) a náhodně rozmístí ingredience.
- Úroveň 3: vítrové ingredience (`windObjects`) – objeví se, po vypršení časovače zmizí.

---

## Struktura souborů

```
index.html       – HTML kostra, 3 obrazovky + overlay-intro pro úr. 1
styles.css       – veškeré styly, bez frameworků
script.js        – veškerá logika, bez frameworků
CLAUDE.md        – instrukce pro Claude Code session
docs/
  PROJECT_HANDOFF.md   (tento soubor)
  NEXT_BUGFIX_TASKS.md – archiv opravených bugů + odložené úkoly
assets/          – viz CLAUDE.md
```

---

## Mapování ingrediencí

| Klíč v kódu     | Soubor assetu                        | Použití                     |
|-----------------|--------------------------------------|-----------------------------|
| `flower`        | `ingredients/flower-yellow.png`      | alias pro anyFlower (úr. 1) |
| `yellow-flower` | `ingredients/flower-yellow.png`      | recept úr. 2 a 3            |
| `red-flower`    | `ingredients/flower-red.png`         | recept úr. 2 a 3            |
| `pinecone`      | `ingredients/pinecone.png`           | recept úr. 2 a 3            |
| `white-stone`   | `ingredients/stone-white.png`        | recept úr. 3                |
| `green-leaf`    | `ingredients/leaf-green.png`         | recept úr. 3                |
| `gray-stone`    | `ingredients/stone-grey.png`         | rušivý prvek úr. 2 a 3      |
| `brown-leaf`    | `ingredients/leaf-green.png` + filtr | rušivý prvek úr. 2 a 3      |

`DECOY_FILTER["brown-leaf"] = "sepia(1) saturate(2) hue-rotate(28deg)"` – CSS filtr v `renderScene`.

---

## Pravidla obtížností

| Úr. | Název           | anyFlower | showRecipeCard | Rušivé prvky | Varianty receptu | Vítrové obj. |
|-----|-----------------|-----------|----------------|--------------|------------------|--------------|
| 1   | Pro nejmenší    | true      | false          | ne           | 1                | ne           |
| 2   | Pro předškoláky | false     | true           | gray-stone×1, brown-leaf×1 | 3 | ne  |
| 3   | Pro školáky     | false     | true           | gray-stone×3, brown-leaf×3 | 3 | ano (2 obj.) |

---

## Pravidla nápovědy a penalizace

Funkce `returnN(n)` – odebere posledních n položek z `collectedStack`:
- Obnoví položku na scéně (`state.removed.delete`).
- Pro správné položky sníží `collectedCounts[key]`.
- Zavolá `renderScene()`, `updateCollectedBar()`, `updateBackBtn()`.

| Akce                 | Penalizace | Podmínka               |
|----------------------|------------|------------------------|
| Otevření receptu     | −2         | pouze pokud !gameOver  |
| Zvuková nápověda     | −1         | pouze pokud stack > 0  |
| Tlačítko Zpět        | −1         | standardní undo        |

---

## Zvuková nápověda

`speakRecipe()` v `script.js`:
1. Volá `returnN(1)` (penalizace).
2. Sestaví text z `it.spoken` polí v `recipeDisplay`; více položek spojí „, " a „ a " před poslední.
3. Použije `SpeechSynthesisUtterance` s `lang: 'cs-CZ'`, `rate: 0.85`.
4. Preferuje hlas se jménem Zuzana/Dagmar; fallback: první dostupný český hlas.

---

## Pozicování ingrediencí

`GROUND_TYPES` = flower, yellow-flower, red-flower, pinecone, white-stone, gray-stone → `y: 6–22 %`  
Listové typy (green-leaf, brown-leaf) → `y: 24–40 %`  
Vítrové ingredience (wind objects) → `y: 30–42 %` (vždy ve vzduchu), přiřazeno v `startGame()`.

---

## Stavové proměnné (`state`)

```js
{
  difficulty: 1|2|3,
  config: DIFFICULTIES[n],   // deep-kopie s vybranou variantou
  collectedStack: [{ id, type, label, img, wrong: bool }],
  collectedCounts: { type: number },
  errors: number,
  gameOver: bool,
  removed: Set<id>,
}
```

`windTimers` – modul-level pole `let windTimers = []`, spravuje `clearWindTimers()`.

---

## Jak hru spustit

Otevřít `index.html` přímo v prohlížeči (Chrome / Edge doporučeny).  
Žádný build process, žádný server.  
Web Speech API vyžaduje Chrome nebo Edge; Windows nabízí hlas Microsoft Zuzana (ženský, český).

---

## Co zatím neměnit

- `#screen-title` a celý blok úvodní obrazovky – bude samostatná fáze.
- Vizuální styl (barvy, font, border-radius) – zachovat konzistenci.
- Strukturu `DIFFICULTIES` + `recipeVariants` – přidávat lze, měnit schéma ne.
