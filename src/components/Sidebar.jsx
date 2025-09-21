import { NavLink } from "react-router-dom";
import {
    MdDashboard,
    MdGroup,
    MdFitnessCenter,
    MdBarChart,
    MdMessage,
    MdSettings,
    MdSports,
    MdLogout,
    MdMenuOpen,
    MdMenu
} from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import logo from "../assets/logo.png";
import "../styles/layout.css";

const Sidebar = ({ open, setOpen, collapsed, setCollapsed }) => {

    const links = [
        { to: "/dashboard", label: "Dashboard", icon: MdDashboard },
        { to: "/alumnos", label: "Mis Alumnos", icon: MdGroup },
        { to: "/rutinas", label: "Rutinas", icon: GiWeightLiftingUp },
        { to: "/estadisticas", label: "Estadísticas", icon: IoStatsChart },
        { to: "/mensajes", label: "Mensajes", icon: MdMessage, badge: 5 },
        { to: "/configuracion", label: "Configuración", icon: MdSettings },
    ];

    const handleLinkClick = () => {
        // En móvil, cerrar sidebar al hacer click
        if (window.innerWidth < 1024) {
            setOpen(false);
        }
        // En desktop, si está colapsado, expandir al hacer click en cualquier link
        else if (collapsed) {
            setCollapsed(false);
        }
    };

    return (
        <>
            {/* Overlay para cerrar sidebar en mobile */}
            {open && window.innerWidth < 1024 && (
                <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
            )}

            <aside className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
                <div className="logo">
                    <img src={logo} alt="FitConnect Logo" />
                </div>

                {/* Botón para colapsar/expandir (solo en desktop) */}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? "Expandir menú" : "Colapsar menú"}
                >
                    {collapsed ? <MdMenu size={20} /> : <MdMenuOpen size={20} />}
                </button>

                <nav aria-label="Menú principal">
                    <ul className="nav-links">
                        {links.map((link, i) => (
                            <li key={i}>
                                <NavLink
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `nav-link ${isActive ? "active" : ""}`
                                    }
                                    onClick={handleLinkClick}
                                    title={collapsed ? link.label : ""}
                                >
                                    <div className="nav-content">
                                        {!collapsed && (
                                            <span className="nav-label">{link.label}</span>
                                        )}
                                        <div className="nav-icon-container">
                                            <link.icon className="nav-icon" size={20} />
                                            {link.badge && (
                                                <span className="nav-badge">{link.badge}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="nav-indicator"></div>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer del sidebar */}
                <div className="sidebar-footer">
                    <div className="user-info">
                        <GiMuscleUp className="user-icon" size={24} />
                        {!collapsed && (
                            <div className="user-details">
                                <span className="user-role">Instructor</span>
                                <span className="user-status">Online</span>
                            </div>
                        )}
                    </div>
                    {!collapsed && (
                        <button className="logout-btn" title="Cerrar sesión">
                            <MdLogout size={18} />
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;