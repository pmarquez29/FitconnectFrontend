import { useState } from "react";
import { login } from "../api/auth";

const LoginForm = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { token, user } = await login(email, password);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            onLoginSuccess(user); // callback para redirigir
        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>

            {error && <p className="error">{error}</p>}

            <label htmlFor="email">Correo electrónico</label>
            <input
                type="email"
                id="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="password">Contraseña</label>
            <input
                type="password"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </button>
        </form>
    );
};

export default LoginForm;
