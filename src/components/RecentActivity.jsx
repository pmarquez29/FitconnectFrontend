import "../styles/dashboard.css";

const RecentActivity = ({ actividad }) => {
    return (
        <section className="recent-activity">
            <h2>Actividad reciente</h2>
            <ul>
                {actividad.length > 0 ? (
                    actividad.map((act, i) => (
                        <li key={i}>
                            <strong>{act.alumno}</strong> - {act.rutina}
                            <span
                                className={`status ${act.completado ? "done" : "pending"}`}
                            >
                {act.completado ? "✅ Completado" : "⏳ Pendiente"}
              </span>
                            <small>{act.fecha}</small>
                        </li>
                    ))
                ) : (
                    <p>No hay actividad reciente</p>
                )}
            </ul>
        </section>
    );
};

export default RecentActivity;
