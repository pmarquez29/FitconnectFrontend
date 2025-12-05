import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ConfigPerfil from "../components/ConfigPerfil";
import "../styles/layout.css";
import "../styles/configuracion.css";
import {useState} from "react";

const ConfiguracionPage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="layout">
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <main className="content configuracion-container">
                <Header user={user} />

                <div className="config-header">
                    <h1>Configuración del Perfil</h1>
                    <p>Gestiona tu información y seguridad personal</p>
                </div>

                <div className="config-grid">
                    <ConfigPerfil />
                </div>
            </main>
        </div>
    );
};

export default ConfiguracionPage;
