import { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.jpg";
import "../styles/header.css"; // 👈 nuevo CSS separado

const Header = ({ onToggleSidebar }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const menuRef = useRef();

    // 🔹 Cerrar menús al hacer clic fuera
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

    // 🔹 Escucha actualizaciones del perfil global
    useEffect(() => {
        const handleProfileUpdate = (e) => {
            if (e.detail) setUser(e.detail);
        };
        window.addEventListener("profileUpdated", handleProfileUpdate);
        return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
    }, []);

    // 🔹 Convertir foto tipo Buffer -> Base64
    const getFotoSrc = (foto) => {
        try {
            if (!foto) return avatar;

            // Si viene como string base64
            if (typeof foto === "string") return `data:image/jpeg;base64,${foto}`;

            // Si viene como objeto tipo Buffer (desde backend)
            if (foto?.data && Array.isArray(foto.data)) {
                const uint8Array = new Uint8Array(foto.data);
                let binary = "";
                for (let i = 0; i < uint8Array.length; i++) {
                    binary += String.fromCharCode(uint8Array[i]);
                }
                const base64String = window.btoa(binary);
                return `data:image/jpeg;base64,${base64String}`;
            }

            // Si viene como base64 anidado en foto.base64
            if (foto?.base64) return `data:image/jpeg;base64,${foto.base64}`;

            return avatar;
        } catch (err) {
            console.error("❌ Error convirtiendo foto:", err);
            return avatar;
        }
    };


    return (
        <header className="app-header">
            <button className="hamburger" aria-label="Abrir menú" onClick={onToggleSidebar}>
                ☰
            </button>

            <h1 className="app-title">FitConnect</h1>

            <div className="header-actions" ref={menuRef}>
                {/* 🔔 Notificaciones */}
                <div
                    className="notification"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                    🔔
                    {showNotifications && (
                        <div className="dropdown notifications">
                            <p>Sin notificaciones nuevas</p>
                        </div>
                    )}
                </div>

                {/* 👤 Usuario */}
                <div
                    className="user-section"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                >
                    <img
                        src={getFotoSrc(user?.foto)}
                        alt="Usuario"
                        className="user-avatar"
                    />
                    <div className="user-info">
                        <span className="user-name">{user?.nombre || "Invitado"}</span>
                        <small className="user-role">
                            {user?.rol === "instructor" ? "Instructor" : "Usuario"}
                        </small>
                    </div>

                    {showUserMenu && (
                        <div className="dropdown user-menu">
                            <button onClick={() => (window.location.href = "/configuracion")}>
                                Configuración
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user");
                                    window.location.href = "/";
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
