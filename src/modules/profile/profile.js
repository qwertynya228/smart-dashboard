let profile = loadProfile();

function loadProfile() {
    const saved = localStorage.getItem("profile");
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        name: "Пользователь",
        bio: "",
        birthDate: "",
        avatar: null
    };
}

function saveProfileData() {
    localStorage.setItem("profile", JSON.stringify(profile));
}

export function getProfile() {
    return { ...profile };
}

export function updateProfile(updates) {
    profile = { ...profile, ...updates };
    saveProfileData();
    return profile;
}

export function updateAvatar(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            profile.avatar = e.target.result;
            saveProfileData();
            resolve(profile.avatar);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}