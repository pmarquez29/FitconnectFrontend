import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
    Modal,
    Spinner,
    Alert,
    Badge,
    Row,
    Col,
    Card,
    Button,
    ProgressBar,
    ListGroup,
} from "react-bootstrap";
import {
    FaDumbbell,
    FaUser,
    FaClock,
    FaBullseye,
    FaCalendarAlt,
    FaHeartbeat,
    FaWeightHanging,
    FaStopwatch,
    FaListOl,
    FaPauseCircle,
    FaPlayCircle,
} from "react-icons/fa";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RutinaAsignadaDetailModal = ({ show, onHide, asignacionId }) => {
    const [asignacion, setAsignacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [registrando, setRegistrando] = useState(false);

    useEffect(() => {
        if (show && asignacionId) fetchAsignacion();
        else setAsignacion(null);
    }, [show, asignacionId]);

    const fetchAsignacion = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/asignacion/${asignacionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAsignacion(data);
        } catch (err) {
            console.error("Error al obtener detalles de la asignación:", err);
            setError("No se pudo cargar la información de la rutina asignada.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegistrarProgreso = async () => {
        if (!asignacion) return;
        try {
            setRegistrando(true);
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/asignacion/${asignacion.id}/progreso`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAsignacion();
        } catch (err) {
            console.error("Error al registrar progreso:", err);
        } finally {
            setRegistrando(false);
        }
    };

    const handlePausar = async () => {
        if (!asignacion) return;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${API_URL}/asignacion/${asignacion.id}/pausar`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchAsignacion();
        } catch (err) {
            console.error("Error al pausar rutina:", err);
        }
    };

    return ReactDOM.createPortal(
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>🏋️‍♂️ Detalles de Rutina Asignada</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ backgroundColor: "#f9fafb" }}>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando información...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : asignacion ? (
                    <>
                        {/* Cabecera */}
                        <Row className="align-items-center mb-3">
                            <Col>
                                <h4 className="fw-bold mb-0">{asignacion.nombre}</h4>
                                <p className="text-muted mb-0">{asignacion.objetivo}</p>
                            </Col>
                            <Col xs="auto">
                                <Badge
                                    bg={
                                        asignacion.estado === "activa"
                                            ? "success"
                                            : asignacion.estado === "pausada"
                                                ? "warning"
                                                : "secondary"
                                    }
                                    className="px-3 py-2"
                                >
                                    {asignacion.estado?.toUpperCase()}
                                </Badge>
                            </Col>
                        </Row>

                        {/* Info General */}
                        <Card className="shadow-sm mb-3 border-light">
                            <Card.Body>
                                <Row className="gy-2">
                                    <Col md={6}>
                                        <FaClock className="me-2 text-warning" />
                                        <strong>Duración:</strong> {asignacion.duracion_estimada} min
                                    </Col>
                                    <Col md={6}>
                                        <FaCalendarAlt className="me-2 text-success" />
                                        <strong>Inicio:</strong>{" "}
                                        {new Date(asignacion.fecha_inicio).toLocaleDateString(
                                            "es-ES"
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Alumno */}
                        {asignacion.alumno && (
                            <Card className="shadow-sm mb-3 border-info">
                                <Card.Body>
                                    <FaUser className="me-2 text-info" />
                                    <strong>Alumno:</strong> {asignacion.alumno.nombre} (
                                    {asignacion.alumno.email})
                                </Card.Body>
                            </Card>
                        )}

                        {/* Progreso */}
                        <Card className="shadow-sm mb-3 border-success">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="text-success mb-0">
                                        <FaHeartbeat className="me-2" /> Progreso
                                    </h6>
                                    <span className="fw-bold">{asignacion.progreso || 0}%</span>
                                </div>
                                <ProgressBar now={asignacion.progreso || 0} />
                            </Card.Body>
                        </Card>

                        {/* Ejercicios */}
                        {asignacion.ejercicios?.length > 0 && (
                            <Card className="shadow-sm border-primary">
                                <Card.Body>
                                    <h6 className="text-primary mb-3">
                                        <FaListOl className="me-2" />
                                        Ejercicios
                                    </h6>
                                    <ListGroup variant="flush">
                                        {asignacion.ejercicios.map((ej) => (
                                            <ListGroup.Item key={ej.id}>
                                                <h6 className="fw-bold mb-1">{ej.nombre}</h6>
                                                <div className="small text-muted">
                                                    <FaWeightHanging className="me-1" />
                                                    {ej.series}x{ej.repeticiones} rep •{" "}
                                                    <FaStopwatch className="me-1" />
                                                    {ej.tiempo_descanso || 0}s descanso
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        )}
                    </>
                ) : (
                    <p className="text-center text-muted">
                        No hay información disponible de esta asignación.
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <div>
                    <Button
                        variant="outline-success"
                        onClick={handleRegistrarProgreso}
                        disabled={registrando}
                    >
                        <FaPlayCircle className="me-2" />
                        Registrar Progreso
                    </Button>
                    <Button variant="outline-warning" onClick={handlePausar} className="ms-2">
                        <FaPauseCircle className="me-2" />
                        Pausar Rutina
                    </Button>
                </div>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>,
        document.body // 👈 esto lo monta directamente sobre el body
    );
};

export default RutinaAsignadaDetailModal;
