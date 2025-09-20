import { deleteCuenta } from "../api/configuracion";
import "../styles/configuracion.css";

const ConfigCuenta = () => {
    const handleDelete = async () => {
        if (window.confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
            await deleteCuenta();
            alert("Cuenta eliminada");
            localStorage.clear();
            window.location.href = "/";
        }
    };

    return (
        <div className="config-section danger">
            <h3>Gestión de Cuenta</h3>
            <button className="btn-danger" onClick={handleDelete}>
                Eliminar cuenta
            </button>
        </div>
    );
};

export default ConfigCuenta;
