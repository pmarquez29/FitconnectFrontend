import { useState } from "react";
import { login, recoverPassword } from "../api/auth"; // Importamos recoverPassword
import Swal from "sweetalert2";

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

    // 🆕 Lógica de recuperación de contraseña
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        const { value: emailInput } = await Swal.fire({
            title: 'Recuperar Contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo electrónico',
            inputPlaceholder: 'ejemplo@correo.com',
            inputValue: email, // Pre-llenar si el usuario ya escribió algo
            showCancelButton: true,
            confirmButtonText: 'Enviar enlace',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0a4ef5',
            inputValidator: (value) => {
                if (!value) return 'Debes escribir un correo';
            }
        });

        if (emailInput) {
            try {
                // Llamamos a la API simulada
                await recoverPassword(emailInput);
                Swal.fire({
                    icon: 'success',
                    title: '¡Enviado!',
                    text: `Si ${emailInput} está registrado, recibirás un correo con las instrucciones.`,
                    confirmButtonColor: '#0a4ef5'
                });
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al procesar la solicitud', 'error');
            }
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}

            <label htmlFor="email">Usuario o Email</label>
            <input
                type="email"
                id="email"
                placeholder="Ingresa tu correo"
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

                {/* 🆕 Enlace funcional */}
                <a href="#" className="forgot-password" onClick={handleForgotPassword}>
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