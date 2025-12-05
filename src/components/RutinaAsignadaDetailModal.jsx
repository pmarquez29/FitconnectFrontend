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
    FaUser,
    FaClock,
    FaCalendarAlt,
    FaHeartbeat,
    FaWeightHanging,
    FaStopwatch,
    FaListOl,
    FaPauseCircle,
    FaPlayCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import { createManualProgress, cambiarEstadoRutina } from "../api/progreso";
import RegistrarProgresoModal from "./RegistrarProgresoModal";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RutinaAsignadaDetailModal = ({ show, onHide, asignacionId, alumno }) => {
    const [asignacion, setAsignacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [registrando, setRegistrando] = useState(false);
    const [showRegistrarProgreso, setShowRegistrarProgreso] = useState(false);


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

        const { value: formValues } = await Swal.fire({
            title: "Registrar progreso manual",
            html: `
                <select id="ejercicio" class="swal2-select">
                    ${asignacion.ejercicios
                .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
                .join("")}
                </select>
                <input id="series" type="number" class="swal2-input" placeholder="Series completadas">
                <input id="reps" type="text" class="swal2-input" placeholder="Repeticiones realizadas">
                <input id="peso" type="number" class="swal2-input" placeholder="Peso utilizado (kg)">
                <textarea id="notas" class="swal2-textarea" placeholder="Notas adicionales"></textarea>
            `,
            focusConfirm: false,
            confirmButtonText: "Guardar",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            preConfirm: () => ({
                ejercicio_id: document.getElementById("ejercicio").value,
                series_completadas: document.getElementById("series").value,
                repeticiones_realizadas: document.getElementById("reps").value,
                peso_utilizado: document.getElementById("peso").value,
                notas: document.getElementById("notas").value,
            }),
        });

        if (formValues) {
            try {
                setRegistrando(true);
                await createManualProgress({
                    asignacion_id: asignacion.id,
                    ...formValues,
                    completado: true,
                });

                Swal.fire("✅ Éxito", "Progreso registrado correctamente", "success");
                fetchAsignacion();
            } catch (err) {
                console.error("Error al registrar progreso:", err);
                Swal.fire("Error", "No se pudo registrar el progreso", "error");
            } finally {
                setRegistrando(false);
            }
        }
    };

    const handleToggleEstado = async () => {
        if (!asignacion) return;

        const nuevo_estado = asignacion.estado === "pausada" ? "activa" : "pausada";
        const confirm = await Swal.fire({
            title: `${nuevo_estado === "pausada" ? "Pausar" : "Reanudar"} rutina`,
            text: `¿Seguro que deseas ${nuevo_estado === "pausada" ? "pausar" : "reanudar"} esta rutina?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            await cambiarEstadoRutina(asignacion.id, nuevo_estado);
            Swal.fire("✅ Éxito", `Rutina ${nuevo_estado === "pausada" ? "pausada" : "reanudada"} correctamente.`, "success");
            fetchAsignacion();
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            Swal.fire("Error", "No se pudo cambiar el estado de la rutina", "error");
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

                        {/* Info general */}
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
                                        {new Date(asignacion.fecha_inicio).toLocaleDateString("es-ES")}
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Alumno */}
                        {asignacion.alumno && (
                            <Card className="shadow-sm mb-3 border-info">
                                <Card.Body>
                                    <FaUser className="me-2 text-info" />
                                    <strong>Alumno:</strong> {asignacion.alumno.nombre} ({asignacion.alumno.email})
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
                    <button
                        className="btn btn-secondary"
                        onClick={() => setShowRegistrarProgreso(true)}
                    >
                        ✅ Registrar progreso manual
                    </button>

                    <RegistrarProgresoModal
                        show={showRegistrarProgreso}
                        onHide={() => setShowRegistrarProgreso(false)}
                        alumno={alumno}
                        asignacion={asignacion}  // 👈 añadimos esta línea
                    />



                    <Button
                        variant={asignacion?.estado === "pausada" ? "outline-primary" : "outline-warning"}
                        className="ms-2"
                        onClick={handleToggleEstado}
                    >
                        {asignacion?.estado === "pausada" ? (
                            <>
                                <FaPlayCircle className="me-2" /> Reanudar Rutina
                            </>
                        ) : (
                            <>
                                <FaPauseCircle className="me-2" /> Pausar Rutina
                            </>
                        )}
                    </Button>
                </div>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>,
        document.body
    );
};

export default RutinaAsignadaDetailModal;
