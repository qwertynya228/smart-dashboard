let currentStats = {
    tasks: 0,
    water: 0,
    sport: 0,
    reading: 0,
    sleep: 0
};

let lastResetDate = localStorage.getItem("lastResetDate") || null;

const savedStats = localStorage.getItem("dailyStats");
if (savedStats) {
    try {
        currentStats = JSON.parse(savedStats);
    } catch (e) {
        currentStats = {
            tasks: 0,
            water: 0,
            sport: 0,
            reading: 0,
            sleep: 0
        };
    }
}

let weeklyData = {
    tasks: [],
    water: [],
    sport: [],
    reading: [],
    sleep: [],
    labels: ["П", "В", "С", "Ч", "П", "СБ", "ВС"]
};

function normalizeWeeklyArray(array) {
    const result = Array.isArray(array) ? [...array] : [];
    while (result.length < 7) {
        result.unshift(0);
    }
    return result.slice(-7);
}

function checkDailyReset() {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
        if (lastResetDate) {
            updateWeeklyProgress('tasks', currentStats.tasks);
            updateWeeklyProgress('water', currentStats.water);
            updateWeeklyProgress('sport', currentStats.sport);
            updateWeeklyProgress('reading', currentStats.reading);
            updateWeeklyProgress('sleep', currentStats.sleep);
        }
        currentStats = {
            tasks: 0,
            water: 0,
            sport: 0,
            reading: 0,
            sleep: 0
        };
        lastResetDate = today;
        localStorage.setItem("lastResetDate", lastResetDate);
        localStorage.setItem("dailyStats", JSON.stringify(currentStats));
    }
}

export function getTodayDate() {
    const now = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", 
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${now.getDate()} ${months[now.getMonth()]}`;
}

export function getCurrentStats() {
    checkDailyReset();
    return currentStats;
}

export function updateTrackerStats(stats) {
    currentStats = stats;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
}

export function getWeeklyProgress() {
    const saved = localStorage.getItem("weeklyProgress");
    if (saved) {
        try {
            weeklyData = JSON.parse(saved);
        } catch (e) {
            weeklyData = {
                tasks: [],
                water: [],
                sport: [],
                reading: [],
                sleep: [],
                labels: ["П", "В", "С", "Ч", "П", "СБ", "ВС"]
            };
        }
    }
    weeklyData.tasks = normalizeWeeklyArray(weeklyData.tasks);
    weeklyData.water = normalizeWeeklyArray(weeklyData.water);
    weeklyData.sport = normalizeWeeklyArray(weeklyData.sport);
    weeklyData.reading = normalizeWeeklyArray(weeklyData.reading);
    weeklyData.sleep = normalizeWeeklyArray(weeklyData.sleep);
    return weeklyData;
}

export function updateWeeklyProgress(type, value) {
    weeklyData[type] = weeklyData[type] || [];
    weeklyData[type].push(value);
    if (weeklyData[type].length > 7) {
        weeklyData[type].shift();
    }
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyData));
}

export function updateWeeklyProgressForToday(type, value) {
    weeklyData[type] = weeklyData[type] || [];
    const dayIndex = (new Date().getDay() + 6) % 7; // 0 - понедельник, 6 - воскресенье
    weeklyData[type][dayIndex] = value;
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyData));
}