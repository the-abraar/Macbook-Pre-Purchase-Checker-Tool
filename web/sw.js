/**
 * MacPreCheck Offline Service Worker
 * Ensures full functionality offline in shops without Wi-Fi
 */

const CACHE_NAME = "macprecheck-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/keyboard.css",
  "./css/display_test.css",
  "./js/app.js",
  "./js/wizard.js",
  "./js/analyzer.js",
  "./js/benchmarks.js",
  "./js/calculator.js",
  "./js/keyboard.js",
  "./js/screen_test.js",
  "./js/media_test.js",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => {
        // If offline and request is for page, return cached index
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
