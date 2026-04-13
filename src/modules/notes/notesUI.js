import { getAllNotes, getNotePreview } from "./notes.js";
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
                ${notes.length ? notes.map(note => `
                    <div class="note-card" data-id="${note.id}">
                        <h3 class="note-title">${escapeHtml(note.title)}</h3>
                        <p class="note-preview">${escapeHtml(getNotePreview(note.content))}</p>
                    </div>
                `).join("") : `
                    <div class="empty-state">
                        <p>Пока нет заметок.</p>
                    </div>
                `}
            </div>
        </div>
    `;

    document.getElementById("createNoteBtn").addEventListener("click", createNewNote);

    document.querySelectorAll(".note-card").forEach(card => {
        card.addEventListener("click", () => {
            navigateToNote(parseInt(card.dataset.id, 10));
        });
    });
}

function createNewNote() {
    const title = prompt("Название заметки:", "Новая заметка");
    if (title !== null) {
        import("./notes.js").then(module => {
            const note = module.addNote(title, "");
            navigateToNote(note.id);
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
