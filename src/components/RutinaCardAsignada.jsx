import "../styles/rutinaCardAsignada.css";
import { FaUserCircle, FaBullseye, FaRegClock } from "react-icons/fa";
import { MdEvent, MdFitnessCenter } from "react-icons/md";
import { useEffect, useState } from "react";

const RutinaCardAsignada = ({ rutina, onSelect }) => {
    const [animatedProgress, setAnimatedProgress] = useState(0);
    // Aseguramos que progreso sea un número
    const progreso = Number(rutina.progreso) || 0;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedProgress(progreso), 150);
        return () => clearTimeout(timer);
    }, [progreso]);

    const getProgressColor = () => {
        if (progreso >= 100) return "#16a34a"; // Verde fuerte completado
        if (progreso >= 80) return "var(--progreso-alto)";
        if (progreso >= 40) return "var(--progreso-medio)";
        return "var(--progreso-bajo)";
    };

    return (
        <div className="rutina-card-pro" onClick={() => onSelect(rutina.id)}>
            <div className="rutina-card-header">
                <div className="rutina-icon">
                    <MdFitnessCenter size={24} />
                </div>
                <span className={`estado-badge-pro ${rutina.estado?.toLowerCase()}`}>
                    {rutina.estado?.toUpperCase() || "ACTIVA"}
                </span>
            </div>

            <div className="rutina-info">
                <div className="disciplina-badge">{rutina.disciplina || "General"}</div>
                <h3 className="rutina-nombre">{rutina.nombre}</h3>

                <div className="alumno-info">
                    <FaUserCircle size={32} className="alumno-avatar" />
                    <div className="alumno-text">
                        <p className="alumno-nombre">{rutina.alumno?.nombre || "Sin alumno asignado"}</p>
                        <p className="alumno-email">{rutina.alumno?.email || "—"}</p>
                    </div>
                </div>

                <div className="rutina-detalles">
                    <p title="Fecha de inicio">
                        <MdEvent className="text-primary" />
                        <strong>Inicio:</strong> {rutina.fecha_inicio || "—"}
                    </p>
                    <p title="Frecuencia semanal">
                        <FaRegClock className="text-warning" />
                        Frecuencia: <strong>{rutina.frecuencia_semanal || "No definida"}</strong>
                    </p>
                    <p title="Objetivo principal">
                        <FaBullseye className="text-danger" />
                        {rutina.objetivo || "Sin objetivo"}
                    </p>
                </div>

                <div className="progreso-container">
                    <div className="progreso-info">
                        <span>Progreso actual</span>
                        <strong style={{ color: getProgressColor() }}>{progreso}%</strong>
                    </div>
                    <div className="progreso-barra">
                        <div
                            className="progreso-relleno"
                            style={{
                                width: `${animatedProgress}%`,
                                background: getProgressColor(),
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RutinaCardAsignada;