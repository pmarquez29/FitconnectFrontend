import "../styles/mensajes.css";

const AlumnoInfoCard = ({ alumno }) => {
    if (!alumno) return <div className="alumno-info empty">Selecciona un alumno</div>;

    return (
        <div className="alumno-info-card">
            <div className="alumno-header">
                <h4>GIMNASIO</h4>
            </div>
            <img
                src={alumno.foto || "/assets/avatar.png"}
                alt={alumno.nombre}
                className="alumno-avatar"
            />
            <h3>{alumno.nombre} {alumno.apellido}</h3>
            <p><strong>Email:</strong> {alumno.email}</p>

            {/* Como rutina_asignada y progreso no existen en tu tabla, puedes poner placeholders */}
            <p><strong>Rutina actual:</strong> {"No asignada"}</p>

            <div className="progress-bar">
                <div className="progress" style={{ width: `0%` }}></div>
            </div>

            <button className="perfil-btn">Ver perfil completo</button>
        </div>
    );
};

export default AlumnoInfoCard;
