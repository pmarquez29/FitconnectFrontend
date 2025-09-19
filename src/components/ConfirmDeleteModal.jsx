import { deleteEjercicio } from "../api/ejercicios";

const ConfirmDeleteModal = ({ ejercicioId, isOpen, onClose, onEjercicioDeleted }) => {
    if (!isOpen) return null;

    const handleDelete = async () => {
        try {
            await deleteEjercicio(ejercicioId);
            onEjercicioDeleted();
            onClose();
        } catch (err) {
            console.error("Error eliminando ejercicio", err);
            alert("No se pudo eliminar ejercicio");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>¿Eliminar este ejercicio?</h2>
                <button onClick={handleDelete} className="btn-danger">Eliminar</button>
                <button onClick={onClose} className="btn-secondary">Cancelar</button>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
