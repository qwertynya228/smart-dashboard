import { getNoteById, updateNote } from "./notes.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderNoteUI(noteId) {
    const container = getMainContainer();
    const note = getNoteById(noteId);
    
    if (!note) {
        container.innerHTML = `<p>Заметка не найдена. <a href="#" onclick="window.location.hash='notes'">Вернуться к списку</a></p>`;
        return;
    }
    
    container.innerHTML = `
        <div class="note-editor">
            <div class="note-editor-header">
                <button id="backToNotes" class="back-btn">← Назад</button>
                <button id="saveNoteBtn" class="save-btn">Сохранить</button>
            </div>
            <input type="text" id="noteTitle" class="note-title-input" value="${escapeHtml(note.title)}">
            <textarea id="noteContent" class="note-content-input" rows="20">${escapeHtml(note.content)}</textarea>
        </div>
    `;
    
    document.getElementById("backToNotes").addEventListener("click", () => {
        window.location.hash = "notes";
        import("./notesUI.js").then(module => {
            module.renderNotesUI();
        });
    });
    
    document.getElementById("saveNoteBtn").addEventListener("click", () => {
        const newTitle = document.getElementById("noteTitle").value;
        const newContent = document.getElementById("noteContent").value;
        updateNote(noteId, newTitle, newContent);
        alert("Заметка сохранена!");
        window.location.hash = "notes";
        import("./notesUI.js").then(module => {
            module.renderNotesUI();
        });
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