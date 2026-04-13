import { getTasks, addTask, completeTask, deleteTask, getTotalPoints } from "./tasks.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { updateTrackerStats } from "../tracker/tracker.js";

let currentView = "tasks"; // tasks, water, sport, reading, sleep

export function renderTasksUI() {
    const container = getMainContainer();
    container.innerHTML = `
        <div class="tasks-module">
            <div class="tasks-header">
                <h2>Задачи</h2>
                <button id="addTaskBtn" class="add-btn">+ Добавить</button>
            </div>
            
            <div class="tasks-list" id="tasksList"></div>
            
            <div class="habits-section">
                <h3>Вода</h3>
                <div class="habit-control">
                    <button class="habit-btn" data-habit="water" data-amount="0.5">+0.5 л</button>
                    <span id="waterValue">0</span> л
                </div>
                
                <h3>Спорт</h3>
                <div class="habit-control">
                    <button class="habit-btn" data-habit="sport" data-amount="15">+15 мин</button>
                    <span id="sportValue">0</span> мин
                </div>
                
                <h3>Чтение</h3>
                <div class="habit-control">
                    <button class="habit-btn" data-habit="reading" data-amount="30">+30 мин</button>
                    <span id="readingValue">0</span> мин
                </div>
                
                <h3>Сон</h3>
                <div class="habit-control">
                    <button class="habit-btn" data-habit="sleep" data-amount="0.5">+0.5 ч</button>
                    <span id="sleepValue">0</span> ч
                </div>
            </div>
            
            <button id="saveAllBtn" class="save-btn">Сохранить</button>
        </div>
    `;
    
    loadTasks();
    loadHabits();
    
    document.getElementById("addTaskBtn").addEventListener("click", showAddTaskDialog);
    document.getElementById("saveAllBtn").addEventListener("click", saveAllData);
    
    document.querySelectorAll(".habit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const habit = btn.dataset.habit;
            const amount = parseFloat(btn.dataset.amount);
            addHabitValue(habit, amount);
        });
    });
}

function loadTasks() {
    const tasks = getTasks();
    const tasksList = document.getElementById("tasksList");
    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    
    tasksList.innerHTML = `
        <div class="tasks-category">
            <h4>Активные</h4>
            ${incompleteTasks.map(task => `
                <div class="task-item" data-id="${task.id}">
                    <input type="checkbox" class="task-checkbox" data-id="${task.id}">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <button class="delete-task" data-id="${task.id}">🗑</button>
                </div>
            `).join("")}
        </div>
        <div class="tasks-category">
            <h4>Выполненные</h4>
            ${completedTasks.map(task => `
                <div class="task-item completed" data-id="${task.id}">
                    <input type="checkbox" class="task-checkbox" data-id="${task.id}" checked disabled>
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <button class="delete-task" data-id="${task.id}">🗑</button>
                </div>
            `).join("")}
        </div>
    `;
    
    document.querySelectorAll(".task-checkbox").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const id = parseInt(e.target.dataset.id);
            completeTask(id);
            loadTasks();
            updateStats();
        });
    });
    
    document.querySelectorAll(".delete-task").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
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

function saveAllData() {
    updateStats();
    alert("Данные сохранены!");
}

function updateStats() {
    const totalTasks = getTasks().length;
    const completedTasks = getTasks().filter(t => t.completed).length;
    const habits = JSON.parse(localStorage.getItem("habits") || '{"water":0,"sport":0,"reading":0,"sleep":0}');
    
    const stats = {
        tasks: `${completedTasks} из ${totalTasks}`,
        water: habits.water + " л",
        sport: habits.sport + " мин",
        reading: habits.reading + " мин",
        sleep: habits.sleep + " ч"
    };
    
    localStorage.setItem("dailyStats", JSON.stringify(stats));
    updateTrackerStats(stats);
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}