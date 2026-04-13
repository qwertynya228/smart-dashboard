import { getSettings, updateSettings, getColorThemes } from "./settings.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderSettingsUI() {
    const container = getMainContainer();
    const settings = getSettings();
    const themes = getColorThemes();
    
    container.innerHTML = `
        <div class="settings-module">
            <h2>Настройки</h2>
            
            <div class="settings-section">
                <h3>Тема приложения</h3>
                <div class="settings-option">
                    <label class="radio-label">
                        <input type="radio" name="appTheme" value="light" ${settings.appTheme === "light" ? "checked" : ""}>
                        <span>☀️ Светлая</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="appTheme" value="dark" ${settings.appTheme === "dark" ? "checked" : ""}>
                        <span>🌙 Тёмная</span>
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Цветовая тема</h3>
                <div class="color-themes">
                    ${themes.map(theme => `
                        <label class="color-theme-label">
                            <input type="radio" name="colorTheme" value="${theme.id}" ${settings.colorTheme === theme.id ? "checked" : ""}>
                            <div class="color-preview" style="background: ${theme.primary}"></div>
                            <span>${theme.name}</span>
                        </label>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
    
    document.querySelectorAll("input[name='appTheme']").forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.checked) {
                updateSettings({ appTheme: e.target.value });
            }
        });
    });
    
    document.querySelectorAll("input[name='colorTheme']").forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.checked) {
                updateSettings({ colorTheme: e.target.value });
            }
        });
    });
}