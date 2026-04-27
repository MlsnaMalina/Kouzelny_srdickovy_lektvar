/* =====================================================
   Kouzelný srdíčkový lektvar – script.js
   ===================================================== */

// ===== MAPOVÁNÍ TYPŮ NA PNG ASSETY =====
const IMGS = {
  "flower":        "assets/ingredients/flower-yellow.png",
  "yellow-flower": "assets/ingredients/flower-yellow.png",
  "red-flower":    "assets/ingredients/flower-red.png",
  "pinecone":      "assets/ingredients/pinecone.png",
  "white-stone":   "assets/ingredients/stone-white.png",
  "green-leaf":    "assets/ingredients/leaf-green.png",
  "gray-stone":    "assets/ingredients/stone-grey.png",
  // Rušivé prvky s filtrem / bez filtru
  "brown-leaf":    "assets/ingredients/leaf-green.png",
  "flower-purple": "assets/ingredients/flower-purple.png",
  "mushroom":      "assets/ingredients/mushroom.png",
  "stump":         "assets/ingredients/stump.png",
};
const DECOY_FILTER = {
  "brown-leaf": "sepia(1) saturate(2) hue-rotate(28deg)",
};

// ===== VÍTROVÉ INGREDIENCE – časovače =====
let windTimers = [];
function clearWindTimers() {
  windTimers.forEach(clearTimeout);
  windTimers = [];
}

// ===== NÁHODNÉ POZICE V BEZPEČNÉ ZÓNĚ =====
// Typy na louce (nízké y) vs lístky ve vzduchu (vyšší y)
const GROUND_TYPES = new Set(['flower','yellow-flower','red-flower','pinecone','white-stone','gray-stone','flower-purple','mushroom','stump']);

function shufflePositions(objects) {
  const cols = 7, xMin = 22, xMax = 73;
  const xStep = (xMax - xMin) / cols;

  const makePool = (yMin, yMax, rows) => {
    const pool = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pool.push({
          x: Math.round(xMin + c * xStep + Math.random() * xStep * 0.7),
          y: Math.round(yMin + Math.random() * (yMax - yMin)),
        });
      }
    }
    return pool.sort(() => Math.random() - 0.5);
  };

  const groundPool = makePool(6, 22, 3);  // louka: 21 slotů
  const airPool    = makePool(24, 40, 2); // vzduch: 14 slotů

  let gi = 0, ai = 0;
  return objects.map(obj => {
    const pos = GROUND_TYPES.has(obj.type)
      ? groundPool[gi++ % groundPool.length]
      : airPool[ai++ % airPool.length];
    return { ...obj, x: pos.x, y: pos.y };
  });
}

