import { NavLink, useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdGroup,
    MdMessage,
    MdSettings,
    MdLogout,
    MdMenuOpen,
    MdMenu,
} from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { GiWeightLiftingUp, GiMuscleUp } from "react-icons/gi";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";

const Sidebar = ({
                     open,
                     setOpen,
                     collapsed,
                     setCollapsed,
                     unreadMessages = 0,
                 }) => {
    const navigate = useNavigate();

    const links = [
        { to: "/dashboard", label: "Dashboard", icon: MdDashboard },
        { to: "/alumnos", label: "Mis Alumnos", icon: MdGroup },
        { to: "/rutinas", label: "Rutinas", icon: GiWeightLiftingUp },
        { to: "/estadisticas", label: "Estadísticas", icon: IoStatsChart },
        { to: "/mensajes", label: "Mensajes", icon: MdMessage, badge: unreadMessages },
        { to: "/configuracion", label: "Configuración", icon: MdSettings },
    ];

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) setOpen(false);
    };

    const handleLogout = () => {
        const confirm = window.confirm("¿Estás seguro que deseas cerrar sesión?");
        if (confirm) {
            localStorage.clear();
            navigate("/");
        }
    };

    return (
        <>
            {open && window.innerWidth < 1024 && (
                <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
            )}

            <aside className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
                {/* HEADER */}
                <div className="sidebar-header">
                    <div className="logo-container">
                        {!collapsed && <img src={logo} alt="FitConnect" className="sidebar-logo" />}
                    </div>
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? "Expandir" : "Colapsar"}
                    >
                        {collapsed ? <MdMenu size={28} /> : <MdMenuOpen size={28} />}
                    </button>
                </div>

                {/* NAV */}
                <nav className="sidebar-nav">
                    <ul>
                        {links.map((link, i) => (
                            <li key={i}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                                    onClick={handleLinkClick}
                                    title={collapsed ? link.label : ""}
                                >
                                    <div className="nav-content">
                                        {/* 1. TEXTO A LA IZQUIERDA (Original) */}
                                        {!collapsed && (
                                            <span className="nav-label">{link.label}</span>
                                        )}

                                        {/* 2. ICONO A LA DERECHA (Original) */}
                                        <div className="nav-icon-wrapper">
                                            <link.icon className="nav-icon" />
                                            {/* Badge */}
                                            {link.badge > 0 && (
                                                <span className={collapsed ? "nav-badge-dot" : "nav-badge"}>
                                                    {!collapsed && link.badge}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* FOOTER */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar-wrapper">
                            <GiMuscleUp className="user-icon-muscle" size={28} />
                        </div>
                        {!collapsed && (
                            <div className="user-details">
                                <span className="user-role">Tu Panel</span>
                                <span className="user-status">● En línea</span>
                            </div>
                        )}
                    </div>

                    <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
                        {/* Texto primero, luego icono (como lo tenías) */}
                        {!collapsed && <span>Cerrar Sesión</span>}
                        <MdLogout size={22} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;