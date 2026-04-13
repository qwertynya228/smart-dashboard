import { navigate } from "./router.js";
import { applySettings, getSettings } from "../modules/settings/settings.js";

export function initUI() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="app-container">
            <header class="app-header">
                <h1>📊 Smart Dashboard</h1>
                <button id="menuToggle" class="menu-toggle">☰</button>
            </header>
            <nav class="app-nav" id="appNav">
                <button data-path="/tasks" class="nav-btn">📋 Задачи</button>
                <button data-path="/notes" class="nav-btn">📝 Заметки</button>
                <button data-path="/tracker" class="nav-btn">📈 Статистика</button>
                <button data-path="/profile" class="nav-btn">👤 Профиль</button>
                <button data-path="/settings" class="nav-btn">⚙️ Настройки</button>
            </nav>
            <main id="main-content" class="main-content"></main>
        </div>
    `;
    
    // Применяем сохранённые настройки
    const settings = getSettings();
    applySettings();
    
    // Навигация
    const buttons = document.querySelectorAll(".nav-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const path = btn.dataset.path;
            navigate(path);
            highlightActiveButton(path);
            closeMobileMenu();
        });
    });
    
    // Мобильное меню
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("appNav");
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });
    
    // Подсветка активной кнопки
    const currentPath = window.location.pathname;
    highlightActiveButton(currentPath);
}

function highlightActiveButton(path) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        if (btn.dataset.path === path) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function closeMobileMenu() {
    const nav = document.getElementById("appNav");
    nav.classList.remove("open");
}

export function getMainContainer() {
    return document.getElementById("main-content");
}