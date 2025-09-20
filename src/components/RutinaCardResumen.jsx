import "../styles/perfil.css";

const RutinaCardResumen = ({ rutina }) => {
    if (!rutina) return <p>No tiene rutina asignada</p>;

    return (
        <div className="rutina-resumen">
            <h3>Rutina Asignada</h3>
            <div className="rutina-box">
                <h4>{rutina.nombre}</h4>
                <p><strong>Nivel:</strong> {rutina.nivel}</p>
                <p><strong>Duración:</strong> {rutina.duracion_estimada} min</p>
                <p><strong>Objetivo:</strong> {rutina.objetivo}</p>
                <ul>
                    {(rutina.ejercicios || []).slice(0, 3).map((e, i) => (
                        <li key={i}>{e.nombre} ({e.series}x{e.repeticiones})</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RutinaCardResumen;
