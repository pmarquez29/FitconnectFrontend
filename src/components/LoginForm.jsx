import { useState } from "react";
import { login } from "../api/auth";

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { token, user } = await login(email, password);
            if (remember) localStorage.setItem("remember", "true");
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            onLoginSuccess(user);
        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <label htmlFor="email">Usuario o Email</label>
            <input
                type="email"
                id="email"
                placeholder="Ingresa tu nombre de usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="password">Contraseña</label>
            <input
                type="password"
                id="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="form-options">
                <label className="remember">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                    />
                    Recordar sesión
                </label>
                <a href="#" className="forgot-password">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
        </form>
    );
};

export default LoginForm;
