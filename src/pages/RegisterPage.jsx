import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register, getDisciplinasPublicas } from "../api/auth";
import Swal from "sweetalert2";
import "../styles/login.css";
import logo from "../assets/logo.png";
import portada from "../assets/fondo-login.jpg";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [crearNuevaDisciplina, setCrearNuevaDisciplina] = useState(false);

    const [form, setForm] = useState({
        nombre: "", apellido: "", email: "", password: "", confirmPassword: "",
        fecha_nacimiento: "", genero: "otro", telefono: "",
        disciplina_id: "",
        nombre_disciplina: "", // 🆕 Para la nueva disciplina
        especialidad: "", experiencia: 0, certificaciones: ""
    });

    useEffect(() => {
        const loadDisciplinas = async () => {
            try {
                const data = await getDisciplinasPublicas();
                setDisciplinas(data);
            } catch (error) {
                console.error("Error cargando disciplinas", error);
            }
        };
        loadDisciplinas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Lógica especial para el select de disciplina
        if (name === "disciplina_id") {
            if (value === "nueva") {
                setCrearNuevaDisciplina(true);
                setForm({ ...form, disciplina_id: "nueva", nombre_disciplina: "" });
            } else {
                setCrearNuevaDisciplina(false);
                setForm({ ...form, disciplina_id: value, nombre_disciplina: "" });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            Swal.fire("Error", "Las contraseñas no coinciden", "error");
            return;
        }

        // Validación extra si eligió crear nueva
        if (crearNuevaDisciplina && !form.nombre_disciplina.trim()) {
            Swal.fire("Atención", "Escribe el nombre de la nueva disciplina", "warning");
            return;
        }

        try {
            setLoading(true);
            const { confirmPassword, ...dataToSend } = form;
            await register(dataToSend);

            await Swal.fire({
                title: "¡Registro Exitoso!",
                text: "Tu cuenta ha sido creada.",
                icon: "success",
                confirmButtonText: "Ir al Login"
            });
            navigate("/");
        } catch (error) {
            Swal.fire("Error", error.response?.data?.error || "Error al registrarse", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left" style={{ overflowY: 'auto' }}>
                <div className="login-header">
                    <img src={logo} alt="FitConnect" className="login-logo" style={{width: '100px'}} />
                    <h2 className="login-title">Únete al equipo</h2>
                    <p className="login-subtitle">Paso {step} de 2: Información {step === 1 ? 'Personal' : 'Profesional'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>

                    {step === 1 ? (
                        <>
                            {/* ... (Inputs de Nombre, Apellido, Email, Passwords igual que antes) ... */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{flex: 1}}>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" required value={form.nombre} onChange={handleChange} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label>Apellido</label>
                                    <input type="text" name="apellido" required value={form.apellido} onChange={handleChange} />
                                </div>
                            </div>

                            <label>Email</label>
                            <input type="email" name="email" required value={form.email} onChange={handleChange} />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{flex: 1}}>
                                    <label>Contraseña</label>
                                    <input type="password" name="password" required value={form.password} onChange={handleChange} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label>Confirmar</label>
                                    <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{flex: 1}}>
                                    <label>Fecha Nac.</label>
                                    <input type="date" name="fecha_nacimiento" required value={form.fecha_nacimiento} onChange={handleChange} />
                                </div>
                                <div style={{flex: 1}}>
                                    <label>Género</label>
                                    <select name="genero" value={form.genero} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc'}}>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                        <option value="otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <label>Teléfono</label>
                            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />

                            <button type="button" onClick={() => setStep(2)}>Siguiente ➝</button>
                        </>
                    ) : (
                        <>
                            {/* 🆕 SELECT MEJORADO CON OPCIÓN 'OTRA' */}
                            <label>Disciplina Principal</label>
                            <select
                                name="disciplina_id"
                                required
                                value={form.disciplina_id}
                                onChange={handleChange}
                                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '14px'}}
                            >
                                <option value="">Selecciona una disciplina</option>
                                {disciplinas.map(d => (
                                    <option key={d.id} value={d.id}>{d.nombre}</option>
                                ))}
                                <option value="nueva" style={{fontWeight: 'bold', color: '#0a4ef5'}}>+ Otra (Crear nueva)</option>
                            </select>

                            {/* 🆕 INPUT CONDICIONAL SI ELIGE 'OTRA' */}
                            {crearNuevaDisciplina && (
                                <div style={{marginBottom: '14px', animation: 'fadeIn 0.3s'}}>
                                    <label style={{color: '#0a4ef5'}}>Nombre de la nueva disciplina</label>
                                    <input
                                        type="text"
                                        name="nombre_disciplina"
                                        placeholder="Ej: Calistenia, Zumba..."
                                        required
                                        value={form.nombre_disciplina}
                                        onChange={handleChange}
                                        style={{borderColor: '#0a4ef5'}}
                                    />
                                </div>
                            )}

                            <label>Especialidad</label>
                            <input type="text" name="especialidad" placeholder="Ej: Hipertrofia" required value={form.especialidad} onChange={handleChange} />

                            <label>Años de Experiencia</label>
                            <input type="number" name="experiencia" min="0" required value={form.experiencia} onChange={handleChange} />

                            <label>Certificaciones</label>
                            <textarea
                                name="certificaciones"
                                rows="3"
                                value={form.certificaciones}
                                onChange={handleChange}
                                style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc'}}
                            ></textarea>

                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="button" onClick={() => setStep(1)} style={{background: '#6c757d'}}>🠔 Volver</button>
                                <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Finalizar Registro'}</button>
                            </div>
                        </>
                    )}
                </form>

                <p className="register-text">
                    ¿Ya tienes cuenta? <Link to="/" className="register-link">Inicia sesión aquí</Link>
                </p>
            </div>

            {/* ... Columna Derecha sin cambios ... */}
            <div className="login-right">
                <img src={portada} alt="FitConnect" className="login-image" />
                <div className="overlay" />
                <div className="welcome-box">
                    <h2>Únete a la <span className="accent">Revolución</span></h2>
                    <p>Gestiona alumnos y crea disciplinas personalizadas.</p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;