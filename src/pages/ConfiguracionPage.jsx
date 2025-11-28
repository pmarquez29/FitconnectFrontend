import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ConfigPerfil from "../components/ConfigPerfil";
import ConfigCuenta from "../components/ConfigCuenta";
import "../styles/layout.css";
import "../styles/configuracion.css";

const ConfiguracionPage = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="layout">
            <Sidebar />
            <main className="content configuracion-container">
                <Header user={user} />

                <div className="config-header">
                    <h1>Configuración del Perfil</h1>
                    <p>Gestiona tu información y seguridad personal</p>
                </div>

                <div className="config-grid">
                    <ConfigPerfil />
                    <ConfigCuenta />
                </div>
            </main>
        </div>
    );
};

export default ConfiguracionPage;
