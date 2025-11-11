import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { addAlumno } from "../api/alumnos";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const AddAlumnoModal = ({ isOpen, onClose, onAlumnoAdded }) => {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        fecha_nacimiento: "",
        genero: "",
        telefono: "",
        disciplina_id: "",
        peso: "",
        altura: "",
        objetivo: "",
        nivel_experiencia: "Principiante",
    });

    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔹 Cargar disciplinas dinámicamente al abrir el modal
    useEffect(() => {
        if (isOpen) {
            fetchDisciplinas();
        }
    }, [isOpen]);

    const fetchDisciplinas = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/disciplinas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDisciplinas(res.data);
        } catch (err) {
            console.error("Error al cargar disciplinas:", err);
            setDisciplinas([]);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await addAlumno(form);
            onAlumnoAdded(res.credenciales); // 👉 enviamos credenciales al padre
        } catch (err) {
            console.error("Error al agregar alumno:", err);
            setError(err.response?.data?.error || "Error al agregar alumno");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Agregar Alumno</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} className="px-1">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Label>Nombre *</Form.Label>
                            <Form.Control
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Apellido *</Form.Label>
                            <Form.Control
                                name="apellido"
                                value={form.apellido}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha_nacimiento"
                                value={form.fecha_nacimiento}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Género</Form.Label>
                            <Form.Select
                                name="genero"
                                value={form.genero}
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </Form.Select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Disciplina *</Form.Label>
                            <Form.Select
                                name="disciplina_id"
                                value={form.disciplina_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecciona una disciplina</option>
                                {disciplinas.length > 0 ? (
                                    disciplinas.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.nombre}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">Cargando...</option>
                                )}
                            </Form.Select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Nivel de Experiencia</Form.Label>
                            <Form.Select
                                name="nivel_experiencia"
                                value={form.nivel_experiencia}
                                onChange={handleChange}
                            >
                                <option value="Principiante">Principiante</option>
                                <option value="Intermedio">Intermedio</option>
                                <option value="Avanzado">Avanzado</option>
                            </Form.Select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <Form.Label>Peso (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                name="peso"
                                value={form.peso}
                                onChange={handleChange}
                                step="0.1"
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <Form.Label>Altura (cm)</Form.Label>
                            <Form.Control
                                type="number"
                                name="altura"
                                value={form.altura}
                                onChange={handleChange}
                                step="0.1"
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <Form.Label>Objetivo</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="objetivo"
                                value={form.objetivo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-3">
                        <Button variant="secondary" onClick={onClose} className="me-2">
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="d-flex align-items-center"
                        >
                            {loading && <Spinner animation="border" size="sm" className="me-2" />}
                            {loading ? "Guardando..." : "Agregar Alumno"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddAlumnoModal;
