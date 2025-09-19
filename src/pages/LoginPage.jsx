import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "../styles/login.css";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleLoginSuccess = (user) => {
        if (user.rol === "instructor") {
            navigate("/dashboard");
        } else {
            // opcional: podrías redirigir a un landing de alumnos
            navigate("/alumno");
        }
    };

    return (
        <div className="login-page">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
    );
};

export default LoginPage;
