import "../styles/estadisticas.css";

const StatsCards = ({ resumen }) => {
    const cards = [
        { title: "Alumnos Activos", value: resumen.alumnos_activos, color: "#2563eb" },
        { title: "Rutinas Creadas", value: resumen.rutinas, color: "#16a34a" },
        { title: "Progreso Medio (%)", value: resumen.progreso_medio, color: "#f59e0b" },
        { title: "Carga Total (kg)", value: resumen.carga_total, color: "#dc2626" },
    ];

    return (
        <div className="stats-grid">
            {cards.map((c, i) => (
                <div key={i} className="stat-card" style={{ borderTop: `4px solid ${c.color}` }}>
                    <h3>{c.title}</h3>
                    <p>{c.value}</p>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
