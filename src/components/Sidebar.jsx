import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/layout.css";

const Sidebar = ({ open, setOpen }) => {
    const links = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/alumnos", label: "Mis alumnos" },
        { to: "/rutinas", label: "Rutinas" },
        { to: "/estadisticas", label: "Estadísticas" },
        { to: "/mensajes", label: "Mensajes" },
        { to: "/configuracion", label: "Configuración" },
    ];

    return (
        <aside className={`sidebar ${open ? "open" : ""}`}>
            <div className="logo">
                <img src={logo} alt="FitTrack Logo" />
            </div>
            <nav aria-label="Menú principal">
                <ul>
                    {links.map((link, i) => (
                        <li key={i}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) => (isActive ? "active" : "")}
                                onClick={() => setOpen(false)} // cerrar sidebar al hacer clic en mobile
                            >
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