// ===== KONFIGURACE OBTÍŽNOSTÍ =====
const DIFFICULTIES = {
  1: {
    name: "Pro nejmenší",
    anyFlower: false,
    maxErrors: null,
    showRecipeCard: false,
    recipe: {},
    recipeDisplay: [],
    objects: [],
    recipeVariants: [
      {
        recipe: { "yellow-flower": 3 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina", count: 3, spoken: "tři žluté kytičky" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf4", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
        ],
      },
      {
        recipe: { "red-flower": 3 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-red.png", label: "Červená květina", count: 3, spoken: "tři červené kytičky" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "rf4", type: "red-flower",    label: "Červená květina" },
        ],
      },
      {
        recipe: { "yellow-flower": 2, "red-flower": 1 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 2, spoken: "dvě žluté kytičky" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 1, spoken: "jednu červenou kytičku" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf4", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
        ],
      },
      {
        recipe: { "yellow-flower": 1, "red-flower": 2 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 1, spoken: "jednu žlutou kytičku" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 2, spoken: "dvě červené kytičky" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "rf4", type: "red-flower",    label: "Červená květina" },
        ],
      },
    ],
  },

  2: {
    name: "Pro předškoláky",
    anyFlower: false,
    maxErrors: null,
    bubbleAt: 3,
    showRecipeCard: true,
    recipe: { "yellow-flower": 2, "red-flower": 1, pinecone: 2 },
    recipeDisplay: [],
    objects: [],
    recipeVariants: [
      {
        recipe: { "yellow-flower": 2, "red-flower": 1, pinecone: 2 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 2, spoken: "dvě žluté květiny" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 1, spoken: "jednu červenou květinu" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 2, spoken: "dvě šišky" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "pc3", type: "pinecone",      label: "Šiška" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
        ],
      },
      {
        recipe: { "yellow-flower": 1, "red-flower": 2, pinecone: 2 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 1, spoken: "jednu žlutou květinu" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 2, spoken: "dvě červené květiny" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 2, spoken: "dvě šišky" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "pc3", type: "pinecone",      label: "Šiška" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
        ],
      },
      {
        recipe: { "yellow-flower": 2, "red-flower": 2, pinecone: 1 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 2, spoken: "dvě žluté květiny" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 2, spoken: "dvě červené květiny" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 1, spoken: "jednu šišku" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
        ],
      },
    ],
  },

  3: {
    name: "Pro školáky",
    anyFlower: false,
    maxErrors: 6,
    showRecipeCard: true,
    recipe: { "yellow-flower": 3, "red-flower": 2, "white-stone": 1, pinecone: 2, "green-leaf": 1 },
    recipeDisplay: [],
    objects: [],
    windObjects: [
      { id: "w1", type: "pinecone",   label: "Šiška",       timeout: 4500 },
      { id: "w2", type: "green-leaf", label: "Zelený list", timeout: 6000 },
    ],
    recipeVariants: [
      {
        recipe: { "yellow-flower": 3, "red-flower": 2, "white-stone": 1, pinecone: 2, "green-leaf": 1 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 3, spoken: "tři žluté květiny" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 2, spoken: "dvě červené květiny" },
          { img: "assets/ingredients/stone-white.png",   label: "Bílý kamínek",    count: 1, spoken: "jeden bílý kamínek" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 2, spoken: "dvě šišky" },
          { img: "assets/ingredients/leaf-green.png",    label: "Zelený list",     count: 1, spoken: "jeden zelený list" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf4", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "ws1", type: "white-stone",   label: "Bílý kamínek" },
          { id: "ws2", type: "white-stone",   label: "Bílý kamínek" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "pc3", type: "pinecone",      label: "Šiška" },
          { id: "gl1", type: "green-leaf",    label: "Zelený list" },
          { id: "gl2", type: "green-leaf",    label: "Zelený list" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs2", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs3", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "bl2", type: "brown-leaf",    label: "Hnědý list" },
          { id: "bl3", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "fp2", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "mu2", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
          { id: "st2", type: "stump",         label: "Pařez" },
        ],
      },
      {
        recipe: { "yellow-flower": 2, "red-flower": 3, "white-stone": 1, pinecone: 2, "green-leaf": 1 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 2, spoken: "dvě žluté květiny" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 3, spoken: "tři červené květiny" },
          { img: "assets/ingredients/stone-white.png",   label: "Bílý kamínek",    count: 1, spoken: "jeden bílý kamínek" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 2, spoken: "dvě šišky" },
          { img: "assets/ingredients/leaf-green.png",    label: "Zelený list",     count: 1, spoken: "jeden zelený list" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "rf4", type: "red-flower",    label: "Červená květina" },
          { id: "ws1", type: "white-stone",   label: "Bílý kamínek" },
          { id: "ws2", type: "white-stone",   label: "Bílý kamínek" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "pc3", type: "pinecone",      label: "Šiška" },
          { id: "gl1", type: "green-leaf",    label: "Zelený list" },
          { id: "gl2", type: "green-leaf",    label: "Zelený list" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs2", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs3", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "bl2", type: "brown-leaf",    label: "Hnědý list" },
          { id: "bl3", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "fp2", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "mu2", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
          { id: "st2", type: "stump",         label: "Pařez" },
        ],
      },
      {
        recipe: { "yellow-flower": 3, "red-flower": 2, "white-stone": 2, pinecone: 2, "green-leaf": 1 },
        recipeDisplay: [
          { img: "assets/ingredients/flower-yellow.png", label: "Žlutá květina",   count: 3, spoken: "tři žluté květiny" },
          { img: "assets/ingredients/flower-red.png",    label: "Červená květina", count: 2, spoken: "dvě červené květiny" },
          { img: "assets/ingredients/stone-white.png",   label: "Bílý kamínek",    count: 2, spoken: "dva bílé kamínky" },
          { img: "assets/ingredients/pinecone.png",      label: "Šiška",           count: 2, spoken: "dvě šišky" },
          { img: "assets/ingredients/leaf-green.png",    label: "Zelený list",     count: 1, spoken: "jeden zelený list" },
        ],
        objects: [
          { id: "yf1", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf2", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf3", type: "yellow-flower", label: "Žlutá květina" },
          { id: "yf4", type: "yellow-flower", label: "Žlutá květina" },
          { id: "rf1", type: "red-flower",    label: "Červená květina" },
          { id: "rf2", type: "red-flower",    label: "Červená květina" },
          { id: "rf3", type: "red-flower",    label: "Červená květina" },
          { id: "ws1", type: "white-stone",   label: "Bílý kamínek" },
          { id: "ws2", type: "white-stone",   label: "Bílý kamínek" },
          { id: "ws3", type: "white-stone",   label: "Bílý kamínek" },
          { id: "pc1", type: "pinecone",      label: "Šiška" },
          { id: "pc2", type: "pinecone",      label: "Šiška" },
          { id: "pc3", type: "pinecone",      label: "Šiška" },
          { id: "gl1", type: "green-leaf",    label: "Zelený list" },
          { id: "gl2", type: "green-leaf",    label: "Zelený list" },
          { id: "gs1", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs2", type: "gray-stone",    label: "Šedý kámen" },
          { id: "gs3", type: "gray-stone",    label: "Šedý kámen" },
          { id: "bl1", type: "brown-leaf",    label: "Hnědý list" },
          { id: "bl2", type: "brown-leaf",    label: "Hnědý list" },
          { id: "fp1", type: "flower-purple", label: "Fialová kytička" },
          { id: "fp2", type: "flower-purple", label: "Fialová kytička" },
          { id: "mu1", type: "mushroom",      label: "Houba" },
          { id: "mu2", type: "mushroom",      label: "Houba" },
          { id: "st1", type: "stump",         label: "Pařez" },
          { id: "st2", type: "stump",         label: "Pařez" },
        ],
      },
    ],
  },
};

// ===== HERNÍ STAV =====
let state = {
  difficulty: null,
  config: null,
  collectedStack: [],    // { id, type, emoji, label }
  collectedCounts: {},   // { type: count }
  errors: 0,
  gameOver: false,
  removed: new Set(),    // ID objektů odebraných ze scény
};

// ===== PŘEPÍNÁNÍ OBRAZOVEK =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ===== STAVOVÉ PŘEPÍNÁNÍ ČARODĚJKY A POHÁRU =====
function setWitchImg(stateName) {
  document.getElementById('witch-img').src = `assets/characters/witch-${stateName}.png`;
  document.getElementById('witch').className = stateName;
}
function setGobletImg(stateName) {
  const wrap = document.getElementById('cauldron-wrap');
  document.getElementById('goblet-img').src = `assets/goblet/goblet-${stateName}.png`;
  wrap.classList.toggle('bubbling', stateName === 'fail');
}

// ===== SESTAVENÍ HTML RECEPTU =====
function buildRecipeRows(items) {
  const grid = items.length >= 4 ? ' recipe-list-grid' : '';
  const rows = items.map(it => `
    <div class="recipe-row">
      <img class="recipe-row-ico" src="${it.img}" alt="${it.label}">
      <span class="recipe-row-count">&times;&nbsp;${it.count}</span>
    </div>
  `).join('');
  return `<div class="recipe-list${grid}">${rows}</div>`;
}

// ===== SPUŠTĚNÍ HRY =====
function startGame(difficulty) {
  clearWindTimers();
  state.difficulty = difficulty;
  state.config = { ...DIFFICULTIES[difficulty] };

  if (state.config.recipeVariants && state.config.recipeVariants.length > 0) {
    const v = state.config.recipeVariants[Math.floor(Math.random() * state.config.recipeVariants.length)];
    state.config.recipe      = v.recipe;
    state.config.recipeDisplay = v.recipeDisplay;
    state.config.objects = shufflePositions([...v.objects]);
    if (state.config.windObjects) {
      state.config.windObjects = state.config.windObjects.map(wo => ({
        ...wo,
        x: Math.round(22 + Math.random() * 50),
        y: Math.round(30 + Math.random() * 12),
      }));
    }
  } else {
    state.config.objects = shufflePositions(state.config.objects);
  }

  state.collectedStack = [];
  state.collectedCounts = {};
  state.errors = 0;
  state.gameOver = false;
  state.removed = new Set();

  // Inicializace počítadel pro každý typ receptu
  Object.keys(state.config.recipe).forEach(t => state.collectedCounts[t] = 0);

  if (state.config.showRecipeCard) {
    document.getElementById('recipe-intro-list').innerHTML = buildRecipeRows(state.config.recipeDisplay);
    showScreen('screen-recipe');
  } else {
    beginGame();
  }
}

// ===== ZAČÁTEK HERNÍ SCÉNY =====
function beginGame() {
  showScreen('screen-game');
  renderScene();

  // Reset UI
  document.getElementById('overlay-success').classList.add('hidden');
  document.getElementById('overlay-failure').classList.add('hidden');
  document.getElementById('overlay-intro').classList.add('hidden');
  document.getElementById('recipe-modal').classList.add('hidden');

  // Reset pohár a čarodějka
  setGobletImg('idle');
  setWitchImg('idle');

  document.getElementById('btn-recipe-show').style.display = '';
  document.getElementById('btn-sound').style.display = '';

  updateCollectedBar();
  updateBackBtn();

  playStartSound();

  if (state.difficulty === 1) {
    showIntroRecipe();
  }
}

// ===== VYKRESLENÍ SCÉNY =====
function makeIngredientEl(obj, extraClass) {
  const el = document.createElement('div');
  el.className = 'ingredient' + (extraClass ? ' ' + extraClass : '');
  el.id = 'obj-' + obj.id;
  el.title = obj.label;
  el.style.left   = obj.x + '%';
  el.style.bottom = obj.y + '%';
  const img = document.createElement('img');
  img.src = IMGS[obj.type] || IMGS["flower"];
  img.alt = obj.label;
  img.draggable = false;
  if (DECOY_FILTER[obj.type]) img.style.filter = DECOY_FILTER[obj.type];
  el.appendChild(img);
  return el;
}

function renderScene() {
  const container = document.getElementById('ingredients-container');
  container.innerHTML = '';

  state.config.objects.forEach(obj => {
    if (state.removed.has(obj.id)) return;
    const el = makeIngredientEl(obj, null);
    attachDrag(el, obj, null);
    container.appendChild(el);
  });

  if (state.config.windObjects) {
    state.config.windObjects.forEach(obj => {
      if (state.removed.has(obj.id)) return;
      const el = makeIngredientEl(obj, 'wind-obj');
      const timer = setTimeout(() => {
        if (state.removed.has(obj.id)) return;
        state.removed.add(obj.id);
        el.classList.add('flying');
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }, obj.timeout);
      windTimers.push(timer);
      attachDrag(el, obj, timer);
      container.appendChild(el);
    });
  }
}

// ===== KLIK NA INGREDIENCI =====
function handleClick(obj, el) {
  if (state.gameOver) return;

  const wrong = !isNeeded(obj);

  // Režim 1: špatná ingredience se před vložením krátce zavrtí
  if (wrong && state.difficulty === 1) {
    el.classList.remove('wiggle');
    void el.offsetWidth;
    el.classList.add('wiggle');
    el.addEventListener('animationend', () => {
      el.classList.remove('wiggle');
      collectIngredient(obj, el, true);
    }, { once: true });
  } else {
    collectIngredient(obj, el, wrong);
  }
}

// Zjistí, jestli je objekt stále potřeba v receptu
function isNeeded(obj) {
  const cfg = state.config;

  if (cfg.anyFlower) {
    return (state.collectedCounts.flower || 0) < cfg.recipe.flower;
  }

  const needed    = cfg.recipe[obj.type] || 0;
  const collected = state.collectedCounts[obj.type] || 0;
  return needed > 0 && collected < needed;
}

// ===== VLOŽENÍ INGREDIENCE DO POHÁRU (správná i špatná) =====
function collectIngredient(obj, el, isWrong) {
  el.classList.add('flying');
  el.addEventListener('animationend', () => el.remove(), { once: true });

  // Pouze správné ingredience zvyšují počítadla receptu
  if (!isWrong) {
    const key = state.config.anyFlower ? 'flower' : obj.type;
    state.collectedCounts[key] = (state.collectedCounts[key] || 0) + 1;
  }

  state.collectedStack.push({
    ...obj,
    img:   IMGS[obj.type] || IMGS["flower"],
    wrong: isWrong,
  });
  state.removed.add(obj.id);

  updateCollectedBar();
  updateBackBtn();

  // Vyhodnoť, když je kotlík plný (počet = velikost receptu)
  const totalNeeded = Object.values(state.config.recipe).reduce((a, b) => a + b, 0);
  if (state.collectedStack.length >= totalNeeded) {
    evaluateRecipe();
  }
}

// ===== VYHODNOCENÍ RECEPTU =====
function evaluateRecipe() {
  const recipe = state.config.recipe;
  const counts = state.collectedCounts;
  const match  = Object.keys(recipe).every(t => (counts[t] || 0) === recipe[t]);
  if (match) triggerSuccess();
  else       triggerFailure();
}

// ===== ÚSPĚŠNÁ ANIMACE =====
function triggerSuccess() {
  if (state.gameOver) return;
  state.gameOver = true;
  playSuccessSound();

  // Čarodějka kouzlí, pohár – úspěch
  setWitchImg('making-magic');
  setGobletImg('success');

  // Po chvíli přejde do radostného stavu
  setTimeout(() => setWitchImg('happy'), 700);

  // Létající srdíčka (CSS ♥ znaky)
  const fxBox = document.getElementById('hearts-fx');
  const gobletWrap = document.getElementById('cauldron-wrap');
  const rect = gobletWrap.getBoundingClientRect();
  const sceneRect = document.getElementById('game-scene').getBoundingClientRect();
  const colors = ['#FF6080', '#FF85A2', '#FFB6C1', '#E040A0', '#C060B0'];

  for (let i = 0; i < 12; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'heart-fx';
      h.textContent = '\u2665';
      h.style.color = colors[i % colors.length];
      const ox = (rect.left - sceneRect.left) + rect.width  * 0.5 + (Math.random() - 0.5) * 60;
      const oy = (rect.top  - sceneRect.top)  + rect.height * 0.3;
      h.style.left = ox + 'px';
      h.style.top  = oy + 'px';
      h.style.animationDelay = (Math.random() * 0.3) + 's';
      fxBox.appendChild(h);
      setTimeout(() => h.remove(), 1600);
    }, i * 120);
  }

  setTimeout(() => {
    document.getElementById('overlay-success').classList.remove('hidden');
  }, 1500);
}

