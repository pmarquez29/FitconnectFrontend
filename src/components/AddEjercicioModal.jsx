import { useState } from "react";
import { addEjercicioToRutina } from "../api/ejercicios";

const AddEjercicioModal = ({ rutinaId, isOpen, onClose, onEjercicioAdded }) => {
    const [formData, setFormData] = useState({
        ejercicio_id: "",
        series: "",
        repeticiones: "",
        peso: "",
        tiempo_descanso: "",
        orden: "",
        notas: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEjercicioToRutina(rutinaId, formData);
            onEjercicioAdded();
            onClose();
        } catch (err) {
            console.error("Error agregando ejercicio", err);
            alert("No se pudo agregar ejercicio");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar Ejercicio</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" name="ejercicio_id" placeholder="ID Ejercicio" onChange={handleChange} required />
                    <input type="number" name="series" placeholder="Series" onChange={handleChange} required />
                    <input type="number" name="repeticiones" placeholder="Repeticiones" onChange={handleChange} required />
                    <input type="number" name="peso" placeholder="Peso (kg)" onChange={handleChange} />
                    <input type="number" name="tiempo_descanso" placeholder="Descanso (seg)" onChange={handleChange} />
                    <input type="number" name="orden" placeholder="Orden" onChange={handleChange} />
                    <textarea name="notas" placeholder="Notas" onChange={handleChange} />

                    <button type="submit">Guardar</button>
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                </form>
            </div>
        </div>
    );
};

export default AddEjercicioModal;
