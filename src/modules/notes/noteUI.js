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
                <div id="noteContent" class="note-content-input" contenteditable="true" placeholder="Начните писать...">${note.content ? markdownToHtml(note.content) : ''}</div>
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
        const htmlContent = contentInput.innerHTML;
        const textContent = htmlToMarkdown(htmlContent);
        updateNote(noteId, titleInput.value, textContent);
    };
    const scheduleSave = () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveNote, 300);
    };

    titleInput.addEventListener("input", scheduleSave);
    contentInput.addEventListener("input", scheduleSave);

    // Handle placeholder for contenteditable
    if (!contentInput.textContent.trim()) {
        contentInput.innerHTML = '<div style="color: #666;">Начните писать...</div>';
    }
    contentInput.addEventListener("focus", () => {
        if (contentInput.innerHTML === '<div style="color: #666;">Начните писать...</div>') {
            contentInput.innerHTML = '';
        }
    });
    contentInput.addEventListener("blur", () => {
        if (!contentInput.textContent.trim()) {
            contentInput.innerHTML = '<div style="color: #666;">Начните писать...</div>';
        }
    });

    // Toolbar button handlers
    document.getElementById("boldBtn").addEventListener("click", () => formatText(contentInput, 'bold'));
    document.getElementById("italicBtn").addEventListener("click", () => formatText(contentInput, 'italic'));
    document.getElementById("listBtn").addEventListener("click", () => formatList(contentInput));
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

function formatText(element, command) {
    document.execCommand(command, false, null);
    element.focus();
}

function formatList(element) {
    document.execCommand('insertUnorderedList', false, null);
    element.focus();
}

function formatNumberedList(element) {
    document.execCommand('insertOrderedList', false, null);
    element.focus();
}

function htmlToMarkdown(html) {
    // Simple HTML to Markdown converter
    let markdown = html
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match, content) => {
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        })
        .replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match, content) => {
            let counter = 1;
            return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${counter++}. $1\n`);
        })
        .replace(/<br[^>]*>/gi, '\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n')
        .replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

    return markdown.trim();
}

function markdownToHtml(markdown) {
    // Simple Markdown to HTML converter
    let html = markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^-\s+(.*)$/gm, '<li>$1</li>')
        .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
        .replace(/\n/g, '<br>');

    return html;
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
