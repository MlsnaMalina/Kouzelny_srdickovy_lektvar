# Kouzelný srdíčkový lektvar – CLAUDE.md

Dětská webová hra (česky). Hráč klikáním sbírá ingredience a plní recept čarodějky.
Tři obtížnosti: Pro nejmenší (3–4 r.), Pro předškoláky (5–6 l.), Pro školáky (7–10 l.).

Podrobný stav projektu: `docs/PROJECT_HANDOFF.md`
Aktuální úkoly a bugy: `docs/NEXT_BUGFIX_TASKS.md`

---

## Pravidla práce – POVINNÉ

- **Nikdy nepřepisuj projekt od nuly.** Jen minimální, cílené změny.
- **Nepoužívej emoji** – ani v kódu, ani v HTML, ani v textu hry.
- **Bez externích knihoven** – žádný npm, žádný CDN, pokud uživatel výslovně nepovolí.
- **Používej existující PNG assety** ze složky `assets/`. Nevytvárej vlastní grafiku.
- **Nevypisuj celý kód do chatu.** Ukazuj jen relevantní úryvky a diff.
- Každá změna musí zachovat vizuální styl a strukturu kódu, která už existuje.

---

## Struktura projektu

```
index.html
styles.css
script.js
assets/
  background/   background-meadow.png
  characters/   witch-idle.png  witch-making-magic.png  witch-happy.png
                witch-scared.png  witch-reading.png
  goblet/       goblet-idle.png  goblet-success.png  goblet-fail.png
  ingredients/  flower-yellow.png  flower-red.png  pinecone.png
                stone-white.png  stone-gray.png  leaf-green.png
  ui/           icon-home.png  icon-recipe.png  icon-sound.png  icon-back.png
                recipe-panel.png  recipe-card.png
docs/
  PROJECT_HANDOFF.md
  NEXT_BUGFIX_TASKS.md
```

---

## Základní herní logika

1. Hráč vybere obtížnost → zobrazí se recept (úrovně 2 a 3) → herní scéna.
2. Klik na ingredienci ji přesune do poháru (animace `flying`).
3. Správné ingredience zvyšují `collectedCounts`, špatné ne.
4. Hra se vyhodnotí, jakmile `collectedStack.length >= totalNeeded`.
5. Shoda s receptem = úspěch (srdíčka + `witch-happy`), neshoda = neúspěch (třes poháru + `witch-scared`).
6. Nápověda: tlačítko receptu = −2 ingredience, zvukové tlačítko = −1 ingredience.
7. Špatné ingredience na úrovni 2 se v liště zobrazují s `opacity: 0.45`.

---

## Důležitá upozornění

- Úvodní obrazovku (`#screen-title`) zatím **neupravuj** – bude samostatná fáze.
- Assety mají přesné cesty – při přidávání nového assetu zkontroluj, že soubor fyzicky existuje.
- Nepoužívej `obj.decoy` – vlastnost byla odstraněna, filtry řeší `DECOY_FILTER` mapa.
