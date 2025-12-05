import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AddEjercicioModal = ({ show, onHide, onCreated, rutinaId, disciplinaNombre }) => {
    const [form, setForm] = useState({
        nombre: "",
        grupo_muscular: "",
        equipo_necesario: "",
        instrucciones: "",
    });
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setGuardando(true);
            const token = localStorage.getItem("token");

            const payload = {
                ...form,
                rutina_id: rutinaId || undefined,
                disciplina_nombre: disciplinaNombre || undefined,
            };

            await axios.post(`${API_URL}/ejercicios`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess("✅ Ejercicio creado correctamente.");
            setTimeout(() => {
                onCreated?.();
                onHide();
            }, 800);
        } catch (err) {
            console.error("Error creando ejercicio:", err);
            setError("No se pudo crear el ejercicio. Verifica los datos.");
        } finally {
            setGuardando(false);
        }
    };

    const handleClose = () => {
        setForm({
            nombre: "",
            grupo_muscular: "",
            equipo_necesario: "",
            instrucciones: "",
        });
        setError("");
        setSuccess("");
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Ejercicio</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nombre del Ejercicio</Form.Label>
                        <Form.Control
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Sentadillas con barra"
                            required
                        />
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Grupo Muscular</Form.Label>
                                <Form.Control
                                    name="grupo_muscular"
                                    value={form.grupo_muscular}
                                    onChange={handleChange}
                                    placeholder="Ej. Piernas"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Equipo Necesario</Form.Label>
                                <Form.Control
                                    name="equipo_necesario"
                                    value={form.equipo_necesario}
                                    onChange={handleChange}
                                    placeholder="Ej. Mancuernas, barra..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Instrucciones</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="instrucciones"
                            value={form.instrucciones}
                            onChange={handleChange}
                            placeholder="Describe la forma correcta de ejecutar el ejercicio"
                        />
                    </Form.Group>

                    {rutinaId ? (
                        <Form.Text className="text-muted">
                            🔗 Este ejercicio se asociará automáticamente a la rutina ID: {rutinaId}
                        </Form.Text>
                    ) : disciplinaNombre ? (
                        <Form.Text className="text-muted">
                            📘 Se asociará a la disciplina: <strong>{disciplinaNombre}</strong>
                        </Form.Text>
                    ) : (
                        <Form.Text className="text-danger">
                            ⚠️ No se especificó rutina ni disciplina.
                        </Form.Text>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="success" disabled={guardando}>
                        {guardando ? (
                            <>
                                <Spinner size="sm" className="me-2" /> Guardando...
                            </>
                        ) : (
                            "Crear Ejercicio"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddEjercicioModal;
