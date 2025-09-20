import "../styles/dashboard.css";

const DashboardCards = ({ data }) => {
    const { total_alumnos, total_rutinas, asignaciones_activas, progreso_medio } =
        data;

    const cards = [
        { icon: "👥", title: "Alumnos activos", value: total_alumnos },
        { icon: "📘", title: "Rutinas creadas", value: total_rutinas },
        { icon: "📝", title: "Pendientes", value: asignaciones_activas },
        {
            icon: "📊",
            title: "Progreso medio",
            value: progreso_medio !== null ? `${progreso_medio}%` : "N/A",
        },
    ];

    return (
        <div className="dashboard-cards">
            {cards.map((c, i) => (
                <div className="card" key={i}>
                    <span className="icon">{c.icon}</span>
                    <h3>{c.title}</h3>
                    <p>{c.value}</p>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;
