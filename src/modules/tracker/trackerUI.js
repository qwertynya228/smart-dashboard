import { getTodayDate, getCurrentStats, getWeeklyProgress, updateTrackerStats } from "./tracker.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { getTasks } from "../tasks/tasks.js";

export function renderTrackerUI() {
    const container = getMainContainer();
    const rawStats = getCurrentStats();
    const today = getTodayDate();
    const weekly = getWeeklyProgress();

    // Обновить tasks из tasks модуля
    const tasks = getTasks();
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const stats = {
        tasks: completedTasks,
        water: rawStats.water,
        sport: rawStats.sport,
        reading: rawStats.reading,
        sleep: rawStats.sleep
    };

    // Сохранить обновленные stats
    updateTrackerStats(stats);

    container.innerHTML = `
        <div class="tracker-module">
            <h2>Статистика</h2>
            <p class="today-date">Сегодня: ${today}</p>

            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Задачи</h3>
                    <p class="stat-value">${completedTasks} из ${totalTasks}</p>
                </div>
                <div class="stat-card">
                    <h3>Вода</h3>
                    <p class="stat-value">${formatStatValue('water', stats.water)}</p>
                </div>
                <div class="stat-card">
                    <h3>Спорт</h3>
                    <p class="stat-value">${formatStatValue('sport', stats.sport)}</p>
                </div>
                <div class="stat-card">
                    <h3>Чтение</h3>
                    <p class="stat-value">${formatStatValue('reading', stats.reading)}</p>
                </div>
                <div class="stat-card stat-wide">
                    <h3>Сон</h3>
                    <p class="stat-value">${formatStatValue('sleep', stats.sleep)}</p>
                </div>
            </div>

            <div class="weekly-section">
                <div class="weekly-header">
                    <h3>Недельный прогресс</h3>
                    <select class="weekly-select" aria-label="Тип прогресса">
                        <option value="tasks">Задачи</option>
                        <option value="water">Вода</option>
                        <option value="sport">Спорт</option>
                        <option value="reading">Чтение</option>
                        <option value="sleep">Сон</option>
                    </select>
                </div>
                <div class="weekly-chart" id="weeklyChart">
                    ${renderChart('tasks', weekly)}
                </div>
                <div class="weekly-days">
                    ${weekly.labels.map(day => `<span>${day}</span>`).join("")}
                </div>
            </div>
        </div>
    `;

    // Event listener for select
    const select = container.querySelector('.weekly-select');
    select.addEventListener('change', () => {
        const type = select.value;
        const chart = container.querySelector('#weeklyChart');
        chart.innerHTML = renderChart(type, weekly);
    });
}

function formatStatValue(type, value) {
    const normalized = parseFloat(value) || 0;
    switch (type) {
        case 'water':
            return `${normalized} л`;
        case 'sport':
            return `${normalized} мин`;
        case 'reading':
            return `${normalized} ч`;
        case 'sleep':
            return `${normalized} ч`;
        default:
            return `${normalized}`;
    }
}

function renderChart(type, weekly) {
    const data = weekly[type] || [];
    const max = Math.max(...data, 1);
    return data.map(value => `
        <div class="chart-bar-container">
            <div class="chart-bar" style="height: ${Math.min((value / max) * 100, 100)}px"></div>
        </div>
    `).join("");
}
