let settings = loadSettings();

function loadSettings() {
    const saved = localStorage.getItem("settings");
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        appTheme: "light",
        colorTheme: "purple"
    };
}

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function getSettings() {
    return { ...settings };
}

export function updateSettings(updates) {
    settings = { ...settings, ...updates };
    saveSettings();
    applySettings();
    return settings;
}

export function applySettings() {
    if (settings.appTheme === "dark") {
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    } else {
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    }
    
    document.body.setAttribute("data-color-theme", settings.colorTheme);
}

export function getColorThemes() {
    return [
        { id: "purple", name: "Фиолетовый", primary: "#8b5cf6" },
        { id: "blue", name: "Синий", primary: "#3b82f6" },
        { id: "green", name: "Зелёный", primary: "#10b981" },
        { id: "orange", name: "Оранжевый", primary: "#f59e0b" }
    ];
}