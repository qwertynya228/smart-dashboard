let routes = {};
let defaultRoute = null;

export function initRouter() {
    routes = {
        "/tasks": () => import("../modules/tasks/tasksUI.js").then(mod => mod.renderTasksUI()),
        "/notes": () => import("../modules/notes/notesUI.js").then(mod => mod.renderNotesUI()),
        "/tracker": () => import("../modules/tracker/trackerUI.js").then(mod => mod.renderTrackerUI()),
        "/profile": () => import("../modules/profile/profileUI.js").then(mod => mod.renderProfileUI()),
        "/settings": () => import("../modules/settings/settingsUI.js").then(mod => mod.renderSettingsUI())
    };
    
    defaultRoute = "/tasks";
    
    window.addEventListener("popstate", handleRoute);
    handleRoute();
}

export function navigate(path) {
    history.pushState({}, "", path);
    handleRoute();
}

function handleRoute() {
    let path = window.location.pathname;
    if (path === "/" || !routes[path]) {
        path = defaultRoute;
        history.replaceState({}, "", path);
    }
    
    const route = routes[path];
    if (route) {
        route().catch(err => console.error("Route error:", err));
    }
}