// ===== NEÚSPĚŠNÁ ANIMACE =====
function triggerFailure() {
  if (state.gameOver) return;
  state.gameOver = true;
  playFailSound();

  // Pohár – neúspěch (třes + asset)
  setGobletImg('fail');

  // Rozlití vody
  const spillBox  = document.getElementById('spill-fx');
  const gobletEl  = document.getElementById('cauldron-wrap');
  const rect = gobletEl.getBoundingClientRect();
  const sceneRect = document.getElementById('game-scene').getBoundingClientRect();

  for (let i = 0; i < 16; i++) {
    const drop = document.createElement('div');
    drop.className = 'spill-drop';
    const ox = (rect.left - sceneRect.left) + rect.width  * 0.5 + (Math.random() - 0.5) * 70;
    const oy = (rect.top  - sceneRect.top)  + rect.height * 0.5;
    drop.style.left = ox + 'px';
    drop.style.top  = oy + 'px';
    drop.style.animationDelay = (Math.random() * 0.4) + 's';
    spillBox.appendChild(drop);
    setTimeout(() => drop.remove(), 1200);
  }

  // Čarodějka se lekne
  setTimeout(() => setWitchImg('scared'), 300);

  setTimeout(() => {
    document.getElementById('overlay-failure').classList.remove('hidden');
  }, 1600);
}

