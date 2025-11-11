import "../styles/estadisticas.css";

const TopAlumnosTable = ({ alumnos }) => (
    <div className="chart-container">
        <h3>🏅 Alumnos Destacados</h3>
        <table className="top-alumnos">
            <thead>
            <tr>
                <th>Alumno</th>
                <th>Disciplina</th>
                <th>Racha</th>
                <th>Progreso</th>
            </tr>
            </thead>
            <tbody>
            {alumnos.map((a, i) => (
                <tr key={i}>
                    <td>
                        <div className="alumno-cell">
                            <img src={a.foto || "/assets/avatar.png"} alt={a.nombre} />
                            <span>{a.nombre}</span>
                        </div>
                    </td>
                    <td>{a.disciplina}</td>
                    <td>{a.racha} días</td>
                    <td>
                        <div className="progress-bar small">
                            <div
                                className="progress"
                                style={{ width: `${a.progreso}%`, backgroundColor: a.progreso > 70 ? "#16a34a" : "#f59e0b" }}
                            ></div>
                        </div>
                        <span className="progress-label">{a.progreso}%</span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default TopAlumnosTable;
