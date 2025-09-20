import "../styles/dashboard.css";

const TopStudents = ({ estudiantes }) => {
    return (
        <section className="top-students">
            <h2>Mejores estudiantes</h2>
            {estudiantes.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Racha</th>
                        <th>Progreso</th>
                    </tr>
                    </thead>
                    <tbody>
                    {estudiantes.map((e, i) => (
                        <tr key={i}>
                            <td>{e.nombre}</td>
                            <td>{e.racha} días</td>
                            <td className={e.progreso >= 0 ? "positive" : "negative"}>
                                {e.progreso}%
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay estudiantes registrados</p>
            )}
        </section>
    );
};

export default TopStudents;
