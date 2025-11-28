import { useEffect, useState } from "react";
import {
    Modal,
    Spinner,
    Alert,
    Badge,
    Row,
    Col,
    Card,
    Button,
    ListGroup,
} from "react-bootstrap";
import {
    FaDumbbell,
    FaBullseye,
    FaClock,
    FaLayerGroup,
    FaListOl,
    FaCheckCircle,
    FaTimesCircle,
    FaEdit,
} from "react-icons/fa";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RutinaCatalogoDetailModal = ({ show, onHide, rutinaId, onEstadoCambiado, onEditar }) => {
    const [rutina, setRutina] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [actualizando, setActualizando] = useState(false);

    useEffect(() => {
        if (rutinaId && show) fetchRutina();
    }, [rutinaId, show]);

    const fetchRutina = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/rutinas/${rutinaId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRutina(data);
        } catch (err) {
            console.error("Error al obtener rutina:", err);
            setError("No se pudo cargar la información de la rutina.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleEstado = async () => {
        if (!rutina) return;
        try {
            setActualizando(true);
            const token = localStorage.getItem("token");
            await axios.patch(
                `${API_URL}/rutinas/${rutina.id}/estado`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onEstadoCambiado?.();
            onHide();
        } catch (err) {
            console.error("Error al cambiar estado:", err);
        } finally {
            setActualizando(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <FaDumbbell className="me-2" />
                    Detalles de Rutina
                </Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: "#f9fafb" }}>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando información...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : rutina ? (
                    <>
                        <Row className="mb-3">
                            <Col>
                                <h4 className="fw-bold text-dark mb-1">{rutina.nombre}</h4>
                                <p className="text-muted mb-0">{rutina.descripcion || "Sin descripción"}</p>
                            </Col>
                            <Col xs="auto">
                                <Badge bg="info" className="px-3 py-2">
                                    {rutina.nivel}
                                </Badge>
                            </Col>
                        </Row>

                        <Card className="shadow-sm mb-3 border-light">
                            <Card.Body>
                                <Row className="gy-2">
                                    <Col md={6}>
                                        <FaBullseye className="me-2 text-danger" />
                                        <strong>Objetivo:</strong> {rutina.objetivo}
                                    </Col>
                                    <Col md={6}>
                                        <FaDumbbell className="me-2 text-primary" />
                                        <strong>Disciplina:</strong> {rutina.disciplina}
                                    </Col>
                                    <Col md={6}>
                                        <FaClock className="me-2 text-warning" />
                                        <strong>Duración:</strong> {rutina.duracion_estimada || 0} min
                                    </Col>
                                    <Col md={6}>
                                        <FaLayerGroup className="me-2 text-success" />
                                        <strong>Frecuencia:</strong> {rutina.frecuencia_semanal || "N/A"}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {rutina.ejercicios?.length > 0 ? (
                            <Card className="shadow-sm border-primary">
                                <Card.Body>
                                    <h6 className="fw-semibold text-primary mb-3">
                                        <FaListOl className="me-2" />
                                        Ejercicios de la Rutina
                                    </h6>
                                    <ListGroup variant="flush">
                                        {rutina.ejercicios
                                            .sort((a, b) => a.orden - b.orden)
                                            .map((ej) => (
                                                <ListGroup.Item key={ej.id} className="py-3">
                                                    <div className="d-flex justify-content-between flex-wrap">
                                                        <div>
                                                            <h6 className="fw-bold mb-1">{ej.nombre}</h6>
                                                            <p className="text-muted small mb-2">
                                                                {ej.descripcion || "Sin descripción"}
                                                            </p>
                                                            <div className="small text-muted">
                                                                🧩 {ej.grupo_muscular || "General"} •{" "}
                                                                {ej.series} x {ej.repeticiones || "N/A"} rep • ⏱️{" "}
                                                                {ej.tiempo_descanso || 0}s descanso
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        ) : (
                            <Alert variant="info" className="text-center">
                                No hay ejercicios registrados en esta rutina.
                            </Alert>
                        )}
                    </>
                ) : (
                    <p className="text-center text-muted">No hay información disponible.</p>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <div>
                    <Button
                        variant="outline-primary"
                        onClick={() => onEditar?.(rutina)}
                    >
                        <FaEdit className="me-2" />
                        Editar
                    </Button>

                </div>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RutinaCatalogoDetailModal;
