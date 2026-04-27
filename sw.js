const CACHE = 'lektvar-v1';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './assets/background/background-meadow.png',
  './assets/characters/witch-idle.png',
  './assets/characters/witch-making-magic.png',
  './assets/characters/witch-happy.png',
  './assets/characters/witch-scared.png',
  './assets/characters/witch-reading.png',
  './assets/characters/witch-with-poison.png',
  './assets/characters/cat.png',
  './assets/characters/bat.png',
  './assets/goblet/goblet-idle.png',
  './assets/goblet/goblet-success.png',
  './assets/goblet/goblet-fail.png',
  './assets/ingredients/flower-yellow.png',
  './assets/ingredients/flower-red.png',
  './assets/ingredients/flower-purple.png',
  './assets/ingredients/pinecone.png',
  './assets/ingredients/stone-white.png',
  './assets/ingredients/stone-grey.png',
  './assets/ingredients/leaf-green.png',
  './assets/ingredients/camp-fire.png',
  './assets/ingredients/heart-pink.png',
  './assets/ingredients/heart-white.png',
  './assets/ingredients/star-pink.png',
  './assets/ingredients/star-white.png',
  './assets/ingredients/mushroom.png',
  './assets/ingredients/stump.png',
  './assets/ui/icon-home.png',
  './assets/ui/icon-recipe.png',
  './assets/ui/icon-sound.png',
  './assets/ui/icon-back.png',
  './assets/ui/recipe-panel.png',
  './assets/ui/readme.png',
  './assets/ui/how-to-play.png',
];

// Instalace: nacachuj všechny assety
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivace: smaž staré cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, fallback na síť
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
