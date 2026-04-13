import { getSettings, updateSettings, getColorThemes } from "./settings.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderSettingsUI() {
    const container = getMainContainer();
    const settings = getSettings();
    const themes = getColorThemes();

    container.innerHTML = `
        <div class="settings-module">
            <h2>Настройки</h2>

            <div class="settings-row">
                <div class="settings-row-title">Тема приложения</div>
                <div class="settings-option theme-toggle">
                    <label>
                        <input type="radio" name="appTheme" value="light" ${settings.appTheme === "light" ? "checked" : ""}>
                        <span class="theme-option" title="Светлая"></span>
                    </label>
                    <label>
                        <input type="radio" name="appTheme" value="dark" ${settings.appTheme === "dark" ? "checked" : ""}>
                        <span class="theme-option" title="Тёмная" style="background:#3a3a3a"></span>
                    </label>
                </div>
            </div>

            <div class="settings-row">
                <div class="settings-row-title">Цветовая тема</div>
                <div class="settings-option color-themes">
                    ${themes.map(theme => `
                        <label>
                            <input type="radio" name="colorTheme" value="${theme.id}" ${settings.colorTheme === theme.id ? "checked" : ""}>
                            <span class="color-theme-option" style="background:${theme.primary}" title="${theme.name}"></span>
                        </label>
                    `).join("")}
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll("input[name='appTheme']").forEach(radio => {
        radio.addEventListener("change", e => {
            if (e.target.checked) {
                updateSettings({ appTheme: e.target.value });
            }
        });
    });

    document.querySelectorAll("input[name='colorTheme']").forEach(radio => {
        radio.addEventListener("change", e => {
            if (e.target.checked) {
                updateSettings({ colorTheme: e.target.value });
            }
        });
    });
}
