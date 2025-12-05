import "../styles/rutinaCardAsignada.css";
import { FaUserCircle, FaBullseye, FaRegClock } from "react-icons/fa";
import { MdEvent, MdFitnessCenter } from "react-icons/md";
import { useEffect, useState } from "react";

const RutinaCardAsignada = ({ rutina, onSelect }) => {
    // Animación de progreso suave
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const progreso = rutina.progreso || 0;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedProgress(progreso), 150);
        return () => clearTimeout(timer);
    }, [progreso]);

    // Dinamismo visual en función del progreso
    const getProgressColor = () => {
        if (progreso >= 80) return "var(--progreso-alto)";
        if (progreso >= 40) return "var(--progreso-medio)";
        return "var(--progreso-bajo)";
    };

    return (
        <div className="rutina-card-pro" onClick={() => onSelect(rutina.id)}>
            <div className="rutina-card-header">
                <div className="rutina-icon">
                    <MdFitnessCenter size={28} />
                </div>
                <span className={`estado-badge-pro ${rutina.estado?.toLowerCase()}`}>
          {rutina.estado?.toUpperCase()}
        </span>
            </div>

            <div className="rutina-info">
                <div className="disciplina-badge">{rutina.disciplina}</div>
                <h3 className="rutina-nombre">{rutina.nombre}</h3>

                <div className="alumno-info">
                    <FaUserCircle size={28} className="alumno-avatar" />
                    <div className="alumno-text">
                        <p className="alumno-nombre">{rutina.alumno?.nombre || "Sin alumno"}</p>
                        <p className="alumno-email">{rutina.alumno?.email}</p>
                    </div>
                </div>

                <div className="rutina-detalles">
                    <p>
                        <MdEvent /> <strong>Inicio:</strong> {rutina.fecha_inicio || "—"}
                    </p>
                    <p>
                        <FaRegClock /> Frecuencia:{" "}
                        <strong>{rutina.frecuencia_semanal || "No definida"}</strong>
                    </p>
                    <p>
                        <FaBullseye /> Objetivo: {rutina.objetivo || "—"}
                    </p>
                </div>

                <div className="progreso-container">
                    <div className="progreso-barra">
                        <div
                            className="progreso-relleno"
                            style={{
                                width: `${animatedProgress}%`,
                                background: getProgressColor(),
                            }}
                        ></div>
                    </div>
                    <div className="progreso-info">
                        <span>Progreso general</span>
                        <strong>{progreso}%</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RutinaCardAsignada;
