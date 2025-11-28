import "../styles/rutinaCatalogo.css";
import { FaClock, FaDumbbell, FaBullseye } from "react-icons/fa";

const RutinaCardCatalogo = ({ rutina, onSelect }) => {
    return (
        <div className="rutina-card catalogo-card" onClick={() => onSelect(rutina.id)}>
            <div className="rutina-card-header">
                <h3>{rutina.nombre}</h3>
                <span className="nivel">{rutina.nivel || "N/A"}</span>
            </div>

            <div className="rutina-card-body">
                <p><FaDumbbell /> {rutina.Disciplina?.nombre || "Sin disciplina"}</p>
                <p><FaBullseye /> {rutina.objetivo || "Sin objetivo"}</p>
                <p><FaClock /> {rutina.duracion_estimada || 0} min</p>
            </div>
        </div>
    );
};

export default RutinaCardCatalogo;
