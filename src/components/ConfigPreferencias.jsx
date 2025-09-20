import { useState } from "react";
import { updatePreferencias } from "../api/configuracion";
import "../styles/configuracion.css";

const ConfigPreferencias = () => {
    const [prefs, setPrefs] = useState({
        idioma: "es",
        notificaciones: true,
        tema: "claro"
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPrefs({ ...prefs, [name]: type === "checkbox" ? checked : value });
    };

    const handleSave = async () => {
        await updatePreferencias(prefs);
        alert("Preferencias guardadas");
    };

    return (
        <div className="config-section">
            <h3>Preferencias</h3>
            <label>
                Idioma:
                <select name="idioma" value={prefs.idioma} onChange={handleChange}>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </label>
            <label>
                <input type="checkbox" name="notificaciones" checked={prefs.notificaciones} onChange={handleChange} />
                Activar notificaciones
            </label>
            <label>
                Tema:
                <select name="tema" value={prefs.tema} onChange={handleChange}>
                    <option value="claro">Claro</option>
                    <option value="oscuro">Oscuro</option>
                </select>
            </label>
            <button onClick={handleSave}>Guardar</button>
        </div>
    );
};

export default ConfigPreferencias;
