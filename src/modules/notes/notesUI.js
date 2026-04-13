import { getAllNotes, addNote, deleteNote, getNotePreview } from "./notes.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderNotesUI() {
    const container = getMainContainer();
    const notes = getAllNotes();
    
    container.innerHTML = `
        <div class="notes-module">
            <div class="notes-header">
                <h2>Заметки</h2>
                <button id="createNoteBtn" class="add-btn">+ Добавить</button>
            </div>
            <div class="notes-list" id="notesList">
                ${notes.map(note => `
                    <div class="note-card" data-id="${note.id}">
                        <h3 class="note-title">${escapeHtml(note.title)}</h3>
                        <p class="note-preview">${escapeHtml(getNotePreview(note.content))}</p>
                        <div class="note-actions">
                            <button class="edit-note" data-id="${note.id}">✏️ Редактировать</button>
                            <button class="delete-note" data-id="${note.id}">🗑 Удалить</button>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
    
    document.getElementById("createNoteBtn").addEventListener("click", createNewNote);
    
    document.querySelectorAll(".edit-note").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            navigateToNote(id);
        });
    });
    
    document.querySelectorAll(".delete-note").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id);
            if (confirm("Удалить заметку?")) {
                deleteNote(id);
                renderNotesUI();
            }
        });
    });
}

function createNewNote() {
    const title = prompt("Название заметки:", "Новая заметка");
    if (title !== null) {
        import("./notes.js").then(module => {
            module.addNote(title, "");
            renderNotesUI();
        });
    }
}

function navigateToNote(id) {
    window.location.hash = `note/${id}`;
    import("./noteUI.js").then(module => {
        module.renderNoteUI(id);
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