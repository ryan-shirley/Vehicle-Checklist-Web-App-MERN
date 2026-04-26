export const STORAGE_KEYS = {
    JWT_TOKEN: "jwtToken",
    UID: "UID",
    USER_FULL_NAME: "userFullName"
}

export const API_ROUTES = {
    LOGIN: "/api/login",
    USERS: "/api/users",
    RECORDS: "/api/records",
    CHECK_LISTS: "/api/check-lists",
    PLANTS: "/api/plants",
    UPLOAD: "/api/upload"
}

export const APP_ROUTES = {
    HOME: "/",
    REGISTER: "/register",
    RECORDS: "/records",
    RECORDS_CREATE: "/records/create",
    RECORD_DETAIL: (id) => `/records/${id}`,
    RECORD_EDIT: (id) => `/records/${id}/edit`
}
