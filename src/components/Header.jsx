import { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.jpg";
import "../styles/layout.css";

const Header = ({ user, onToggleSidebar }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="header">
            {/* Botón hamburguesa visible en mobile */}
            <button
                className="hamburger"
                aria-label="Abrir menú"
                onClick={onToggleSidebar}
            >
                ☰
            </button>

            <div className="search-bar">
                <input type="text" placeholder="Buscar..." aria-label="Buscar" />
                <span className="icon">🔍</span>
            </div>

            <div className="actions" ref={menuRef}>
                <div
                    className="notification"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    🔔
                    {showNotifications && (
                        <div className="dropdown">No hay notificaciones</div>
                    )}
                </div>
                <div className="user" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <img src={avatar} alt="Usuario" className="avatar" />
                    <span>{user?.nombre || "Invitado"}</span>
                    {showUserMenu && (
                        <div className="dropdown">
                            <button>Perfil</button>
                            <button>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
