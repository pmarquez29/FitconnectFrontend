import { NavLink } from "react-router-dom";
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
import { GiMuscleUp, GiWeightLiftingUp } from "react-icons/gi";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";

const Sidebar = ({
                     open,
                     setOpen,
                     collapsed,
                     setCollapsed,
                     unreadMessages = 0,
                 }) => {
    const links = [
        { to: "/dashboard", label: "Dashboard", icon: MdDashboard },
        { to: "/alumnos", label: "Mis Alumnos", icon: MdGroup },
        { to: "/rutinas", label: "Rutinas", icon: GiWeightLiftingUp },
        { to: "/estadisticas", label: "Estadísticas", icon: IoStatsChart },
        {
            to: "/mensajes",
            label: "Mensajes",
            icon: MdMessage,
            badge: unreadMessages,
        },
        { to: "/configuracion", label: "Configuración", icon: MdSettings },
    ];

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) setOpen(false);
        else if (collapsed) setCollapsed(false);
    };

    return (
        <>
            {open && window.innerWidth < 1024 && (
                <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
            )}

            <aside
                className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}
            >
                {/* HEADER */}
                <div className="sidebar-header">
                    <img src={logo} alt="FitConnect Logo" className="sidebar-logo" />
                    <button
                        className="collapse-btn"
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? "Expandir menú" : "Colapsar menú"}
                    >
                        {collapsed ? <MdMenu size={22} /> : <MdMenuOpen size={22} />}
                    </button>
                </div>

                {/* NAV */}
                <nav className="sidebar-nav">
                    <ul>
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
                                        <span className="nav-label">{link.label}</span>
                                        <div className="nav-icon-wrapper">
                                            <link.icon className="nav-icon" size={22} />
                                            {link.badge > 0 && (
                                                <span className="nav-badge">{link.badge}</span>
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
                        <GiMuscleUp className="user-icon" size={26} />
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
                            <span>Salir</span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
