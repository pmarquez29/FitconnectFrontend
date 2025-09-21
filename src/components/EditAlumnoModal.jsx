import { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { updateAlumno, getDisciplinas } from "../api/alumnos";

const EditAlumnoModal = ({ show, onHide, alumno, onAlumnoUpdated }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha_nacimiento: "",
        genero: "",
        disciplina_id: "",
        peso: "",
        altura: "",
        objetivo: "",
        nivel_experiencia: ""
    });
    const [disciplinas, setDisciplinas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (alumno) {
            setFormData({
                nombre: alumno.Usuario?.nombre || alumno.nombre || "",
                apellido: alumno.Usuario?.apellido || alumno.apellido || "",
                email: alumno.Usuario?.email || alumno.email || "",
                telefono: alumno.Usuario?.telefono || alumno.telefono || "",
                fecha_nacimiento: alumno.Usuario?.fecha_nacimiento || alumno.fecha_nacimiento || "",
                genero: alumno.Usuario?.genero || alumno.genero || "",
                disciplina_id: alumno.Usuario?.disciplina_id || alumno.disciplina_id || "",
                peso: alumno.peso || "",
                altura: alumno.altura || "",
                objetivo: alumno.objetivo || "",
                nivel_experiencia: alumno.nivel_experiencia || ""
            });
        }
    }, [alumno]);

    useEffect(() => {
        if (show) {
            loadDisciplinas();
        }
    }, [show]);

    const loadDisciplinas = async () => {
        try {
            const data = await getDisciplinas();
            setDisciplinas(data);
        } catch (err) {
            console.error("Error loading disciplinas:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await updateAlumno(alumno.usuario_id || alumno.id, formData);
            onAlumnoUpdated(response);
            onHide();
        } catch (err) {
            console.error("Error updating alumno:", err);
            setError(err.response?.data?.error || "Error al actualizar alumno");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setFormData({
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
            fecha_nacimiento: "",
            genero: "",
            disciplina_id: "",
            peso: "",
            altura: "",
            objetivo: "",
            nivel_experiencia: ""
        });
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Alumno</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellido *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Género *</Form.Label>
                                <Form.Select
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Otro">Otro</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Disciplina *</Form.Label>
                                <Form.Select
                                    name="disciplina_id"
                                    value={formData.disciplina_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar...</option>
                                    {disciplinas.map(disciplina => (
                                        <option key={disciplina.id} value={disciplina.id}>
                                            {disciplina.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Peso (kg)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    name="peso"
                                    value={formData.peso}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Altura (cm)</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    name="altura"
                                    value={formData.altura}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nivel de Experiencia</Form.Label>
                                <Form.Select
                                    name="nivel_experiencia"
                                    value={formData.nivel_experiencia}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="Principiante">Principiante</option>
                                    <option value="Intermedio">Intermedio</option>
                                    <option value="Avanzado">Avanzado</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Objetivo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="objetivo"
                            value={formData.objetivo}
                            onChange={handleChange}
                            placeholder="Describe el objetivo del alumno..."
                            disabled={loading}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Actualizando...
                                </>
                            ) : (
                                "Actualizar Alumno"
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditAlumnoModal;