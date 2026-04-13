import { getTodayDate, getCurrentStats, getWeeklyProgress } from "./tracker.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderTrackerUI() {
    const container = getMainContainer();
    const stats = getCurrentStats();
    const today = getTodayDate();
    const weekly = getWeeklyProgress();

    container.innerHTML = `
        <div class="tracker-module">
            <h2>Статистика</h2>
            <p class="today-date">Сегодня: ${today}</p>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Задачи</h3>
                    <p class="stat-value">${stats.tasks || "0 из 0"}</p>
                </div>
                <div class="stat-card">
                    <h3>Вода</h3>
                    <p class="stat-value">${stats.water || "0 л"}</p>
                </div>
                <div class="stat-card">
                    <h3>Спорт</h3>
                    <p class="stat-value">${stats.sport || "0 мин"}</p>
                </div>
                <div class="stat-card">
                    <h3>Чтение</h3>
                    <p class="stat-value">${stats.reading || "0 мин"}</p>
                </div>
                <div class="stat-card stat-wide">
                    <h3>Сон</h3>
                    <p class="stat-value">${stats.sleep || "0 ч"}</p>
                </div>
            </div>

            <div class="weekly-section">
                <div class="weekly-header">
                    <h3>Недельный прогресс</h3>
                    <select class="weekly-select" aria-label="Тип прогресса">
                        <option>Задачи</option>
                    </select>
                </div>
                <div class="weekly-chart">
                    ${weekly.tasks.map(value => `
                        <div class="chart-bar-container">
                            <div class="chart-bar" style="height: ${Math.min(value * 20, 100)}px"></div>
                        </div>
                    `).join("")}
                </div>
                <div class="weekly-days">
                    ${weekly.labels.map(day => `<span>${day}</span>`).join("")}
                </div>
            </div>
        </div>
    `;
}
