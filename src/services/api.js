import axios from "axios"
import { STORAGE_KEYS } from "../constants"

const api = axios.create()

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN)
    if (token) {
        config.headers.Authorization = token
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
            localStorage.removeItem(STORAGE_KEYS.UID)
            localStorage.removeItem(STORAGE_KEYS.USER_FULL_NAME)
            window.location.replace("/")
        }
        return Promise.reject(error)
    }
)

export default api
