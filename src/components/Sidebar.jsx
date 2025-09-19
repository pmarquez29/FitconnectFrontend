import { NavLink } from "react-router-dom";
import "../styles/layout.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="logo">⚡ FitTrack</div>
            <nav>
                <ul>
                    <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                    <li><NavLink to="/alumnos">Mis alumnos</NavLink></li>
                    <li><NavLink to="/rutinas">Rutinas</NavLink></li>
                    <li><NavLink to="/estadisticas">Estadísticas</NavLink></li>
                    <li><NavLink to="/mensajes">Mensajes</NavLink></li>
                    <li><NavLink to="/configuracion">Configuración</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
