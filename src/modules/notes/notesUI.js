import { getAllNotes, getNotePreview } from "./notes.js";
import { getMainContainer } from "../../core/uiContainer.js";

export function renderNotesUI(options = {}) {
    const container = getMainContainer();
    const notes = getAllNotes();
    const animate = options.animate !== false;

    const currentScreen = container.querySelector('.screen');
    if (animate && currentScreen && !currentScreen.classList.contains('slide-out-right')) {
        currentScreen.classList.add('slide-out-right');
        currentScreen.addEventListener('animationend', () => {
            render();
        }, { once: true });
    } else {
        render();
    }

    function render() {
        container.innerHTML = `
            <div class="screen${animate ? " slide-in-from-left" : ""}">
                <div class="notes-module" style="padding: 14px 16px 80px;">
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
            </div>
        `;

        const newScreen = container.querySelector('.screen');
        newScreen.addEventListener('animationend', () => {
            newScreen.classList.remove('slide-in-from-left');
        }, { once: true });

        document.getElementById("createNoteBtn").addEventListener("click", createNewNote);

        document.querySelectorAll(".note-card").forEach(card => {
            card.addEventListener("click", () => {
                navigateToNote(parseInt(card.dataset.id, 10));
            });
        });
    }
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
    const container = getMainContainer();
    const currentScreen = container.querySelector('.screen');

    const loadNote = () => {
        window.location.hash = `note/${id}`;
        import("./noteUI.js").then(module => {
            module.renderNoteUI(id);
        });
    };

    if (currentScreen) {
        currentScreen.classList.add('slide-out-left');
        let done = false;
        const runLoad = () => {
            if (done) return;
            done = true;
            loadNote();
        };
        const timeout = setTimeout(runLoad, 400);
        currentScreen.addEventListener('animationend', () => {
            clearTimeout(timeout);
            runLoad();
        }, { once: true });
    } else {
        loadNote();
    }
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
