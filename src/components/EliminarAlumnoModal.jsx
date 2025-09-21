import { useState } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { deleteAlumno } from "../api/alumnos";

const EliminarAlumnoModal = ({ show, onHide, alumno, onAlumnoDeleted }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDelete = async () => {
        setLoading(true);
        setError("");

        try {
            await deleteAlumno(alumno.usuario_id || alumno.id);
            onAlumnoDeleted(alumno);
            onHide();
        } catch (err) {
            console.error("Error deleting alumno:", err);
            setError(err.response?.data?.error || "Error al eliminar alumno");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError("");
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton={!loading}>
                <Modal.Title className="d-flex align-items-center">
                    <FaExclamationTriangle className="text-warning me-2" />
                    Confirmar Eliminación
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                )}

                <div className="text-center">
                    <div className="mb-3">
                        <FaTrash size={48} className="text-danger mb-3" />
                        <h5>¿Estás seguro de que deseas eliminar este alumno?</h5>
                    </div>

                    <div className="bg-light p-3 rounded mb-3">
                        <strong>
                            {alumno?.Usuario?.nombre || alumno?.nombre} {alumno?.Usuario?.apellido || alumno?.apellido}
                        </strong>
                        <br />
                        <small className="text-muted">
                            {alumno?.Usuario?.email || alumno?.email}
                        </small>
                    </div>

                    <Alert variant="warning" className="text-start">
                        <small>
                            <strong>⚠️ Esta acción no se puede deshacer.</strong>
                            <br />
                            Se eliminarán:
                            <ul className="mb-0 mt-2">
                                <li>Toda la información personal del alumno</li>
                                <li>Historial de entrenamientos y progreso</li>
                                <li>Rutinas asignadas</li>
                                <li>Mensajes y notificaciones</li>
                            </ul>
                        </small>
                    </Alert>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDelete} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-2" />
                            Eliminando...
                        </>
                    ) : (
                        <>
                            <FaTrash className="me-2" />
                            Sí, Eliminar
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EliminarAlumnoModal;