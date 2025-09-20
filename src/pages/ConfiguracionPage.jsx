import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ConfigPerfil from "../components/ConfigPerfil";
import ConfigPreferencias from "../components/ConfigPreferencias";
import ConfigCuenta from "../components/ConfigCuenta";
import "../styles/layout.css";
import "../styles/configuracion.css";

const ConfiguracionPage = () => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                <div className="configuracion-header">
                    <h1>Configuración</h1>
                    <p>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <ConfigPerfil />
                <ConfigPreferencias />
                <ConfigCuenta />
            </main>
        </div>
    );
};

export default ConfiguracionPage;
