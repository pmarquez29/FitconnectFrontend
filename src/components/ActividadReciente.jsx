import "../styles/perfil.css";

const ActividadReciente = ({ actividades }) => {
    return (
        <div className="actividad-reciente">
            <h3>Actividad Reciente</h3>
            <table>
                <thead>
                <tr>
                    <th>Rutina</th>
                    <th>Carga</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {actividades.map((a, i) => (
                    <tr key={i}>
                        <td>{a.rutina}</td>
                        <td>{a.carga} kg</td>
                        <td>{a.estado}</td>
                        <td>{new Date(a.fecha).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActividadReciente;
