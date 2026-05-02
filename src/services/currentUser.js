import api from "./api";

let cache = null;
let inFlight = null;

export function getCurrentUser({ force = false } = {}) {
    if (!force && cache) return Promise.resolve(cache);
    if (!force && inFlight) return inFlight;

    const uid = localStorage.getItem("UID");
    if (!uid) return Promise.reject(new Error("Not authenticated"));

    inFlight = api
        .get(`/api/users/${uid}`)
        .then((res) => {
            cache = res.data;
            inFlight = null;
            return res.data;
        })
        .catch((err) => {
            inFlight = null;
            throw err;
        });

    return inFlight;
}

export function clearCurrentUserCache() {
    cache = null;
    inFlight = null;
}
