import "../styles/rutinas.css";

const RutinaCard = ({ rutina, onClick }) => {
    // Detectar si es rutina asignada o del catálogo
    const esAsignada = !!rutina.alumno;

    const estado = rutina.estado?.toLowerCase() || "activa";

    const colores = {
        activa: "linear-gradient(135deg, #9dffb0, #5ad67d)",
        pendiente: "linear-gradient(135deg, #ffe37d, #ffb347)",
        atrasada: "linear-gradient(135deg, #ff8a8a, #d64545)",
        completada: "linear-gradient(135deg, #8ad0ff, #4a90e2)",
    };

    return (
        <div
            className="rutina-card shadow"
            onClick={() => onClick(rutina.id)}
        >
            {/* HEADER CON COLOR */}
            <div
                style={{
                    background: colores[estado] || "#f3f4f6",
                    borderRadius: "12px",
                    padding: "0.6rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.8rem",
                }}
            >
                <h4 style={{ color: "#111827", fontWeight: 700, margin: 0 }}>
                    {rutina.nombre}
                </h4>
                <span
                    className="estado"
                    style={{
                        background: "rgba(255,255,255,0.4)",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                    }}
                >
                    {estado.toUpperCase()}
                </span>
            </div>

            {/* CUERPO */}
            <div className="rutina-body">
                <p className="nivel">Nivel: {rutina.nivel || "N/A"}</p>
                <p>🎯 {rutina.objetivo || "Sin objetivo"}</p>
                <p>
                    ⏱️ {rutina.duracion_estimada || 0} min /{" "}
                    {rutina.frecuencia_semanal || "—"}
                </p>

                {/* Mostrar datos del alumno si aplica */}
                {esAsignada && rutina.alumno && (
                    <div
                        style={{
                            background: "#f9fafb",
                            borderRadius: "10px",
                            padding: "0.6rem 0.8rem",
                            marginTop: "0.8rem",
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 600,
                                color: "#2563eb",
                                marginBottom: "0.2rem",
                            }}
                        >
                            👤 {rutina.alumno.nombre}
                        </p>
                        <small style={{ color: "#6b7280" }}>
                            {rutina.alumno.email}
                        </small>
                    </div>
                )}
            </div>

            {/* PROGRESO */}
            <div className="progreso">
                <div className="barra">
                    <div
                        className="relleno"
                        style={{ width: `${rutina.progreso || 0}%` }}
                    ></div>
                </div>
                <small>{rutina.progreso || 0}% completado</small>
            </div>

            {/* ACCIONES */}
            <div className="acciones">
                {esAsignada ? (
                    <>
                        <button className="btn-registrar">Registrar</button>
                        <button className="btn-detalles">Detalles</button>
                    </>
                ) : (
                    <button className="btn-detalles">Editar</button>
                )}
            </div>
        </div>
    );
};

export default RutinaCard;
