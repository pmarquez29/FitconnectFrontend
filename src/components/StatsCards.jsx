import "../styles/estadisticas.css";
import { FaUserFriends, FaDumbbell, FaChartLine, FaWeightHanging } from "react-icons/fa";

const StatsCards = ({ resumen }) => {
    const format = (v) => (v !== undefined ? v.toLocaleString("es-ES") : "—");

    const cards = [
        {
            title: "Alumnos Activos",
            value: format(resumen.alumnos_activos),
            color: "#2563eb",
            icon: <FaUserFriends />
        },
        {
            title: "Rutinas Creadas",
            value: format(resumen.rutinas),
            color: "#16a34a",
            icon: <FaDumbbell />
        },
        {
            title: "Progreso Medio (%)",
            value: resumen.progreso_medio ? `${resumen.progreso_medio}%` : "—",
            color: "#f59e0b",
            icon: <FaChartLine />
        },
        {
            title: "Carga Total (kg)",
            value: format(resumen.carga_total),
            color: "#dc2626",
            icon: <FaWeightHanging />
        },
    ];

    return (
        <div className="stats-grid">
            {cards.map((c, i) => (
                <div key={i} className="stat-card">
                    <div className="icon-box" style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                        {c.icon}
                    </div>
                    <div>
                        <h4>{c.title}</h4>
                        <p style={{ color: c.color }}>{c.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
