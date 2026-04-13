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
                    <h3>📋 Задачи</h3>
                    <p class="stat-value">${stats.tasks || "0 из 0"}</p>
                </div>
                <div class="stat-card">
                    <h3>💧 Вода</h3>
                    <p class="stat-value">${stats.water || "0 л"}</p>
                </div>
                <div class="stat-card">
                    <h3>🏃 Спорт</h3>
                    <p class="stat-value">${stats.sport || "0 мин"}</p>
                </div>
                <div class="stat-card">
                    <h3>📚 Чтение</h3>
                    <p class="stat-value">${stats.reading || "0 мин"}</p>
                </div>
                <div class="stat-card">
                    <h3>😴 Сон</h3>
                    <p class="stat-value">${stats.sleep || "0 ч"}</p>
                </div>
            </div>
            
            <div class="weekly-section">
                <h3>Недельный прогресс</h3>
                <div class="weekly-header">
                    ${weekly.labels.map(day => `<span class="weekly-day">${day}</span>`).join("")}
                </div>
                <div class="weekly-chart">
                    ${weekly.tasks.map((value, index) => `
                        <div class="chart-bar-container">
                            <div class="chart-bar" style="height: ${Math.min(value * 20, 100)}px">
                                <span class="chart-value">${value}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}