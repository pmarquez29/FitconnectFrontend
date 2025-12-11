import { useEffect, useRef, useState } from "react";
import avatarDefault from "../assets/avatar.jpg";
import { FaBell, FaChevronDown } from "react-icons/fa";
import "../styles/header.css";

const Header = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const menuRef = useRef();

    // 🔹 Cerrar menús al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
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

    // 🔹 CORRECCIÓN: Convertir foto de forma segura (sin RangeError)
    const getFotoSrc = (foto) => {
        try {
            if (!foto) return avatarDefault;

            // Caso 1: String Base64 directo
            if (typeof foto === "string") return `data:image/jpeg;base64,${foto}`;

            // Caso 2: Buffer desde Backend (Aquí estaba el error)
            if (foto?.data) {
                const bytes = new Uint8Array(foto.data);
                let binary = '';
                // Usamos un bucle for para evitar desbordamiento de pila (Stack Overflow)
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return `data:image/jpeg;base64,${window.btoa(binary)}`;
            }

            // Caso 3: Objeto anidado raro
            if (foto?.base64) return `data:image/jpeg;base64,${foto.base64}`;

            return avatarDefault;
        } catch (err) {
            console.error("❌ Error convirtiendo foto:", err);
            return avatarDefault;
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header className="app-header">
            {/* Título de la Plataforma */}
            <h1 className="app-title">FitConnect</h1>

            <div className="header-actions" ref={menuRef}>
                {/* 🔔 Notificaciones */}
                <div
                    className="notification"
                    onClick={() => {
                        setShowNotifications(!showNotifications);
                        setShowUserMenu(false);
                    }}
                >
                    <FaBell />

                    {showNotifications && (
                        <div className="dropdown notifications">
                            <p style={{margin: 0, fontWeight: "600"}}>🎉 ¡Todo al día!</p>
                            <small>No tienes notificaciones nuevas</small>
                        </div>
                    )}
                </div>

                {/* 👤 Usuario */}
                <div
                    className="user-section"
                    onClick={() => {
                        setShowUserMenu(!showUserMenu);
                        setShowNotifications(false);
                    }}
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
                    <FaChevronDown size={12} color="#94a3b8" />

                    {showUserMenu && (
                        <div className="dropdown user-menu">
                            <button onClick={() => (window.location.href = "/configuracion")}>
                                ⚙️ Configuración
                            </button>
                            <button onClick={handleLogout}>
                                🚪 Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;