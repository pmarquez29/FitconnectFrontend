import "../styles/estadisticas.css";

const TopAlumnosTable = ({ alumnos }) => (
    <div className="chart-container">
        <h3>🏅 Alumnos Destacados</h3>

        {(!alumnos || alumnos.length === 0) ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                No hay datos de progreso aún 📉
            </p>
        ) : (
            <table className="top-alumnos">
                <thead>
                <tr>
                    <th>Posición</th>
                    <th>Alumno</th>
                    <th>Disciplina</th>
                    <th>Entrenamientos</th>
                    <th>Progreso</th>
                </tr>
                </thead>
                <tbody>
                {alumnos.map((a, i) => (
                    <tr key={i}>
                        <td style={{ fontWeight: "bold", textAlign: "center" }}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </td>

                        <td>
                            <div className="alumno-cell">
                                <img
                                    src={a.foto || "/assets/avatar.png"}
                                    alt={a.nombre}
                                    className="alumno-foto"
                                />
                                <span>{a.nombre}</span>
                            </div>
                        </td>

                        <td>{a.disciplina}</td>

                        <td style={{ textAlign: "center" }}>
                            {a.entrenamientos || 0}
                        </td>

                        <td>
                            <div className="progress-bar small">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${a.progreso}%`,
                                        backgroundColor:
                                            a.progreso >= 100
                                                ? "#3b82f6"
                                                : a.progreso >= 80
                                                    ? "#16a34a"
                                                    : a.progreso >= 50
                                                        ? "#f59e0b"
                                                        : "#ef4444",
                                    }}
                                ></div>
                            </div>
                            <span className="progress-label">
                                    {a.progreso >= 100
                                        ? "Completado 🎯"
                                        : `${a.progreso}%`}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        )}
    </div>
);

export default TopAlumnosTable;
