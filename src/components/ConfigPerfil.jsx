import { useState, useEffect } from "react";
import { getPerfil, updatePerfil, changePassword, deleteCuenta } from "../api/configuracion";
import axios from "axios";
import { Spinner, Form, Alert } from "react-bootstrap";
import Swal from "sweetalert2"; // Usaremos SweetAlert para que se vea mejor que window.confirm
import { FaCamera, FaSave, FaLock, FaTrashAlt, FaUserEdit, FaPhone, FaAward, FaBriefcase } from "react-icons/fa";
import "../styles/configuracion.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ConfigPerfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [passwords, setPasswords] = useState({ actual: "", nueva: "", confirmar: "" });
    const [loading, setLoading] = useState(true);

    // Estados para feedback visual
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPerfil();
    }, []);

    const fetchPerfil = async () => {
        try {
            const data = await getPerfil();
            setPerfil(data);

            if (data.foto?.data) {
                const byteArray = new Uint8Array(data.foto.data);
                let binary = "";
                byteArray.forEach((b) => (binary += String.fromCharCode(b)));
                const base64 = window.btoa(binary);
                setFotoPreview(`data:image/jpeg;base64,${base64}`);
            }
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo cargar el perfil.");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 MANEJO DE CAMBIOS EN INPUTS ANIDADOS
    const handleInstructorChange = (e) => {
        const { name, value } = e.target;
        setPerfil((prev) => ({
            ...prev,
            Instructor: {
                ...prev.Instructor,
                [name]: value,
            },
        }));
    };

    // 🔹 GUARDAR SOLO DATOS DE TEXTO (SOLUCIÓN AL ERROR PAYLOAD TOO LARGE)
    const handleSave = async () => {
        setSaving(true);
        setError("");
        try {
            // ⚠️ FILTRAMOS DATOS: No enviamos 'foto' ni todo el objeto 'perfil'
            const payload = {
                telefono: perfil.telefono,
                especialidad: perfil.Instructor?.especialidad,
                experiencia: perfil.Instructor?.experiencia,
                certificaciones: perfil.Instructor?.certificaciones
            };

            await updatePerfil(payload);

            Swal.fire({
                icon: 'success',
                title: 'Perfil actualizado',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwords.actual || !passwords.nueva || !passwords.confirmar) {
            Swal.fire('Atención', 'Todos los campos son obligatorios', 'warning');
            return;
        }
        if (passwords.nueva.length < 6) {
            Swal.fire('Atención', 'La nueva contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }
        if (passwords.nueva !== passwords.confirmar) {
            Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
            return;
        }

        try {
            await changePassword(passwords);
            Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
            setPasswords({ actual: "", nueva: "", confirmar: "" });
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || 'Error al cambiar contraseña', 'error');
        }
    };

    const handleFotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setFotoPreview(previewUrl);

        const formData = new FormData();
        formData.append("foto", file);

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/instructor/foto`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Actualizar localStorage y evento
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(",")[1];
                const updatedUser = JSON.parse(localStorage.getItem("user")) || {};
                updatedUser.foto = base64String;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));
            };
            reader.readAsDataURL(file);

            Swal.fire({
                icon: 'success',
                title: 'Foto actualizada',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            Swal.fire('Error', 'No se pudo subir la foto', 'error');
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Eliminar cuenta?',
            text: "Esta acción no se puede deshacer. Perderás todos tus alumnos y rutinas.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await deleteCuenta();
                localStorage.clear();
                window.location.href = "/";
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar la cuenta', 'error');
            }
        }
    };

    if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

    return (
        <div className="config-container fade-in">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* 📸 SECCIÓN 1: IDENTIDAD */}
            <div className="config-card identity-card">
                <div className="avatar-section">
                    <div className="avatar-wrapper">
                        <img src={fotoPreview || "/assets/avatar.png"} alt="Perfil" className="profile-avatar" />
                        <label htmlFor="foto-upload" className="camera-btn">
                            <FaCamera />
                        </label>
                        <input type="file" id="foto-upload" hidden accept="image/*" onChange={handleFotoChange} />
                    </div>
                    <div className="user-info">
                        <h2>{perfil?.nombre} {perfil?.apellido}</h2>
                        <span className="badge-rol">{perfil?.rol?.toUpperCase()}</span>
                        <p className="email-text">{perfil?.email}</p>
                    </div>
                </div>
            </div>

            {/* 📝 SECCIÓN 2: DATOS PROFESIONALES */}
            <div className="config-card">
                <div className="card-header-custom">
                    <FaUserEdit /> <h3>Información Profesional</h3>
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Teléfono</label>
                        <div className="input-icon-wrapper">
                            <FaPhone className="icon" />
                            <input
                                type="text"
                                value={perfil?.telefono || ""}
                                onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Disciplina</label>
                        <div className="input-icon-wrapper disabled">
                            <FaBriefcase className="icon" />
                            <input type="text" value={perfil?.Disciplina?.nombre || ""} disabled />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Especialidad</label>
                        <div className="input-icon-wrapper">
                            <FaAward className="icon" />
                            <input
                                type="text"
                                name="especialidad"
                                value={perfil?.Instructor?.especialidad || ""}
                                onChange={handleInstructorChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Experiencia (años)</label>
                        <div className="input-icon-wrapper">
                            <FaBriefcase className="icon" />
                            <input
                                type="number"
                                name="experiencia"
                                value={perfil?.Instructor?.experiencia || ""}
                                onChange={handleInstructorChange}
                            />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label>Certificaciones y Logros</label>
                        <textarea
                            className="textarea-custom"
                            rows="3"
                            name="certificaciones"
                            value={perfil?.Instructor?.certificaciones || ""}
                            onChange={handleInstructorChange}
                        ></textarea>
                    </div>
                </div>
                <div className="action-row">
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : <><FaSave /> Guardar Cambios</>}
                    </button>
                </div>
            </div>

            {/* 🔐 SECCIÓN 3: SEGURIDAD */}
            <div className="config-grid-dual">
                <div className="config-card">
                    <div className="card-header-custom">
                        <FaLock /> <h3>Seguridad</h3>
                    </div>
                    <div className="security-form">
                        <input
                            type="password"
                            placeholder="Contraseña actual"
                            className="input-simple"
                            value={passwords.actual}
                            onChange={e => setPasswords({...passwords, actual: e.target.value})}
                        />
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="input-simple"
                            value={passwords.nueva}
                            onChange={e => setPasswords({...passwords, nueva: e.target.value})}
                        />
                        <input
                            type="password"
                            placeholder="Confirmar nueva"
                            className="input-simple"
                            value={passwords.confirmar}
                            onChange={e => setPasswords({...passwords, confirmar: e.target.value})}
                        />
                        <button className="btn-password" onClick={handleChangePassword}>
                            Actualizar Contraseña
                        </button>
                    </div>
                </div>

                <div className="config-card danger-zone">
                    <div className="card-header-custom text-danger">
                        <FaTrashAlt /> <h3>Zona de Peligro</h3>
                    </div>
                    <p>Si eliminas tu cuenta, se perderán todos los datos de tus alumnos, rutinas y progresos de forma permanente.</p>
                    <button className="btn-delete" onClick={handleDelete}>
                        Eliminar Cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigPerfil;