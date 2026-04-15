const CACHE_NAME = "smart-dashboard-v2";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/src/main.js",
  "/src/styles/reset.css",
  "/src/styles/variables.css",
  "/src/styles/main.css"
];

self.addEventListener("install", event => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        })
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // Пропускаем запросы через туннель (github.dev)
  if (event.request.url.includes("github.dev") || event.request.url.includes("manifest.json")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
        // Возвращаем пустой ответ для других типов запросов
        return undefined;
      });
    })
  );
});
