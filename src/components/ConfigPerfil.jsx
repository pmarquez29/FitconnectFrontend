import { useState, useEffect } from "react";
import { getPerfil, updatePerfil, changePassword } from "../api/configuracion";
import "../styles/configuracion.css";

const ConfigPerfil = () => {
    const [perfil, setPerfil] = useState({});
    const [passwords, setPasswords] = useState({ actual: "", nueva: "" });

    useEffect(() => {
        getPerfil().then(setPerfil);
    }, []);

    const handleChange = (e) => setPerfil({ ...perfil, [e.target.name]: e.target.value });

    const handleSave = async () => {
        await updatePerfil(perfil);
        alert("Perfil actualizado");
    };

    const handleChangePassword = async () => {
        await changePassword(passwords);
        alert("Contraseña cambiada");
        setPasswords({ actual: "", nueva: "" });
    };

    return (
        <div className="config-section">
            <h3>Perfil</h3>
            <input name="nombre" value={perfil.nombre || ""} onChange={handleChange} placeholder="Nombre completo" />
            <input name="email" value={perfil.email || ""} onChange={handleChange} placeholder="Correo" />
            <input name="telefono" value={perfil.telefono || ""} onChange={handleChange} placeholder="Teléfono" />
            <button onClick={handleSave}>Guardar cambios</button>

            <h4>Cambiar contraseña</h4>
            <input type="password" placeholder="Contraseña actual" value={passwords.actual} onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })} />
            <input type="password" placeholder="Nueva contraseña" value={passwords.nueva} onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })} />
            <button onClick={handleChangePassword}>Actualizar contraseña</button>
        </div>
    );
};

export default ConfigPerfil;
