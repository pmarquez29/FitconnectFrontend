import { useState } from "react";
import { addAlumno } from "../api/alumnos";
import "../styles/alumnos.css";

const AddAlumnoModal = ({ isOpen, onClose, onAlumnoAdded }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        fecha_nacimiento: "",
        genero: "",
        telefono: "",
        peso: "",
        altura: "",
        objetivo: "",
        nivel_experiencia: ""
    });

    const [loading, setLoading] = useState(false);
    const [credenciales, setCredenciales] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await addAlumno(formData);
            setCredenciales(result.credenciales); // mostrar credenciales generadas
            onAlumnoAdded(); // refresca la lista
        } catch (err) {
            console.error("Error al agregar alumno", err);
            alert("No se pudo agregar alumno");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Agregar Alumno</h2>
                {!credenciales ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleChange}
                            required
                        />
                        <select name="genero" value={formData.genero} onChange={handleChange} required>
                            <option value="">Seleccione género</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        <input
                            type="text"
                            name="telefono"
                            placeholder="Teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="peso"
                            placeholder="Peso (kg)"
                            value={formData.peso}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="altura"
                            placeholder="Altura (cm)"
                            value={formData.altura}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="objetivo"
                            placeholder="Objetivo"
                            value={formData.objetivo}
                            onChange={handleChange}
                        />
                        <select
                            name="nivel_experiencia"
                            value={formData.nivel_experiencia}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Nivel de experiencia</option>
                            <option value="Principiante">Principiante</option>
                            <option value="Intermedio">Intermedio</option>
                            <option value="Avanzado">Avanzado</option>
                        </select>

                        <button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Agregar Alumno"}
                        </button>
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                    </form>
                ) : (
                    <div className="credenciales">
                        <h3>Alumno creado ✅</h3>
                        <p><strong>Email:</strong> {credenciales.email}</p>
                        <p><strong>Password:</strong> {credenciales.password}</p>
                        <button onClick={onClose}>Cerrar</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddAlumnoModal;
