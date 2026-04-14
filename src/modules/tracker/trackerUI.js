import { getTodayDate, getCurrentStats, getWeeklyProgress, updateTrackerStats } from "./tracker.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { getTasks } from "../tasks/tasks.js";

export function renderTrackerUI() {
    const container = getMainContainer();
    const rawStats = getCurrentStats();
    const today = getTodayDate();
    const weekly = getWeeklyProgress();

    // Обновить tasks из tasks модуля
    const completedTasks = getTasks().filter(t => t.completed).length;
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
                    <input type="number" class="stat-input" value="${stats.tasks}" readonly>
                </div>
                <div class="stat-card">
                    <h3>Вода</h3>
                    <input type="number" class="stat-input" data-type="water" value="${stats.water}" min="0" step="0.1">
                </div>
                <div class="stat-card">
                    <h3>Спорт</h3>
                    <input type="number" class="stat-input" data-type="sport" value="${stats.sport}" min="0">
                </div>
                <div class="stat-card">
                    <h3>Чтение</h3>
                    <input type="number" class="stat-input" data-type="reading" value="${stats.reading}" min="0">
                </div>
                <div class="stat-card stat-wide">
                    <h3>Сон</h3>
                    <input type="number" class="stat-input" data-type="sleep" value="${stats.sleep}" min="0" step="0.1">
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

    // Event listeners for inputs
    const inputs = container.querySelectorAll('.stat-input:not([readonly])');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const type = input.dataset.type;
            const value = parseFloat(input.value) || 0;
            stats[type] = value;
            updateTrackerStats(stats);
        });
    });
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
