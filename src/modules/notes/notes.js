let notes = loadNotes();

function loadNotes() {
    const saved = localStorage.getItem("notes");
    if (saved) {
        return JSON.parse(saved);
    }
    return [
        { id: 1, title: "Список продуктов", content: "1. Хлеб\n2. Молоко\n3. Овощи" },
        { id: 2, title: "Проект", content: "Нужно сделать оформление по ГОСТу и дописать третью главу. В третьей главе описать функционал приложения, как с ним взаимодействовать. Описать каждый функциональный блок. Документ с оформлением ГОСТ найти на сайте вуза." }
    ];
}

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

export function getAllNotes() {
    return [...notes];
}

export function getNoteById(id) {
    return notes.find(n => n.id === id);
}

export function addNote(title, content) {
    const newNote = {
        id: Date.now(),
        title: title || "Новая заметка",
        content: content || ""
    };
    notes.unshift(newNote);
    saveNotes();
    return newNote;
}

export function updateNote(id, title, content) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.title = title;
        note.content = content;
        saveNotes();
    }
    return note;
}

export function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
}

export function getNotePreview(content, maxLength = 60) {
    const plainText = content.replace(/\n/g, " ");
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
}