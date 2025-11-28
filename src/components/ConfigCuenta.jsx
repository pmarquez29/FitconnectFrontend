import { deleteCuenta } from "../api/configuracion";

const ConfigCuenta = () => {
    const handleDelete = async () => {
        const confirm = window.confirm(
            "⚠️ ¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible."
        );
        if (!confirm) return;
        await deleteCuenta();
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="config-section danger-section">
            <h3>Gestión de Cuenta</h3>
            <p>Eliminar tu cuenta borrará todos tus datos y rutinas.</p>
            <button className="btn-danger" onClick={handleDelete}>
                Eliminar cuenta
            </button>
        </div>
    );
};

export default ConfigCuenta;
