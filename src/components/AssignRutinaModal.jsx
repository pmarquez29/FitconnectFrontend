import { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner, Card, Badge } from "react-bootstrap";
import { assignRutinaToAlumno, getAvailableRutinas } from "../api/alumnos";
import { FaDumbbell, FaClock, FaUser, FaCalendarAlt } from "react-icons/fa";

const AssignRutinaModal = ({ show, onHide, alumno, onRutinaAssigned }) => {
    const [rutinas, setRutinas] = useState([]);
    const [selectedRutina, setSelectedRutina] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [notas, setNotas] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingRutinas, setLoadingRutinas] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (show) {
            loadRutinas();
            // Establecer fecha de inicio como mañana por defecto
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFechaInicio(tomorrow.toISOString().split('T')[0]);
        }
    }, [show]);

    const loadRutinas = async () => {
        setLoadingRutinas(true);
        try {
            const data = await getAvailableRutinas();
            setRutinas(data);
        } catch (err) {
            console.error("Error loading rutinas:", err);
            setError("Error al cargar rutinas disponibles");
        } finally {
            setLoadingRutinas(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRutina || !fechaInicio) {
            setError("Por favor selecciona una rutina y fecha de inicio");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await assignRutinaToAlumno(
                alumno.usuario_id || alumno.id,
                selectedRutina,
                fechaInicio,
                notas
            );
            onRutinaAssigned(response);
            onHide();
        } catch (err) {
            console.error("Error assigning rutina:", err);
            setError(err.response?.data?.error || "Error al asignar rutina");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setError("");
        setSelectedRutina("");
        setFechaInicio("");
        setNotas("");
        onHide();
    };

    const getSelectedRutinaDetails = () => {
        return rutinas.find(r => r.id === parseInt(selectedRutina));
    };

    const getNivelColor = (nivel) => {
        const colors = {
            'Principiante': 'success',
            'Intermedio': 'warning',
            'Avanzado': 'danger'
        };
        return colors[nivel] || 'secondary';
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Asignar Rutina - {alumno?.Usuario?.nombre || alumno?.nombre} {alumno?.Usuario?.apellido || alumno?.apellido}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" dismissible onClose={() => setError("")}>
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Seleccionar Rutina *</Form.Label>
                        {loadingRutinas ? (
                            <div className="text-center py-3">
                                <Spinner animation="border" size="sm" />
                                <span className="ms-2">Cargando rutinas...</span>
                            </div>
                        ) : (
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {rutinas.length === 0 ? (
                                    <Alert variant="info">
                                        No hay rutinas disponibles. Crea una rutina primero.
                                    </Alert>
                                ) : (
                                    rutinas.map(rutina => (
                                        <Card
                                            key={rutina.id}
                                            className={`mb-2 cursor-pointer ${selectedRutina === rutina.id.toString() ? 'border-primary' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedRutina(rutina.id.toString())}
                                        >
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <Form.Check
                                                                type="radio"
                                                                name="rutina"
                                                                value={rutina.id}
                                                                checked={selectedRutina === rutina.id.toString()}
                                                                onChange={(e) => setSelectedRutina(e.target.value)}
                                                                className="me-2"
                                                            />
                                                            <h6 className="mb-0 fw-bold">{rutina.nombre}</h6>
                                                        </div>

                                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                                            <Badge bg={getNivelColor(rutina.nivel)}>
                                                                <FaUser size={10} className="me-1" />
                                                                {rutina.nivel}
                                                            </Badge>
                                                            {rutina.duracion_estimada && (
                                                                <Badge bg="secondary">
                                                                    <FaClock size={10} className="me-1" />
                                                                    {rutina.duracion_estimada} min
                                                                </Badge>
                                                            )}
                                                            {rutina.frecuencia_semanal && (
                                                                <Badge bg="info">
                                                                    <FaDumbbell size={10} className="me-1" />
                                                                    {rutina.frecuencia_semanal}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {rutina.descripcion && (
                                                            <p className="mb-1 text-muted small">
                                                                {rutina.descripcion}
                                                            </p>
                                                        )}

                                                        {rutina.objetivo && (
                                                            <p className="mb-0 small">
                                                                <strong>Objetivo:</strong> {rutina.objetivo}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))
                                )}
                            </div>
                        )}
                    </Form.Group>

                    {selectedRutina && getSelectedRutinaDetails() && (
                        <Alert variant="primary" className="mb-3">
                            <h6 className="mb-2">Rutina Seleccionada:</h6>
                            <strong>{getSelectedRutinaDetails().nombre}</strong>
                            <br />
                            <small className="text-muted">
                                Nivel: {getSelectedRutinaDetails().nivel} |
                                Duración: {getSelectedRutinaDetails().duracion_estimada || 'N/A'} min |
                                Frecuencia: {getSelectedRutinaDetails().frecuencia_semanal || 'N/A'}
                            </small>
                        </Alert>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <FaCalendarAlt className="me-2" />
                            Fecha de Inicio *
                        </Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            disabled={loading}
                        />
                        <Form.Text className="text-muted">
                            La rutina comenzará en esta fecha
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Notas Adicionales</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Instrucciones especiales, modificaciones, recordatorios..."
                            disabled={loading}
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || !selectedRutina || !fechaInicio || loadingRutinas}
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" className="me-2" />
                                    Asignando...
                                </>
                            ) : (
                                <>
                                    <FaDumbbell className="me-2" />
                                    Asignar Rutina
                                </>
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AssignRutinaModal;