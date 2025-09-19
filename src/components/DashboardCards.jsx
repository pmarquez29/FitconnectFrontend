import "../styles/dashboard.css";

const DashboardCards = ({ data }) => {
    const { total_alumnos, total_rutinas, asignaciones_activas, progreso_medio } = data;

    return (
        <div className="dashboard-cards">
            <div className="card">👥 <h3>Alumnos activos</h3><p>{total_alumnos}</p></div>
            <div className="card">📘 <h3>Rutinas creadas</h3><p>{total_rutinas}</p></div>
            <div className="card">📝 <h3>Pendientes</h3><p>{asignaciones_activas}</p></div>
            <div className="card">📊 <h3>Progreso medio</h3><p>{progreso_medio || "N/A"}%</p></div>
        </div>
    );
};

export default DashboardCards;
