import { useState, useEffect } from "react";
import { getPerfil, updatePerfil, changePassword } from "../api/configuracion";
import axios from "axios";
import {
    Spinner,
    Form,
    Button,
    Row,
    Col,
    Alert,
    Card,
    Image,
} from "react-bootstrap";
import "../styles/configuracion.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ConfigPerfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [passwords, setPasswords] = useState({
        actual: "",
        nueva: "",
        confirmar: "",
    });
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result.split(",")[1];
            setFotoPreview(reader.result);

            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    `${API_URL}/instructor/perfil-foto`,
                    { foto: base64String },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ✅ Guardar nueva foto en localStorage para otros componentes
                const updatedUser = { ...(JSON.parse(localStorage.getItem("user")) || {}) };
                updatedUser.foto = base64String;
                localStorage.setItem("user", JSON.stringify(updatedUser));

                // ✅ Disparar evento global para Header/Sidebar
                window.dispatchEvent(new CustomEvent("profileUpdated", { detail: updatedUser }));

                setMensaje("🖼️ Foto actualizada correctamente");
                setTimeout(() => setMensaje(""), 3000);
            } catch (err) {
                console.error("Error actualizando foto:", err);
                setError("No se pudo actualizar la foto");
                setTimeout(() => setError(""), 3000);
            }
        };

        reader.readAsDataURL(file);
    };


    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const data = await getPerfil();
                setPerfil(data);

                // Generar preview si hay foto
                if (data.foto?.data) {
                    const byteArray = new Uint8Array(data.foto.data);
                    let binary = "";
                    byteArray.forEach((b) => (binary += String.fromCharCode(b)));
                    const base64 = window.btoa(binary);
                    setFotoPreview(`data:image/jpeg;base64,${base64}`);
                }

            } catch (err) {
                console.error("Error obteniendo perfil:", err);
                setError("No se pudo cargar el perfil.");
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updatePerfil(perfil);
            setMensaje("✅ Perfil actualizado correctamente");
            setTimeout(() => setMensaje(""), 3000);
        } catch (err) {
            setError("No se pudo actualizar el perfil");
            setTimeout(() => setError(""), 3000);
        }
    };

    // 🔹 Validaciones de contraseña
    const validarPassword = () => {
        if (!passwords.actual || !passwords.nueva || !passwords.confirmar) {
            setError("Debes completar todos los campos de contraseña");
            return false;
        }
        if (passwords.nueva.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return false;
        }
        if (passwords.nueva !== passwords.confirmar) {
            setError("Las contraseñas no coinciden");
            return false;
        }
        return true;
    };

    const handleChangePassword = async () => {
        if (!validarPassword()) return;
        try {
            await changePassword(passwords);
            setMensaje("🔐 Contraseña actualizada correctamente");
            setPasswords({ actual: "", nueva: "", confirmar: "" });
            setTimeout(() => setMensaje(""), 3000);
        } catch (err) {
            setError("Error al cambiar la contraseña");
            setTimeout(() => setError(""), 3000);
        }
    };

    // 🔹 Subir foto
    const handleFotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setFotoPreview(preview);

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
            setMensaje("📸 Foto actualizada correctamente");
            setTimeout(() => setMensaje(""), 3000);
        } catch (err) {
            console.error("Error subiendo foto:", err);
            setError("No se pudo actualizar la foto");
        }
    };

    if (loading)
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" /> Cargando perfil...
            </div>
        );

    return (
        <Card className="config-card">
            <Card.Body>
                <h3 className="mb-4">Perfil del Instructor</h3>

                {mensaje && <Alert variant="success">{mensaje}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* 🔹 FOTO DE PERFIL */}
                <div className="text-center mb-4">
                    <Image
                        src={fotoPreview || "/default-avatar.png"}
                        roundedCircle
                        width="120"
                        height="120"
                        style={{ objectFit: "cover", border: "2px solid #ccc" }}
                    />
                    <div className="mt-2">
                        <Form.Label
                            htmlFor="foto"
                            className="btn btn-outline-secondary btn-sm"
                            style={{ cursor: "pointer" }}
                        >
                            Cambiar foto
                        </Form.Label>
                        <Form.Control
                            type="file"
                            id="foto"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFotoChange}
                        />
                    </div>
                </div>

                {/* 🔹 DATOS PERSONALES */}
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control value={perfil?.nombre || ""} disabled readOnly />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Correo</Form.Label>
                            <Form.Control value={perfil?.email || ""} disabled readOnly />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                name="telefono"
                                value={perfil?.telefono || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Disciplina</Form.Label>
                            <Form.Control
                                value={perfil?.Disciplina?.nombre || ""}
                                disabled
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Especialidad</Form.Label>
                            <Form.Control
                                name="especialidad"
                                value={perfil?.Instructor?.especialidad || ""}
                                onChange={(e) =>
                                    setPerfil({
                                        ...perfil,
                                        Instructor: {
                                            ...perfil.Instructor,
                                            especialidad: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Experiencia (años)</Form.Label>
                            <Form.Control
                                type="number"
                                name="experiencia"
                                value={perfil?.Instructor?.experiencia || ""}
                                onChange={(e) =>
                                    setPerfil({
                                        ...perfil,
                                        Instructor: {
                                            ...perfil.Instructor,
                                            experiencia: e.target.value,
                                        },
                                    })
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Certificaciones</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        name="certificaciones"
                        value={perfil?.Instructor?.certificaciones || ""}
                        onChange={(e) =>
                            setPerfil({
                                ...perfil,
                                Instructor: {
                                    ...perfil.Instructor,
                                    certificaciones: e.target.value,
                                },
                            })
                        }
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>
                    Guardar cambios
                </Button>

                <hr />

                {/* 🔹 CAMBIO DE CONTRASEÑA */}
                <h5 className="mt-4">Cambiar Contraseña</h5>
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Control
                            type="password"
                            placeholder="Contraseña actual"
                            value={passwords.actual}
                            onChange={(e) =>
                                setPasswords({ ...passwords, actual: e.target.value })
                            }
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="password"
                            placeholder="Nueva contraseña"
                            value={passwords.nueva}
                            onChange={(e) =>
                                setPasswords({ ...passwords, nueva: e.target.value })
                            }
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={passwords.confirmar}
                            onChange={(e) =>
                                setPasswords({ ...passwords, confirmar: e.target.value })
                            }
                        />
                    </Col>
                </Row>
                <Button variant="success" onClick={handleChangePassword}>
                    Actualizar contraseña
                </Button>
            </Card.Body>
        </Card>
    );
};

export default ConfigPerfil;
