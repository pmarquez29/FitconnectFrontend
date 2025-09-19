import { useState } from "react";
import { addRutina } from "../api/rutinas";
import "../styles/rutinas.css";

const AddRutinaModal = ({ isOpen, onClose, onRutinaAdded }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        nivel: "",
        objetivo: "",
        frecuencia_semanal: "",
        duracion_estimada: "",
        disciplina_id: ""
    });

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addRutina(formData);
            onRutinaAdded();
            onClose();
        } catch (err) {
            console.error("Error al agregar rutina", err);
            alert("No se pudo agregar rutina");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar Rutina</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
                    <textarea name="descripcion" placeholder="Descripción" onChange={handleChange} />
                    <select name="nivel" onChange={handleChange} required>
                        <option value="">Nivel</option>
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                    </select>
                    <input type="text" name="objetivo" placeholder="Objetivo" onChange={handleChange} />
                    <input type="number" name="frecuencia_semanal" placeholder="Frecuencia semanal" onChange={handleChange} />
                    <input type="number" name="duracion_estimada" placeholder="Duración (minutos)" onChange={handleChange} />
                    <input type="number" name="disciplina_id" placeholder="Disciplina ID" onChange={handleChange} />

                    <button type="submit" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRutinaModal;
