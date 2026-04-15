import { getTasks, addTask, completeTask, deleteTask } from "./tasks.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { updateTrackerStats, updateWeeklyProgressForToday } from "../tracker/tracker.js";

let pendingHabits = {
    water: 0,
    sport: 0,
    reading: 0,
    sleep: 0
};

export function renderTasksUI() {
    const container = getMainContainer();
    container.innerHTML = `
        <div class="tasks-module">
            <div class="tasks-header">
                <h2>Задачи</h2>
            </div>

            <div class="tasks-list" id="tasksList"></div>

            <button id="addTaskBtn" class="text-add">+ Добавить</button>

            <div class="habits-list">
                ${renderHabitCard("Вода", "water", "0.5", "л")}
                ${renderHabitCard("Спорт", "sport", "15", "мин")}
                ${renderHabitCard("Чтение", "reading", "30", "мин")}
                ${renderHabitCard("Сон", "sleep", "0.5", "ч")}
            </div>

            <button id="saveAllBtn" class="save-btn">Сохранить</button>
        </div>
    `;

    loadTasks();
    loadHabits();

    document.getElementById("addTaskBtn").addEventListener("click", showAddTaskDialog);
    document.getElementById("saveAllBtn").addEventListener("click", saveAllData);

    document.querySelectorAll(".habit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const habit = btn.dataset.habit;
            const amount = parseFloat(btn.dataset.amount);
            pendingHabits[habit] = Number((pendingHabits[habit] + amount).toFixed(2));
            updatePendingHabitLabel(habit);
        });
    });

    document.querySelectorAll(".habit-step").forEach(input => {
        input.addEventListener("input", e => {
            const habit = input.dataset.habit;
            const value = parseFloat(input.value);
            pendingHabits[habit] = Number(isNaN(value) ? 0 : value);
        });
    });
}

function renderHabitCard(title, habit, step, unit) {
    return `
        <div class="habit-card">
            <div class="habit-row">
                <div class="habit-title">${title}</div>
                <div class="habit-controls">
                    <input type="number" class="habit-step" style="width: 60px; min-width: 60px; max-width: 60px;" data-habit="${habit}" data-default-step="${step}" value="${step}" min="0" step="0.5">
                    <button class="habit-btn" data-habit="${habit}" data-amount="${step}">+</button>
                </div>
            </div>
            <div class="habit-meta">Сегодня: <span id="${habit}Value">0</span> ${unit}</div>
        </div>
    `;
}

function loadTasks() {
    const tasks = getTasks();
    const tasksList = document.getElementById("tasksList");

    tasksList.innerHTML = tasks.length ? tasks.map(task => `
        <div class="task-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
            <span class="task-title">${escapeHtml(task.title)}</span>
            <button class="delete-task" data-id="${task.id}" aria-label="Удалить">x</button>
        </div>
    `).join("") : `
        <div class="empty-state">
            <p>Список задач пуст.</p>
        </div>
    `;

    document.querySelectorAll(".task-checkbox").forEach(cb => {
        cb.addEventListener("change", e => {
            const id = parseInt(e.target.dataset.id, 10);
            completeTask(id);
            loadTasks();
            updateStats();
        });
    });

    document.querySelectorAll(".delete-task").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = parseInt(e.target.dataset.id, 10);
            deleteTask(id);
            loadTasks();
            updateStats();
        });
    });
}

function showAddTaskDialog() {
    const title = prompt("Введите название задачи:");
    if (title && title.trim()) {
        addTask({ title: title.trim(), points: 1 });
        loadTasks();
        updateStats();
    }
}

function loadHabits() {
    const habits = JSON.parse(localStorage.getItem("habits") || '{"water":0,"sport":0,"reading":0,"sleep":0}');
    document.getElementById("waterValue").textContent = habits.water;
    document.getElementById("sportValue").textContent = habits.sport;
    document.getElementById("readingValue").textContent = habits.reading;
    document.getElementById("sleepValue").textContent = habits.sleep;
}

function addHabitValue(habit, amount) {
    const habits = JSON.parse(localStorage.getItem("habits") || '{"water":0,"sport":0,"reading":0,"sleep":0}');
    habits[habit] += amount;
    localStorage.setItem("habits", JSON.stringify(habits));
    loadHabits();
    updateStats();
}

function updatePendingHabitLabel(habit) {
    const stepEl = document.querySelector(`.habit-step[data-habit="${habit}"]`);
    if (stepEl) {
        stepEl.value = pendingHabits[habit];
    }
}

function resetHabitStepLabels() {
    document.querySelectorAll(".habit-step").forEach(stepEl => {
        stepEl.value = stepEl.dataset.defaultStep;
    });
}

function saveAllData() {
    const habits = JSON.parse(localStorage.getItem("habits") || '{"water":0,"sport":0,"reading":0,"sleep":0}');
    Object.keys(pendingHabits).forEach(habit => {
        habits[habit] += pendingHabits[habit];
    });
    localStorage.setItem("habits", JSON.stringify(habits));
    pendingHabits = {
        water: 0,
        sport: 0,
        reading: 0,
        sleep: 0
    };
    resetHabitStepLabels();
    loadHabits();
    updateStats();

    // Обновить недельный прогресс для текущего дня
    const totalTasks = getTasks().length;
    const completedTasks = getTasks().filter(task => task.completed).length;
    updateWeeklyProgressForToday('tasks', completedTasks);
    updateWeeklyProgressForToday('water', habits.water);
    updateWeeklyProgressForToday('sport', habits.sport);
    updateWeeklyProgressForToday('reading', habits.reading);
    updateWeeklyProgressForToday('sleep', habits.sleep);

    alert("Данные сохранены!");
}

function updateStats() {
    const totalTasks = getTasks().length;
    const completedTasks = getTasks().filter(task => task.completed).length;
    const habits = JSON.parse(localStorage.getItem("habits") || '{"water":0,"sport":0,"reading":0,"sleep":0}');

    const stats = {
        tasks: completedTasks,
        water: habits.water,
        sport: habits.sport,
        reading: habits.reading,
        sleep: habits.sleep
    };

    localStorage.setItem("dailyStats", JSON.stringify(stats));
    updateTrackerStats(stats);

    // Обновить недельный прогресс для задач
    updateWeeklyProgressForToday('tasks', completedTasks);
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}
