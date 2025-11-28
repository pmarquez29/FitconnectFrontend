import "../styles/rutinas.css";
import { FaUserCircle } from "react-icons/fa";

const RutinaCardAsignada = ({ rutina, onSelect }) => {
    const progreso = rutina.progreso || 0;

    return (
        <div className="rutina-card asignada-card" onClick={() => onSelect(rutina.id)} >
            <div className="rutina-card-header">+
                <h3>{rutina.nombre}</h3>
                <span className={`estado-badge ${rutina.estado?.toLowerCase()}`}>{rutina.estado}</span>
            </div>

            <div className="rutina-card-body">
                <p><FaUserCircle /> {rutina.alumno?.nombre || "Alumno sin asignar"}</p>
                <p>🎯 {rutina.objetivo}</p>
                <p>⏱️ {rutina.duracion_estimada || 0} min</p>
            </div>

            <div className="progreso-circular">
                <svg viewBox="0 0 36 36" className="circular-chart">
                    <path
                        className="circle-bg"
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                        className="circle"
                        strokeDasharray={`${progreso}, 100`}
                        d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <span className="progreso-text">{progreso}%</span>
            </div>
        </div>
    );
};

export default RutinaCardAsignada;
