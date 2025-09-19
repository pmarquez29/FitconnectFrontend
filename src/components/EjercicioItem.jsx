import "../styles/rutinas.css";

const EjercicioItem = ({ ejercicio, onEdit, onDelete }) => {
    return (
        <li className="ejercicio-item">
            <div>
                <strong>{ejercicio.nombre}</strong> - {ejercicio.series}x{ejercicio.repeticiones}
                {ejercicio.peso && <span> ({ejercicio.peso} kg)</span>}
            </div>
            <div className="ejercicio-actions">
                <button onClick={() => onEdit(ejercicio)}>✏️</button>
                <button onClick={() => onDelete(ejercicio.id)}>🗑</button>
            </div>
        </li>
    );
};

export default EjercicioItem;
