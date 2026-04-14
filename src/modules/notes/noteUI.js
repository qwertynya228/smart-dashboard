import { getNoteById, updateNote, deleteNote } from "./notes.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderNoteUI(noteId) {
    const container = getMainContainer();
    const note = getNoteById(noteId);

    if (!note) {
        container.innerHTML = `
            <div class="empty-state">
                <p>Заметка не найдена.</p>
                <button id="backToNotesMissing" class="add-btn">К списку</button>
            </div>
        `;

        document.getElementById("backToNotesMissing").addEventListener("click", openNotesList);
        return;
    }

    container.innerHTML = `
        <div class="screen slide-in-from-right">
            <div class="note-editor">
                <div class="note-editor-top">
                    <button id="backToNotes" class="icon-btn" aria-label="Назад">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <path d="M15 6l-6 6 6 6"></path>
                        </svg>
                    </button>
                    <input type="text" id="noteTitle" class="note-title-input" value="${escapeHtml(note.title)}" placeholder="Название">
                    <button id="deleteNoteBtn" class="icon-btn danger" aria-label="Удалить">
                        <svg viewBox="0 0 24 24" class="nav-icon" aria-hidden="true">
                            <path d="M4 7h16"></path>
                            <path d="M9 7v-2h6v2"></path>
                            <rect x="6" y="7" width="12" height="13" rx="2"></rect>
                        </svg>
                    </button>
                </div>
                <div class="note-toolbar">
                    <button id="boldBtn" class="toolbar-btn" type="button">B</button>
                    <button id="italicBtn" class="toolbar-btn" type="button">/</button>
                    <button id="listBtn" class="toolbar-btn" type="button">-</button>
                    <button id="numListBtn" class="toolbar-btn" type="button">1.</button>
                </div>
                <textarea id="noteContent" class="note-content-input" rows="20" placeholder="Начните писать...">${escapeHtml(note.content)}</textarea>
            </div>
        </div>
    `;

    const currentScreen = container.querySelector('.screen');
    currentScreen.addEventListener('animationend', () => {
        currentScreen.classList.remove('slide-in-from-right');
    }, { once: true });

    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");

    let saveTimer = null;
    const saveNote = () => {
        updateNote(noteId, titleInput.value, contentInput.value);
    };
    const scheduleSave = () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveNote, 300);
    };

    titleInput.addEventListener("input", scheduleSave);
    contentInput.addEventListener("input", scheduleSave);

    // Toolbar button handlers
    document.getElementById("boldBtn").addEventListener("click", () => formatText(contentInput, "**", "**"));
    document.getElementById("italicBtn").addEventListener("click", () => formatText(contentInput, "*", "*"));
    document.getElementById("listBtn").addEventListener("click", () => formatList(contentInput, "- "));
    document.getElementById("numListBtn").addEventListener("click", () => formatNumberedList(contentInput));

    document.getElementById("backToNotes").addEventListener("click", () => {
        clearTimeout(saveTimer);
        saveNote();
        openNotesList();
    });

    document.getElementById("deleteNoteBtn").addEventListener("click", () => {
        if (confirm("Удалить заметку?")) {
            clearTimeout(saveTimer);
            deleteNote(noteId);
            openNotesList();
        }
    });
}

function openNotesList() {
    const container = getMainContainer();
    const currentScreen = container.querySelector('.screen');

    const loadNotes = () => {
        window.location.hash = "notes";
        import("./notesUI.js").then(module => {
            module.renderNotesUI({ animate: false });
        });
    };

    if (currentScreen) {
        currentScreen.classList.add('slide-out-right');
        let done = false;
        const runLoad = () => {
            if (done) return;
            done = true;
            loadNotes();
        };
        const timeout = setTimeout(runLoad, 400);
        currentScreen.addEventListener('animationend', () => {
            clearTimeout(timeout);
            runLoad();
        }, { once: true });
    } else {
        loadNotes();
    }
}

function formatText(textarea, prefix, suffix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    const newText = beforeText + prefix + selectedText + suffix + afterText;
    textarea.value = newText;
    textarea.selectionStart = textarea.selectionEnd = start + prefix.length + selectedText.length + suffix.length;
    textarea.focus();
}

function formatList(textarea, prefix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const lines = selectedText.split('\n');
    const formattedLines = lines.map(line => (line.trim() ? prefix + line : line));
    const newSelectedText = formattedLines.join('\n');
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    textarea.value = beforeText + newSelectedText + afterText;
    textarea.selectionStart = start;
    textarea.selectionEnd = start + newSelectedText.length;
    textarea.focus();
}

function formatNumberedList(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const lines = selectedText.split('\n');
    const formattedLines = lines.map((line, index) => (line.trim() ? `${index + 1}. ${line}` : line));
    const newSelectedText = formattedLines.join('\n');
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    textarea.value = beforeText + newSelectedText + afterText;
    textarea.selectionStart = start;
    textarea.selectionEnd = start + newSelectedText.length;
    textarea.focus();
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