// ===== VRÁTIT POSLEDNÍ INGREDIENCI =====
function returnLastIngredient() {
  if (state.collectedStack.length === 0 || state.gameOver) return;
  returnN(1);
}

// Odebere posledních n ingrediencí z poháru a vrátí je na scénu
function returnN(n) {
  const count = Math.min(n, state.collectedStack.length);
  for (let i = 0; i < count; i++) {
    const last = state.collectedStack.pop();
    state.removed.delete(last.id);
    if (!last.wrong) {
      const key = state.config.anyFlower ? 'flower' : last.type;
      state.collectedCounts[key] = Math.max(0, (state.collectedCounts[key] || 0) - 1);
    }
  }
  renderScene();
  updateCollectedBar();
  updateBackBtn();
}

// ===== AKTUALIZACE HORNÍ LIŠTY =====
function updateCollectedBar() {
  const bar = document.getElementById('collected-bar');
  bar.innerHTML = state.collectedStack.map(it => {
    const ghost = it.wrong && state.difficulty === 2 ? ' style="opacity:0.45"' : '';
    return `<img class="coll-item" src="${it.img}" alt="${it.label}" title="${it.label}"${ghost}>`;
  }).join('');
}

function updateBackBtn() {
  document.getElementById('btn-back').disabled =
    state.collectedStack.length === 0 || state.gameOver;
}

