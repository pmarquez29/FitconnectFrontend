/* components/RutinaCardResumen.jsx */
import "../styles/perfil.css";
import { FaDumbbell, FaBullseye, FaClock } from "react-icons/fa";

const RutinaCardResumen = ({ rutina }) => {
    if (!rutina) return (
        <div className="rutina-resumen card vacio">
            <h3>🚫 Sin Rutina Activa</h3>
            <p>Este alumno no tiene una rutina asignada actualmente.</p>
        </div>
    );

    // Mapeo seguro de ejercicios tras la corrección del backend
    const ejercicios = rutina.RutinaEjercicios?.map((re) => ({
        nombre: re.Ejercicio?.nombre || "Ejercicio desconocido",
        series: re.series,
        repeticiones: re.repeticiones
    })) || [];

    return (
        <div className="rutina-resumen card">
            <div className="header">
                <h3>🏋️ Rutina Actual</h3>
                <span className="badge active">Activa</span>
            </div>

            <div className="rutina-box compacta">
                <h4>{rutina.nombre}</h4>
                <div className="info-grid">
                    <div className="info-item">
                        <FaBullseye /> <span>{rutina.objetivo}</span>
                    </div>
                    <div className="info-item">
                        <FaDumbbell /> <span>{rutina.nivel}</span>
                    </div>
                    <div className="info-item">
                        <FaClock /> <span>{rutina.duracion_estimada || "60"} min</span>
                    </div>
                </div>

                <h5>Ejercicios principales:</h5>
                <ul className="lista-ejercicios moderna">
                    {ejercicios.length > 0 ? (
                        ejercicios.slice(0, 4).map((e, i) => (
                            <li key={i}>
                                <span className="punto"></span>
                                {e.nombre} <small>({e.series}x{e.repeticiones})</small>
                            </li>
                        ))
                    ) : (
                        <li className="text-muted">No hay ejercicios registrados en esta rutina.</li>
                    )}

                    {ejercicios.length > 4 && (
                        <li className="ver-mas">...y {ejercicios.length - 4} más</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default RutinaCardResumen;