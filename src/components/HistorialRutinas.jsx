import "../styles/perfil.css";

const HistorialRutinas = ({ historial }) => {
    return (
        <div className="historial-rutinas">
            <h3>Historial de Rutinas</h3>
            {historial.length === 0 ? (
                <p>No tiene rutinas anteriores registradas.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Rutina</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Estado</th>
                        <th>Progreso (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historial.map((r) => (
                        <tr key={r.id}>
                            <td>{r.nombre}</td>
                            <td>{new Date(r.fecha_inicio).toLocaleDateString()}</td>
                            <td>{r.fecha_fin ? new Date(r.fecha_fin).toLocaleDateString() : "En curso"}</td>
                            <td>{r.estado}</td>
                            <td>{r.progreso}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HistorialRutinas;
