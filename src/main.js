import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";

function initApp() {
  console.log("App started");
  initUI();
  initRouter();
  registerServiceWorker();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return;
  }

  const isLocal =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";

  if (isLocal) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });

    if ("caches" in window) {
      caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
    }
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/src/serviceWorker.js", { scope: "/" })
      .then(registration => {
        console.log("Service Worker registered:", registration);
      })
      .catch(error => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

initApp();
