let routes = {};
let defaultRoute = null;

export function initRouter() {
    routes = {
        "/tasks": (options) => import("../modules/tasks/tasksUI.js").then(mod => mod.renderTasksUI(options)),
        "/notes": (options) => import("../modules/notes/notesUI.js").then(mod => mod.renderNotesUI(options)),
        "/tracker": (options) => import("../modules/tracker/trackerUI.js").then(mod => mod.renderTrackerUI(options)),
        "/profile": (options) => import("../modules/profile/profileUI.js").then(mod => mod.renderProfileUI(options)),
        "/settings": (options) => import("../modules/settings/settingsUI.js").then(mod => mod.renderSettingsUI(options))
    };
    
    defaultRoute = "/tasks";
    
    window.addEventListener("popstate", handleRoute);
    handleRoute();
}

export function navigate(path, options = {}) {
    if (window.location.pathname === path && !options.force) {
        return;
    }

    if (window.location.pathname === path && options.force) {
        history.replaceState({}, "", path);
    } else {
        history.pushState({}, "", path);
    }

    handleRoute(options);
}

function handleRoute(options = {}) {
    let path = window.location.pathname;
    if (path === "/" || !routes[path]) {
        path = defaultRoute;
        history.replaceState({}, "", path);
    }
    
    const route = routes[path];
    if (route) {
        route(options).catch(err => console.error("Route error:", err));
    }
}