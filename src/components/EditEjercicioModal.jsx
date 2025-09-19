import { useState, useEffect } from "react";
import { updateEjercicio } from "../api/ejercicios";

const EditEjercicioModal = ({ ejercicio, isOpen, onClose, onEjercicioUpdated }) => {
    const [formData, setFormData] = useState(ejercicio || {});

    useEffect(() => {
        setFormData(ejercicio || {});
    }, [ejercicio]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateEjercicio(ejercicio.id, formData);
            onEjercicioUpdated();
            onClose();
        } catch (err) {
            console.error("Error editando ejercicio", err);
            alert("No se pudo actualizar ejercicio");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Editar Ejercicio</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" name="series" placeholder="Series" value={formData.series || ""} onChange={handleChange} />
                    <input type="number" name="repeticiones" placeholder="Repeticiones" value={formData.repeticiones || ""} onChange={handleChange} />
                    <input type="number" name="peso" placeholder="Peso (kg)" value={formData.peso || ""} onChange={handleChange} />
                    <input type="number" name="tiempo_descanso" placeholder="Descanso (seg)" value={formData.tiempo_descanso || ""} onChange={handleChange} />
                    <textarea name="notas" placeholder="Notas" value={formData.notas || ""} onChange={handleChange} />

                    <button type="submit">Actualizar</button>
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default EditEjercicioModal;
