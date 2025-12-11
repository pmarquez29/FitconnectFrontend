import { useState, useEffect } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import {
    FaDumbbell,
    FaRedo,
    FaWeightHanging,
    FaTachometerAlt,
    FaStickyNote,
    FaCheckCircle
} from "react-icons/fa";
import Swal from "sweetalert2";
import { getActiveExercises, createManualProgress } from "../api/progreso";
import "../styles/registrarProgreso.css"; // Importar estilos nuevos

const RegistrarProgresoModal = ({ show, onHide, alumno, asignacion }) => {
    const [loading, setLoading] = useState(false);
    const [rutinaNombre, setRutinaNombre] = useState("");
    const [rutinaId, setRutinaId] = useState(null);
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEjercicio, setSelectedEjercicio] = useState("");

    // Estado del formulario
    const [form, setForm] = useState({
        series_completadas: "",
        repeticiones_realizadas: "",
        peso_utilizado: "",
        dificultad_percibida: "",
        notas: ""
    });

    useEffect(() => {
        if (show) {
            // Resetear formulario al abrir
            setForm({
                series_completadas: "",
                repeticiones_realizadas: "",
                peso_utilizado: "",
                dificultad_percibida: "",
                notas: ""
            });
            setSelectedEjercicio("");

            // Cargar datos
            loadData();
        }
    }, [show, asignacion, alumno]);

    const loadData = async () => {
        // Opción A: Viene desde el modal de detalle (ya tiene ejercicios con estado)
        if (asignacion && asignacion.ejercicios) {
            setRutinaId(asignacion.id);
            setRutinaNombre(asignacion.nombre);
            setEjercicios(asignacion.ejercicios);
            return;
        }

        // Opción B: Viene desde un botón suelto, hay que buscar la rutina activa y su progreso
        if (alumno) {
            setLoading(true);
            try {
                // Ahora este endpoint (gracias al cambio en backend) trae 'completado'
                const data = await getActiveExercises(alumno.id || alumno.usuario_id);
                setRutinaId(data.asignacion_id);
                setRutinaNombre(data.rutina);
                setEjercicios(data.ejercicios);
            } catch (err) {
                console.error("Error cargando ejercicios:", err);
                Swal.fire("Error", "No se pudo cargar la rutina activa del alumno.", "error");
                onHide(); // Cerrar si hay error crítico
            } finally {
                setLoading(false);
            }
        }
    };

    // 🔍 FILTRADO MÁGICO: Solo mostrar los que NO están completados
    const ejerciciosPendientes = ejercicios.filter(e => !e.completado);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEjercicio) {
            Swal.fire("Atención", "Debes seleccionar un ejercicio.", "warning");
            return;
        }

        // Validaciones básicas
        if (!form.series_completadas || !form.repeticiones_realizadas) {
            Swal.fire("Faltan datos", "Por favor ingresa al menos series y repeticiones.", "warning");
            return;
        }

        try {
            const payload = {
                alumno_id: alumno?.id || alumno?.usuario_id,
                asignacion_id: rutinaId,
                ejercicio_id: selectedEjercicio,
                ...form,
                completado: true // Marcar como hecho
            };

            await createManualProgress(payload);

            await Swal.fire({
                title: "¡Excelente!",
                text: "Ejercicio registrado y marcado como completado.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            // Recargar datos para actualizar la lista de pendientes sin cerrar el modal
            // (Opcional: puedes cerrar el modal con onHide() si prefieres)
            if (asignacion) {
                // Si venía de asignación estática, cerramos para forzar refresh del padre
                onHide();
            } else {
                loadData(); // Recargamos para que el ejercicio desaparezca del select
            }

            // Limpiar form
            setForm({ ...form, series_completadas: "", repeticiones_realizadas: "", peso_utilizado: "", notas: "" });
            setSelectedEjercicio("");

        } catch (err) {
            console.error("Error registrando progreso:", err);
            Swal.fire("Error", "No se pudo registrar el progreso.", "error");
        }
    };

    // Obtener detalles del ejercicio seleccionado para mostrar info
    const ejercicioInfo = ejercicios.find(e => String(e.id) === String(selectedEjercicio));

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            dialogClassName="modal-pro" // Clase CSS personalizada
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {rutinaNombre ? `Registrar: ${rutinaNombre}` : "Registrar Progreso"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Sincronizando rutina...</p>
                    </div>
                ) : ejerciciosPendientes.length === 0 && ejercicios.length > 0 ? (
                    /* EMPTY STATE: Todo completado */
                    <div className="empty-state">
                        <FaCheckCircle className="empty-icon" />
                        <h3>¡Rutina completada por hoy!</h3>
                        <p>No quedan ejercicios pendientes en esta rutina.</p>
                        <button className="btn-cancel mt-3" onClick={onHide}>Cerrar</button>
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>

                        {/* SECCIÓN 1: SELECCIÓN */}
                        <div className="select-container">
                            <label className="form-label-pro">Selecciona el Ejercicio Pendiente</label>
                            <Form.Select
                                className="custom-select"
                                value={selectedEjercicio}
                                onChange={(e) => setSelectedEjercicio(e.target.value)}
                            >
                                <option value="">-- Elige un ejercicio --</option>
                                {ejerciciosPendientes.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.nombre} ({e.grupo_muscular})
                                    </option>
                                ))}
                            </Form.Select>
                        </div>

                        {/* INFO CARD DINÁMICA */}
                        {ejercicioInfo && (
                            <div className="info-card">
                                <h6>📝 Descripción</h6>
                                <p>{ejercicioInfo.descripcion || "Sin descripción disponible."}</p>
                                {ejercicioInfo.instrucciones && (
                                    <p className="mt-2"><strong>Tip:</strong> {ejercicioInfo.instrucciones}</p>
                                )}
                            </div>
                        )}

                        {/* SECCIÓN 2: DATOS DEL ENTRENAMIENTO */}
                        <div className="inputs-grid">

                            {/* Series */}
                            <div>
                                <label className="form-label-pro">Series Hechas</label>
                                <div className="input-group-pro">
                                    <FaRedo className="input-icon" />
                                    <Form.Control
                                        type="number"
                                        className="form-control-pro"
                                        placeholder="Ej: 4"
                                        value={form.series_completadas}
                                        onChange={(e) => setForm({ ...form, series_completadas: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Repeticiones */}
                            <div>
                                <label className="form-label-pro">Repeticiones</label>
                                <div className="input-group-pro">
                                    <FaDumbbell className="input-icon" />
                                    <Form.Control
                                        type="text"
                                        className="form-control-pro"
                                        placeholder="Ej: 12, 10, 8, 8"
                                        value={form.repeticiones_realizadas}
                                        onChange={(e) => setForm({ ...form, repeticiones_realizadas: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Peso */}
                            <div>
                                <label className="form-label-pro">Peso (kg)</label>
                                <div className="input-group-pro">
                                    <FaWeightHanging className="input-icon" />
                                    <Form.Control
                                        type="number"
                                        className="form-control-pro"
                                        placeholder="Ej: 40"
                                        value={form.peso_utilizado}
                                        onChange={(e) => setForm({ ...form, peso_utilizado: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dificultad */}
                            <div>
                                <label className="form-label-pro">Esfuerzo (RPE 1-10)</label>
                                <div className="input-group-pro">
                                    <FaTachometerAlt className="input-icon" />
                                    <Form.Control
                                        type="number"
                                        min="1" max="10"
                                        className="form-control-pro"
                                        placeholder="1 al 10"
                                        value={form.dificultad_percibida}
                                        onChange={(e) => setForm({ ...form, dificultad_percibida: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Notas (Full width) */}
                            <div className="full-width">
                                <label className="form-label-pro">Notas Adicionales</label>
                                <div className="input-group-pro">
                                    <FaStickyNote className="input-icon" style={{top: '20px'}} />
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        className="form-control-pro"
                                        style={{paddingLeft: '2.5rem'}}
                                        placeholder="¿Cómo te sentiste?"
                                        value={form.notas}
                                        onChange={(e) => setForm({ ...form, notas: e.target.value })}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="modal-footer-custom">
                            <button type="button" className="btn-cancel" onClick={onHide}>
                                Cancelar
                            </button>
                            <button type="submit" className="btn-submit">
                                Guardar Progreso
                            </button>
                        </div>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default RegistrarProgresoModal;