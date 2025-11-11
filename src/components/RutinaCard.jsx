import "../styles/rutinas.css";

const RutinaCard = ({ rutina, onClick }) => {
    const estado = rutina.estado || "pendiente";
    const colores = {
        activa: "linear-gradient(135deg, #9dffb0, #5ad67d)",
        pendiente: "linear-gradient(135deg, #ffe37d, #ffb347)",
        atrasada: "linear-gradient(135deg, #ff8a8a, #d64545)",
        completada: "linear-gradient(135deg, #8ad0ff, #4a90e2)",
    };

    return (
        <div
            className="rutina-card shadow"
            style={{ background: colores[estado] }}
            onClick={() => onClick(rutina.id)}
        >
            <div className="rutina-header">
                <span className="estado">{estado.toUpperCase()}</span>
            </div>

            <div className="rutina-body">
                <h3>{rutina.nombre}</h3>
                <p className="nivel">Nivel: {rutina.nivel}</p>
                <p>🏋️ {rutina.Disciplina?.nombre || "Sin disciplina"}</p>
                <p>🎯 {rutina.objetivo}</p>
                <p>⏱️ {rutina.duracion_estimada || 0} min / {rutina.frecuencia_semanal || "—"}</p>
            </div>

            <div className="progreso">
                <div className="barra">
                    <div
                        className="relleno"
                        style={{ width: `${rutina.progreso || 0}%` }}
                    ></div>
                </div>
                <small>{rutina.progreso || 0}% completado</small>
            </div>

            <div className="acciones">
                <button className="btn-registrar">Registrar</button>
                <button className="btn-detalles">Detalles</button>
            </div>
        </div>
    );
};

export default RutinaCard;