// ===== VIZUÁLNÍ RECEPT PRO ÚROVEŇ 1 =====
function showIntroRecipe() {
  const container = document.getElementById('intro-recipe-imgs');
  container.innerHTML = '';
  for (const [type, count] of Object.entries(state.config.recipe)) {
    const src = IMGS[type] || IMGS['flower'];
    for (let i = 0; i < count; i++) {
      const img = document.createElement('img');
      img.className = 'intro-ing-img';
      img.src = src;
      img.alt = '';
      container.appendChild(img);
    }
  }
  document.getElementById('overlay-intro').classList.remove('hidden');
}

// ===== MODÁL RECEPTU =====
function showRecipeModal() {
  if (!state.gameOver) returnN(2);
  if (state.difficulty === 1) {
    showIntroRecipe();
    return;
  }
  const list = document.getElementById('modal-recipe-list');
  list.innerHTML = buildRecipeRows(state.config.recipeDisplay);
  document.getElementById('recipe-modal').classList.remove('hidden');
}

// ===== ZVUKOVÁ NÁPOVĚDA =====
function speakRecipe() {
  if (!state.gameOver && state.collectedStack.length > 0) returnN(1);

  const parts = state.config.recipeDisplay.map(it => it.spoken || it.label);
  const text = parts.length > 1
    ? parts.slice(0, -1).join(', ') + ' a ' + parts[parts.length - 1] + '.'
    : parts[0] + '.';

  const speak = (voices) => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = 'cs-CZ';
    utt.rate  = 0.85;
    const cz = voices.find(v => v.lang.startsWith('cs') && /zuzana|dagmar|female/i.test(v.name))
             || voices.find(v => v.lang.startsWith('cs'));
    if (cz) utt.voice = cz;
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);
  };

  const voices = speechSynthesis.getVoices();
  if (voices.length) {
    speak(voices);
  } else {
    speechSynthesis.addEventListener('voiceschanged', () => speak(speechSynthesis.getVoices()), { once: true });
  }
}

