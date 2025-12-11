import "../styles/estadisticas.css";
import {
    FaUserFriends,
    FaDumbbell,
    FaChartLine,
    FaWeightHanging,
} from "react-icons/fa";

const StatsCards = ({ resumen = {} }) => {
    const format = (v) =>
        v !== undefined && v !== null ? v.toLocaleString("es-ES") : "—";

    const cards = [
        {
            title: "Alumnos Activos",
            value: format(resumen.alumnos_activos),
            color: "#2563eb",
            icon: <FaUserFriends />,
            description: "Entrenando actualmente",
        },
        {
            title: "Rutinas Creadas",
            value: format(resumen.rutinas),
            color: "#16a34a",
            icon: <FaDumbbell />,
            description: "Diseñadas por el instructor",
        },
        {
            title: "Progreso Medio",
            value: resumen.progreso_medio ? `${resumen.progreso_medio}%` : "—",
            color: "#f59e0b",
            icon: <FaChartLine />,
            description: "Promedio general de los alumnos",
        },
        {
            title: "Carga Total",
            value: resumen.carga_total ? `${format(resumen.carga_total)} kg` : "—",
            color: "#dc2626",
            icon: <FaWeightHanging />,
            description: "Peso total levantado registrado",
        },
    ];

    return (
        <div className="stats-grid" style={{ gap: "1.2rem" }}>
            {cards.map((c, i) => (
                <div
                    key={i}
                    className="stat-card"
                    style={{
                        borderLeft: `4px solid ${c.color}`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        backgroundColor: "#fff",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                    }}
                >
                    <div
                        className="icon-box"
                        style={{
                            backgroundColor: `${c.color}15`,
                            color: c.color,
                            fontSize: "1.6rem",
                        }}
                    >
                        {c.icon}
                    </div>
                    <div>
                        <h4 style={{ marginBottom: "0.3rem" }}>{c.title}</h4>
                        <p
                            style={{
                                fontSize: "1.3rem",
                                fontWeight: 600,
                                color: c.color,
                                margin: 0,
                            }}
                        >
                            {c.value}
                        </p>
                        <span
                            style={{
                                fontSize: "0.8rem",
                                color: "#6b7280",
                                marginTop: "0.2rem",
                                display: "block",
                            }}
                        >
              {c.description}
            </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
