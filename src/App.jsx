import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AlumnosPage from "./pages/AlumnosPage";
import RutinasPage from "./pages/RutinasPage";
import MensajesPage from "./pages/MensajesPage";
import EstadisticasPage from "./pages/EstadisticasPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import AlumnoPerfilPage from "./pages/AlumnoPerfilPage";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                {/* Login */}
                <Route path="/" element={<LoginPage />} />

                {/* Panel principal */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/alumnos" element={<AlumnosPage />} />
                <Route path="/rutinas" element={<RutinasPage />} />
                <Route path="/mensajes" element={<MensajesPage />} />
                <Route path="/estadisticas" element={<EstadisticasPage />} />
                <Route path="/configuracion" element={<ConfiguracionPage />} />
                <Route path={"/register"} element={<RegisterPage />} />

                {/* Perfil de alumno (detalle individual) */}
                <Route path="/alumnos/:id" element={<AlumnoPerfilPage />} />
            </Routes>
        </Router>
    );
}

export default App;
