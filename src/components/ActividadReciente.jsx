import "../styles/perfil.css";
import { FaRunning, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ActividadReciente = ({ actividades }) => {
    if (!actividades || actividades.length === 0) {
        return (
            <div className="actividad-reciente">
                <h3>⚡ Actividad Reciente</h3>
                <p>No hay registros de actividad reciente.</p>
            </div>
        );
    }

    return (
        <div className="actividad-reciente">
            <h3>⚡ Actividad Reciente</h3>
            <div className="tabla-scroll">
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
                            <td><FaRunning className="icon-inline" /> {a.rutina}</td>
                            <td>{a.carga ? `${a.carga} kg` : "—"}</td>
                            <td>
                                {a.estado === "Completado" ? (
                                    <FaCheckCircle className="estado completado" />
                                ) : (
                                    <FaTimesCircle className="estado pendiente" />
                                )}
                                {a.estado}
                            </td>
                            <td>{new Date(a.fecha).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActividadReciente;
