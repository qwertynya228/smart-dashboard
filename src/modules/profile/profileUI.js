import { getProfile, updateProfile, updateAvatar } from "./profile.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderProfileUI() {
    const container = getMainContainer();
    const profile = getProfile();

    container.innerHTML = `
        <div class="profile-module">
            <h2>Профиль</h2>

            <div class="avatar-section">
                ${profile.avatar ? `<img src="${profile.avatar}" class="avatar-preview" alt="Аватар">` : `<div class="avatar-placeholder">?</div>`}
                <input type="file" id="avatarInput" accept="image/*" style="display: none">
                <div class="file-row">
                    <button id="selectAvatarBtn" class="select-file-btn">Выберите файл</button>
                    <span id="fileName" class="file-name">Файл не выбран</span>
                </div>
            </div>

            <div class="profile-form">
                <div class="form-group">
                    <label>Имя</label>
                    <input type="text" id="profileName" value="${escapeHtml(profile.name)}" class="form-input" placeholder="Пользователь">
                </div>

                <div class="form-group">
                    <label>О себе</label>
                    <textarea id="profileBio" class="form-textarea" rows="3" placeholder="Напишите что-нибудь о себе" style="width:325px; min-width:325px; max-width:325px; min-height:59px; resize:vertical;">${escapeHtml(profile.bio || "")}</textarea>
                </div>

                <div class="form-group">
                    <label>Дата рождения</label>
                    <input type="date" id="profileBirth" value="${profile.birthDate || ""}" class="form-input">
                </div>

                <button id="saveProfileBtn" class="save-profile-btn">Сохранить</button>
            </div>
        </div>
    `;

    const fileInput = document.getElementById("avatarInput");
    const fileName = document.getElementById("fileName");

    document.getElementById("selectAvatarBtn").addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", async e => {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            try {
                await updateAvatar(file);
                renderProfileUI();
            } catch (err) {
                alert("Ошибка загрузки файла");
            }
        }
    });

    document.getElementById("saveProfileBtn").addEventListener("click", () => {
        const name = document.getElementById("profileName").value;
        const bio = document.getElementById("profileBio").value;
        const birthDate = document.getElementById("profileBirth").value;

        updateProfile({ name, bio, birthDate });
        alert("Профиль сохранён!");
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}