function closeRecipeModal() {
  document.getElementById('recipe-modal').classList.add('hidden');
}

function closeIntroOverlay() {
  document.getElementById('overlay-intro').classList.add('hidden');
}

// ===== NÁVOD (README MODAL) =====
function openReadme() {
  document.getElementById('readme-modal').classList.remove('hidden');
  document.addEventListener('keydown', _readmeEsc);
}
function closeReadme() {
  document.getElementById('readme-modal').classList.add('hidden');
  document.removeEventListener('keydown', _readmeEsc);
}
function closeReadmeOnBg(e) {
  if (e.target === document.getElementById('readme-modal')) closeReadme();
}
function _readmeEsc(e) { if (e.key === 'Escape') closeReadme(); }

// ===== NAVIGACE =====
function goHome() {
  state.gameOver = true;
  clearWindTimers();
  closeReadme();
  showScreen('screen-title');
}

function restartGame() {
  startGame(state.difficulty);
}

// ===== DRAG & DROP =====
function attachDrag(el, obj, windTimer) {
  el.addEventListener('pointerdown', e => startDrag(e, el, obj, windTimer));
}

function startDrag(e, el, obj, windTimer) {
  if (state.gameOver) return;
  if (el.classList.contains('flying') || el.classList.contains('dragging')) return;
  e.preventDefault();
  el.setPointerCapture(e.pointerId);

  const scene     = document.getElementById('game-scene');
  const sceneRect = scene.getBoundingClientRect();
  const elRect    = el.getBoundingClientRect();
  const offsetX   = e.clientX - elRect.left;
  const offsetY   = e.clientY - elRect.top;
  const initLeft  = elRect.left - sceneRect.left;
  const initTop   = elRect.top  - sceneRect.top;

  el.style.left       = initLeft + 'px';
  el.style.top        = initTop  + 'px';
  el.style.bottom     = 'auto';
  el.style.transition = 'none';
  el.style.zIndex     = '100';
  el.classList.add('dragging');

  if (windTimer != null) {
    clearTimeout(windTimer);
    const idx = windTimers.indexOf(windTimer);
    if (idx !== -1) windTimers.splice(idx, 1);
  }

  const cauldron = document.getElementById('cauldron-wrap');

  function isOverDrop(cx, cy) {
    const cr  = cauldron.getBoundingClientRect();
    const pad = Math.max(cr.width, cr.height) * 0.6;
    return cx >= cr.left - pad && cx <= cr.right  + pad &&
           cy >= cr.top  - pad && cy <= cr.bottom + pad;
  }

  function onMove(ev) {
    ev.preventDefault();
    el.style.left = (ev.clientX - sceneRect.left - offsetX) + 'px';
    el.style.top  = (ev.clientY - sceneRect.top  - offsetY) + 'px';
    cauldron.classList.toggle('drop-active', isOverDrop(ev.clientX, ev.clientY));
  }

  function finish(ev) {
    el.removeEventListener('pointermove',   onMove);
    el.removeEventListener('pointerup',     finish);
    el.removeEventListener('pointercancel', finish);
    el.style.zIndex = '';
    el.classList.remove('dragging');
    cauldron.classList.remove('drop-active');

    if (ev.type !== 'pointercancel' && isOverDrop(ev.clientX, ev.clientY)) {
      el.style.left = initLeft + 'px';
      el.style.top  = initTop  + 'px';
      handleClick(obj, el);
    } else {
      const sw  = sceneRect.width;
      const sh  = sceneRect.height;
      const elW = el.offsetWidth;
      const elH = el.offsetHeight;
      const cl  = ev.type === 'pointercancel' ? initLeft : parseFloat(el.style.left);
      const ct  = ev.type === 'pointercancel' ? initTop  : parseFloat(el.style.top);
      const nx  = Math.max(0, Math.min(cl, sw - elW));
      const ny  = Math.max(0, Math.min(ct, sh - elH));
      obj.x     = (nx / sw) * 100;
      obj.y     = Math.max(0, (sh - ny - elH) / sh * 100);
      el.style.left       = obj.x + '%';
      el.style.bottom     = obj.y + '%';
      el.style.top        = 'auto';
      el.style.transition = '';
    }
  }

  el.addEventListener('pointermove',   onMove);
  el.addEventListener('pointerup',     finish);
  el.addEventListener('pointercancel', finish);
}

// ===== ZVUKOVÉ EFEKTY (Web Audio API) =====
let _audioCtx = null;
function initAudioContext() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

function _playTone(ctx, freq, startTime, duration, volume, type) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playStartSound() {
  try {
    const ctx = initAudioContext();
    const t = ctx.currentTime;
    const notes = [523, 659, 784];
    notes.forEach((f, i) => _playTone(ctx, f, t + i * 0.13, 0.25, 0.3, 'sine'));
  } catch (e) {}
}

function playSuccessSound() {
  try {
    const ctx = initAudioContext();
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => _playTone(ctx, f, t + i * 0.14, 0.3, 0.4, 'triangle'));
  } catch (e) {}
}

function playFailSound() {
  try {
    const ctx = initAudioContext();
    const t = ctx.currentTime;
    _playTone(ctx, 330, t,        0.18, 0.35, 'sawtooth');
    _playTone(ctx, 220, t + 0.18, 0.22, 0.25, 'sawtooth');
    _playTone(ctx, 147, t + 0.36, 0.3,  0.15, 'sawtooth');
  } catch (e) {}
}
