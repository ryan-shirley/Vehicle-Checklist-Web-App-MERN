import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { IconLocalShipping, IconMoreVert } from "./icons"
import { STORAGE_KEYS, APP_ROUTES } from "../constants"

const TopAppBar = ({ title }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        if (!menuOpen) return
        const close = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
        }
        document.addEventListener("mousedown", close)
        return () => document.removeEventListener("mousedown", close)
    }, [menuOpen])

    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.UID)
        localStorage.removeItem(STORAGE_KEYS.USER_FULL_NAME)
        window.location.replace("/")
    }

    return (
        <header className="omc-app-bar" role="banner">
            <Link to="/records" className="omc-app-bar__icon" aria-label="Vehicle home">
                <IconLocalShipping />
            </Link>
            <h1 className="omc-app-bar__title">{title}</h1>
            <div className="omc-app-bar__menu-wrap" ref={menuRef}>
                <button
                    type="button"
                    className="omc-app-bar__icon"
                    aria-label="More options"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    <IconMoreVert />
                </button>
                {menuOpen && (
                    <ul className="omc-app-bar__dropdown" role="menu">
                        <li role="none">
                            <Link
                                to={APP_ROUTES.SETTINGS}
                                role="menuitem"
                                className="omc-app-bar__dropdown-item"
                                onClick={() => setMenuOpen(false)}
                            >
                                Settings
                            </Link>
                        </li>
                        <li role="none">
                            <button
                                type="button"
                                role="menuitem"
                                className="omc-app-bar__dropdown-item"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </li>
                    </ul>
                )}
            </div>
        </header>
    )
}

export default TopAppBar
