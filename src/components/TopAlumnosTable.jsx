import "../styles/estadisticas.css";

const TopAlumnosTable = ({ alumnos }) => {
    return (
        <div className="chart-container">
            <h3>Alumnos Destacados</h3>
            <table className="top-alumnos">
                <thead>
                <tr>
                    <th>Alumno</th>
                    <th>Disciplina</th>
                    <th>Racha</th>
                    <th>Progreso (%)</th>
                </tr>
                </thead>
                <tbody>
                {alumnos.map((a, i) => (
                    <tr key={i}>
                        <td>{a.nombre}</td>
                        <td>{a.disciplina}</td>
                        <td>{a.racha}</td>
                        <td>{a.progreso}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopAlumnosTable;
