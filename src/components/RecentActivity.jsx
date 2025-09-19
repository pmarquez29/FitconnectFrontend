import "../styles/dashboard.css";

const RecentActivity = ({ actividad }) => {
    return (
        <section className="recent-activity">
            <h2>Actividad reciente</h2>
            <ul>
                {actividad.map((act, i) => (
                    <li key={i}>
                        <strong>{act.alumno}</strong> - {act.rutina}
                        <span>{act.completado ? "✅ Completado" : "⏳ Pendiente"}</span>
                        <small>{act.fecha}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default RecentActivity;
