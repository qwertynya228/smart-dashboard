let settings = loadSettings();

function normalizeThemeId(colorTheme) {
    const legacyMap = {
        purple: "lilac",
        blue: "sky",
        green: "mint",
        orange: "sand"
    };

    return legacyMap[colorTheme] || colorTheme || "mint";
}

function loadSettings() {
    const saved = localStorage.getItem("settings");
    if (saved) {
        const parsed = JSON.parse(saved);
        return {
            appTheme: parsed.appTheme || "light",
            colorTheme: normalizeThemeId(parsed.colorTheme)
        };
    }

    return {
        appTheme: "light",
        colorTheme: "mint"
    };
}

function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
}

export function getSettings() {
    return { ...settings };
}

export function updateSettings(updates) {
    settings = {
        ...settings,
        ...updates,
        colorTheme: normalizeThemeId(updates.colorTheme || settings.colorTheme)
    };
    saveSettings();
    applySettings();
    return settings;
}

export function applySettings() {
    document.body.classList.toggle("dark-theme", settings.appTheme === "dark");
    document.body.classList.toggle("light-theme", settings.appTheme !== "dark");
    document.body.setAttribute("data-color-theme", normalizeThemeId(settings.colorTheme));
}

export function getColorThemes() {
    return [
        { id: "mint", name: "Мятный", primary: "#76b59a" },
        { id: "rose", name: "Розовый", primary: "#c78686" },
        { id: "sand", name: "Песочный", primary: "#c9b179" },
        { id: "sky", name: "Небесный", primary: "#7aa6c9" },
        { id: "lilac", name: "Лиловый", primary: "#b49ac9" }
    ];
}
