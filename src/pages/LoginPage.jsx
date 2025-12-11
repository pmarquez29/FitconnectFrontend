import { useNavigate, Link } from "react-router-dom"; // Importamos Link
import LoginForm from "../components/LoginForm";
import "../styles/login.css";
import logo from "../assets/logo.png";
import portada from "../assets/fondo-login.jpg";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        if (user.rol === "instructor") navigate("/dashboard");
        else navigate("/alumno");
    };

    return (
        <div className="login-container">
            {/* Izquierda */}
            <div className="login-left">
                <div className="login-header">
                    <img src={logo} alt="FitConnect Logo" className="login-logo" />
                    <div className="portal-tag">👤 PORTAL PARA INSTRUCTORES</div>
                </div>

                <div className="login-content">
                    <h1 className="login-title">Inicio de sesión</h1>
                    <p className="login-subtitle">
                        Gestiona tus alumnos y rutinas desde un solo lugar
                    </p>

                    {/* El formulario ya maneja internamente el "Olvidé contraseña" */}
                    <LoginForm onLoginSuccess={handleLoginSuccess} />

                    <p className="register-text">
                        ¿No tienes cuenta?{" "}
                        {/* 🆕 Usamos Link para navegar sin recargar */}
                        <Link to="/register" className="register-link">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>

            {/* Derecha */}
            <div className="login-right">
                <img src={portada} alt="Entrenador" className="login-image" />
                <div className="overlay" />
                <div className="welcome-box">
                    <h2>
                        Bienvenido, <span className="accent">Instructor</span>
                    </h2>
                    <p>
                        Accede a tu panel de control y empieza a transformar vidas a través
                        del deporte
                    </p>

                    <ul className="features">
                        <li>👥 <strong>Gestión de Alumnos</strong><br />Administra todos tus estudiantes</li>
                        <li>💪 <strong>Crear Rutinas</strong><br />Diseña planes personalizados</li>
                        <li>📈 <strong>Seguimiento de Progreso</strong><br />Monitorea avances en tiempo real</li>
                        <li>💬 <strong>Comunicación Directa</strong><br />Conecta con tus alumnos</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;