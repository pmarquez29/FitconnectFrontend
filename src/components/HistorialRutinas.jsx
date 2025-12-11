import "../styles/perfil.css";

const estadoColor = {
    activa: "#16a34a",
    finalizada: "#2563eb",
    pausada: "#eab308",
};

const HistorialRutinas = ({ historial }) => {
    if (!historial || historial.length === 0) {
        return (
            <div className="historial-rutinas">
                <h3>📜 Historial de Rutinas</h3>
                <p>No tiene rutinas anteriores registradas.</p>
            </div>
        );
    }

    return (
        <div className="historial-rutinas">
            <h3>📜 Historial de Rutinas</h3>
            <div className="tabla-scroll">
                <table>
                    <thead>
                    <tr>
                        <th>Rutina</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Estado</th>
                        <th>Progreso</th>
                    </tr>
                    </thead>
                    <tbody>
                    {historial.map((r) => (
                        <tr key={r.id}>
                            <td>{r.nombre}</td>
                            <td>{new Date(r.fecha_inicio).toLocaleDateString()}</td>
                            <td>{r.fecha_fin ? new Date(r.fecha_fin).toLocaleDateString() : "—"}</td>
                            <td>
                                    <span
                                        className="badge"
                                        style={{ backgroundColor: estadoColor[r.estado?.toLowerCase()] || "#6b7280" }}
                                    >
                                        {r.estado}
                                    </span>
                            </td>
                            <td>
                                <div className="progress-bar perfil">
                                    <div
                                        className="progress"
                                        style={{
                                            width: `${r.progreso || 0}%`,
                                            backgroundColor:
                                                r.progreso >= 100
                                                    ? "#16a34a"
                                                    : r.progreso >= 50
                                                        ? "#2563eb"
                                                        : "#eab308",
                                        }}
                                    ></div>
                                </div>
                                <small>{r.progreso || 0}%</small>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistorialRutinas;
