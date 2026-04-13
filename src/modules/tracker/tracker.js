let currentStats = {
    tasks: "0 из 0",
    water: "0 л",
    sport: "0 мин",
    reading: "0 мин",
    sleep: "0 ч"
};

let weeklyData = {
    tasks: [6, 4, 2, 1, 3, 5, 4],
    labels: ["П", "В", "С", "Ч", "П", "СБ", "ВС"]
};

export function getTodayDate() {
    const now = new Date();
    const months = ["января", "февраля", "марта", "апреля", "мая", "июня", 
                    "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${now.getDate()} ${months[now.getMonth()]}`;
}

export function getCurrentStats() {
    const saved = localStorage.getItem("dailyStats");
    if (saved) {
        currentStats = JSON.parse(saved);
    }
    return currentStats;
}

export function updateTrackerStats(stats) {
    currentStats = stats;
    localStorage.setItem("dailyStats", JSON.stringify(stats));
}

export function getWeeklyProgress() {
    const saved = localStorage.getItem("weeklyProgress");
    if (saved) {
        return JSON.parse(saved);
    }
    return weeklyData;
}

export function updateWeeklyProgress(type, value) {
    weeklyData[type] = weeklyData[type] || [];
    weeklyData[type].push(value);
    if (weeklyData[type].length > 7) weeklyData[type].shift();
    localStorage.setItem("weeklyProgress", JSON.stringify(weeklyData));
}