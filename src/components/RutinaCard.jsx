import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaClock,
    FaDumbbell,
    FaBullseye,
    FaCheckCircle,
    FaRunning,
    FaPauseCircle
} from "react-icons/fa";
import "../styles/rutinas.css";

const RutinaCard = ({ rutina, onClick }) => {
    // 1. Normalización de datos (Defensa contra datos nulos o estructuras anidadas)
    const nombre = rutina.nombre || rutina.Rutina?.nombre || "Rutina sin nombre";
    const objetivo = rutina.objetivo || rutina.Rutina?.objetivo || "General";
    // Intenta obtener la disciplina del objeto plano o del objeto anidado
    const disciplina = rutina.disciplina_nombre || rutina.Rutina?.Disciplina?.nombre || rutina.disciplina || "Fitness";
    const duracion = rutina.duracion_estimada || rutina.Rutina?.duracion_estimada || 0;
    const frecuencia = rutina.frecuencia_semanal || rutina.Rutina?.frecuencia_semanal;

    // 2. Progreso y Estado
    const rawProgreso = Number(rutina.progreso) || 0;
    const [progreso, setProgreso] = useState(0);

    // Animación de carga del progreso
    useEffect(() => {
        const timer = setTimeout(() => setProgreso(rawProgreso), 300);
        return () => clearTimeout(timer);
    }, [rawProgreso]);

    // Determinar estado visual
    const estado = progreso >= 100 ? "completada" : (rutina.estado?.toLowerCase() || "activa");

    // Configuración de colores según estado
    const config = {
        activa: {
            gradient: "linear-gradient(135deg, #10b981, #059669)", // Verde esmeralda
            icon: <FaRunning />,
            barColor: "#10b981"
        },
        pendiente: {
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)", // Ámbar
            icon: <FaDumbbell />,
            barColor: "#f59e0b"
        },
        pausada: {
            gradient: "linear-gradient(135deg, #6b7280, #4b5563)", // Gris
            icon: <FaPauseCircle />,
            barColor: "#6b7280"
        },
        completada: {
            gradient: "linear-gradient(135deg, #3b82f6, #2563eb)", // Azul
            icon: <FaCheckCircle />,
            barColor: "#3b82f6"
        },
    };

    const currentConfig = config[estado] || config.activa;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rutina-card-pro"
            onClick={() => onClick && onClick(rutina.id)}
        >
            {/* HEADER */}
            <div className="rutina-card-header">
                <div className="rutina-icon" style={{ background: currentConfig.gradient }}>
                    {currentConfig.icon}
                </div>
                <span className={`estado-badge-pro ${estado}`}>
                    {estado === "completada" ? "COMPLETADA" : estado.toUpperCase()}
                </span>
            </div>

            {/* INFO */}
            <div className="rutina-info">
                <div className="disciplina-badge">
                    {disciplina.toUpperCase()}
                </div>

                <h3 className="rutina-nombre" title={nombre}>
                    {nombre}
                </h3>

                <div className="rutina-detalles">
                    <p>
                        <FaBullseye className="text-primary" />
                        <span>{objetivo}</span>
                    </p>
                    <p>
                        <FaClock className="text-warning" />
                        <span>{duracion} min / sesión</span>
                    </p>
                    {frecuencia && (
                        <p>
                            <FaDumbbell className="text-secondary" />
                            <span>{frecuencia}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* PROGRESO */}
            <div className="progreso-container">
                <div className="progreso-info">
                    <span>Avance actual</span>
                    <span className="fw-bold text-dark">{progreso}%</span>
                </div>
                <div className="progreso-barra">
                    <div
                        className="progreso-relleno"
                        style={{
                            width: `${progreso}%`,
                            background: currentConfig.gradient,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default RutinaCard;