import "../styles/mensajes.css";

const AlumnoInfoCard = ({ alumno }) => {
    if (!alumno) {
        return (
            <div className="alumno-info-card empty">
                <p>Selecciona un alumno para ver su información</p>
            </div>
        );
    }

    const progresoEjemplo = [
        { nombre: "Sentadillas", estado: "Completada", progreso: 100 },
        { nombre: "Cardio", estado: "Pausada", progreso: 45 },
    ];

    return (
        <div className="alumno-info-card">
            {/* --- Encabezado disciplina --- */}
            <div className="alumno-header">
                <h4>{alumno.disciplina?.nombre?.toUpperCase() || "SIN DISCIPLINA"}</h4>
            </div>

            {/* --- Info principal --- */}
            <div className="alumno-profile">
                <img
                    src={alumno.foto || "/assets/avatar.png"}
                    alt={alumno.nombre}
                    className="alumno-avatar"
                />
                <h3>{alumno.nombre} {alumno.apellido}</h3>
                <p className="alumno-email">{alumno.email}</p>
            </div>

            {/* --- Historial de rutinas --- */}
            <div className="rutinas-historial">
                <h5>📋 HISTORIAL DE RUTINAS</h5>

                {progresoEjemplo.map((r, i) => (
                    <div key={i} className="rutina-item">
                        <div className="rutina-header">
                            <span className={`estado ${r.estado.toLowerCase()}`}>{r.nombre}</span>
                            <span className="estado-text">
                                {r.estado} - {r.progreso}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className={`progress ${r.estado.toLowerCase()}`}
                                style={{ width: `${r.progreso}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Botones de acción --- */}
            <div className="acciones">
                <button className="btn btn-primary">📊 Ver reporte completo</button>
                <button className="btn btn-secondary">➕ Asignar nueva rutina</button>
                <button className="btn btn-secondary">✅ Registrar progreso manual</button>
                <button className="btn btn-secondary">⏰ Programar recordatorio</button>
            </div>
        </div>
    );
};

export default AlumnoInfoCard;
