import { navigate } from "./router.js";
import { applySettings } from "../modules/settings/settings.js";

export function initUI() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="app-shell">
            <div class="app-frame">
                <main id="main-content" class="main-content"></main>
                <nav class="bottom-nav" id="appNav">
                    <button data-path="/profile" class="nav-btn" aria-label="Профиль">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <circle cx="12" cy="8" r="3.5"></circle>
                            <path d="M4 20c1.5-4 14.5-4 16 0"></path>
                        </svg>
                    </button>
                    <button data-path="/tasks" class="nav-btn" aria-label="Задачи">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <path d="M4 6h12"></path>
                            <path d="M4 12h12"></path>
                            <path d="M4 18h12"></path>
                            <path d="M18 7l2 2 3-3"></path>
                        </svg>
                    </button>
                    <button data-path="/notes" class="nav-btn" aria-label="Заметки">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <path d="M6 4h9l3 3v13H6z"></path>
                            <path d="M9 9h6"></path>
                            <path d="M9 13h6"></path>
                        </svg>
                    </button>
                    <button data-path="/tracker" class="nav-btn" aria-label="Статистика">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <path d="M5 19h14"></path>
                            <rect x="7" y="10" width="3" height="7"></rect>
                            <rect x="11" y="6" width="3" height="11"></rect>
                            <rect x="15" y="12" width="3" height="5"></rect>
                        </svg>
                    </button>
                    <button data-path="/settings" class="nav-btn" aria-label="Настройки">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19 12a7 7 0 0 0-.1-1l2-1.2-2-3.4-2.3.8a7 7 0 0 0-1.6-.9L12 3 9.9 6.3a7 7 0 0 0-1.6.9l-2.3-.8-2 3.4L6 11a7 7 0 0 0 0 2l-2 1.2 2 3.4 2.3-.8a7 7 0 0 0 1.6.9L12 21l2.1-3.3a7 7 0 0 0 1.6-.9l2.3.8 2-3.4L18.9 13a7 7 0 0 0 .1-1z"></path>
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    `;

    applySettings();

    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const path = btn.dataset.path;
            navigate(path);
            highlightActiveButton(path);
        });
    });

    highlightActiveButton(window.location.pathname);
}

function highlightActiveButton(path) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.path === path);
    });
}

export function getMainContainer() {
    return document.getElementById("main-content");
}
