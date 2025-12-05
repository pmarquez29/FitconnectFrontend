import { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner, Alert } from "react-bootstrap";
import { getActiveExercises, createManualProgress } from "../api/progreso";
import Swal from "sweetalert2";

const RegistrarProgresoModal = ({ show, onHide, alumno, asignacion }) => {
    const [loading, setLoading] = useState(false);
    const [rutina, setRutina] = useState(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEjercicio, setSelectedEjercicio] = useState("");
    const [form, setForm] = useState({
        series_completadas: "",
        repeticiones_realizadas: "",
        peso_utilizado: "",
        dificultad_percibida: "",
        notas: "",
        completado: false
    });

    useEffect(() => {
        if (show) {
            if (asignacion && asignacion.ejercicios) {
                // Si viene desde el detalle, usamos directamente los ejercicios de esa rutina
                setRutina({ id: asignacion.id, nombre: asignacion.nombre });
                setEjercicios(asignacion.ejercicios);
            } else if (alumno) {
                // Si no hay asignacion pasada, entonces cargamos la rutina activa
                loadEjercicios();
            }
        }
    }, [show, asignacion]);


    const loadEjercicios = async () => {
        setLoading(true);
        try {
            const data = await getActiveExercises(alumno.id || alumno.usuario_id);
            setRutina({ id: data.asignacion_id, nombre: data.rutina });
            setEjercicios(data.ejercicios);
        } catch (err) {
            console.error("Error cargando ejercicios:", err);
            Swal.fire("Error", err.response?.data?.error || "No se pudo cargar la rutina activa", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEjercicio) {
            Swal.fire("Atención", "Debes seleccionar un ejercicio", "warning");
            return;
        }

        try {
            const data = {
                alumno_id: alumno.id || alumno.usuario_id,
                asignacion_id: rutina.id,
                ejercicio_id: selectedEjercicio,
                ...form
            };
            await createManualProgress(data);
            Swal.fire("✅ Éxito", "Progreso registrado correctamente", "success");
            onHide();
        } catch (err) {
            console.error("Error registrando progreso:", err);
            Swal.fire("Error", err.response?.data?.error || "No se pudo registrar el progreso", "error");
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Registrar Progreso Manual</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-3">
                        <Spinner animation="border" />
                        <p className="mt-2">Cargando rutina activa...</p>
                    </div>
                ) : rutina ? (
                    <Form onSubmit={handleSubmit}>
                        <h5 className="mb-3 text-primary">{rutina.nombre}</h5>

                        <Form.Group className="mb-3">
                            <Form.Label>Ejercicio</Form.Label>
                            <Form.Select
                                value={selectedEjercicio}
                                onChange={(e) => setSelectedEjercicio(e.target.value)}
                            >
                                <option value="">Seleccionar ejercicio...</option>
                                {ejercicios.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre} ({e.grupo_muscular})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {selectedEjercicio && (
                            <Alert variant="info">
                                <strong>Descripción: </strong>
                                {ejercicios.find((e) => e.id == selectedEjercicio)?.descripcion || "Sin descripción"}
                                <br />
                                <strong>Instrucciones: </strong>
                                {ejercicios.find((e) => e.id == selectedEjercicio)?.instrucciones || "—"}
                            </Alert>
                        )}

                        <Form.Group className="mb-2">
                            <Form.Label>Series completadas</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.series_completadas}
                                onChange={(e) => setForm({ ...form, series_completadas: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Repeticiones realizadas</Form.Label>
                            <Form.Control
                                type="text"
                                value={form.repeticiones_realizadas}
                                onChange={(e) => setForm({ ...form, repeticiones_realizadas: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Peso utilizado (kg)</Form.Label>
                            <Form.Control
                                type="number"
                                value={form.peso_utilizado}
                                onChange={(e) => setForm({ ...form, peso_utilizado: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Dificultad percibida (1-10)</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="10"
                                value={form.dificultad_percibida}
                                onChange={(e) => setForm({ ...form, dificultad_percibida: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Notas</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={form.notas}
                                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Check
                            type="checkbox"
                            label="Ejercicio completado"
                            checked={form.completado}
                            onChange={(e) => setForm({ ...form, completado: e.target.checked })}
                        />

                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="secondary" onClick={onHide} className="me-2">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                Registrar progreso
                            </Button>
                        </div>
                    </Form>
                ) : (
                    <Alert variant="warning">Este alumno no tiene una rutina activa.</Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default RegistrarProgresoModal;
