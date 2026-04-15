import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";

function initApp() {
  console.log("App started");
  
  // Условно загружаем manifest для PWA
  // (пропускаем в GitHub Codespaces туннеле, где он перенаправляется)
  if (typeof window !== "undefined" && !window.location.hostname.includes("app.github.dev")) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";
    document.head.appendChild(link);
  }
  
  initUI();
  initRouter();
  registerServiceWorker();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported");
    return;
  }

  navigator.serviceWorker.register("/src/serviceWorker.js")
    .then(registration => {
      console.log("Service Worker registered:", registration);
    })
    .catch(error => {
      console.log("Service Worker registration failed:", error);
    });
}

initApp();
