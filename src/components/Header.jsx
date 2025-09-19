import { useState } from "react";
import "../styles/layout.css";

const Header = ({ user }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="header">
            <div className="search-bar">
                <input type="text" placeholder="Buscar..." />
                <span className="icon">🔍</span>
            </div>
            <div className="actions">
                <div className="notification" onClick={() => setShowNotifications(!showNotifications)}>
                    🔔
                    {showNotifications && <div className="dropdown">No hay notificaciones</div>}
                </div>
                <div className="user" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <img src="/assets/avatar.png" alt="User" className="avatar" />
                    <span>{user?.nombre}</span>
                    {showUserMenu && (
                        <div className="dropdown">
                            <p>Perfil</p>
                            <p>Cerrar sesión</p>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
