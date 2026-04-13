const CACHE_NAME = "smart-dashboard-v2";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/public/index.html",
  "/offline.html",
  "/public/offline.html",
  "/manifest.json",
  "/src/main.js",
  "/src/styles/reset.css",
  "/src/styles/variables.css",
  "/src/styles/main.css"
];

self.addEventListener("install", event => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
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
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
        return undefined;
      });
    })
  );
});
