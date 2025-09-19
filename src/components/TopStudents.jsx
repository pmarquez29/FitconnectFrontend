import "../styles/dashboard.css";

const TopStudents = ({ estudiantes }) => {
    return (
        <section className="top-students">
            <h2>Mejores estudiantes</h2>
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
                        <td>{e.progreso}%</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </section>
    );
};

export default TopStudents;
