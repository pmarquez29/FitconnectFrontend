import "../styles/mensajes.css";

const AlumnoInfoCard = ({ alumno }) => {
    if (!alumno) return <div className="alumno-info empty">Selecciona un alumno</div>;

    return (
        <div className="alumno-info">
            <img src={alumno.foto || "/assets/avatar.png"} alt={alumno.nombre} />
            <h3>{alumno.nombre} {alumno.apellido}</h3>
            <p><strong>Disciplina:</strong> {alumno.disciplina}</p>
            <p><strong>Rutina:</strong> {alumno.rutina_asignada || "No asignada"}</p>
            <div className="progreso">
                <div className="bar" style={{ width: `${alumno.progreso || 0}%` }}></div>
            </div>
            <p className="codigo">Código: {alumno.codigo_acceso}</p>
        </div>
    );
};

export default AlumnoInfoCard;
