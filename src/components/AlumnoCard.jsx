import "../styles/alumnos.css";

const AlumnoCard = ({ alumno }) => {
    return (
        <div className="alumno-card">
            <div className="disciplina">{alumno.disciplina || "General"}</div>
            <img src={alumno.foto || "/assets/avatar.png"} alt={alumno.nombre} className="alumno-foto" />
            <h3>{alumno.nombre} {alumno.apellido}</h3>
            <p>📧 {alumno.email}</p>
            <p>🏋️ Rutina: {alumno.rutina_asignada || "No asignada"}</p>
            <p>⏱ Último acceso: {alumno.ultimo_acceso || "N/A"}</p>
            <div className="progreso">
                <div className="bar" style={{ width: `${alumno.progreso || 0}%` }}></div>
            </div>
            <p className="codigo">Código: {alumno.codigo_acceso || alumno.id}</p>
            <div className="acciones">
                <button>👤 Ver perfil</button>
                <button>📝 Asignar rutina</button>
                <button>💬 Chat</button>
            </div>
        </div>
    );
};

export default AlumnoCard;
