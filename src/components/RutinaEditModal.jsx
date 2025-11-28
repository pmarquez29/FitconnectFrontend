import { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    Row,
    Col,
    Spinner,
    Alert,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import AddEjercicioModal from "./AddEjercicioModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RutinaEditModal = ({ show, onHide, rutina, onSave }) => {
    const [form, setForm] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [ejerciciosDisponibles, setEjerciciosDisponibles] = useState([]);
    const [showAddEjercicio, setShowAddEjercicio] = useState(false);


    // 🔹 Cargar datos de la rutina
    useEffect(() => {
        if (rutina) {
            setForm({
                ...rutina,
                ejercicios:
                    rutina.ejercicios?.map((e, i) => ({
                        id: e.id, // id del registro rutina_ejercicio (no obligatorio)
                        ejercicio_id: e.ejercicio_id || e.id, // <-- aseguramos tener el id del ejercicio
                        nombre: e.nombre,
                        grupo_muscular: e.grupo_muscular,
                        series: e.series || 3,
                        repeticiones: e.repeticiones || "10",
                        peso: e.peso || 0,
                        tiempo_descanso: e.tiempo_descanso || 60,
                        orden: e.orden || i + 1,
                        notas: e.notas || "",
                    })) || [],
            });

        }
    }, [rutina]);

    // 🔹 Obtener todos los ejercicios disponibles
    const fetchEjercicios = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get(`${API_URL}/ejercicios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEjerciciosDisponibles(data);
        } catch (err) {
            console.error("Error obteniendo ejercicios:", err);
        }
    };

    useEffect(() => {
        fetchEjercicios();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEjercicioChange = (index, field, value) => {
        setForm((prev) => {
            const ejercicios = [...prev.ejercicios];
            ejercicios[index][field] = value;

            // ✅ Si cambió el ejercicio_id, actualizamos el nombre visible
            if (field === "ejercicio_id") {
                const encontrado = ejerciciosDisponibles.find(
                    (ex) => ex.id === parseInt(value)
                );
                if (encontrado) {
                    ejercicios[index].nombre = encontrado.nombre;
                    ejercicios[index].grupo_muscular = encontrado.grupo_muscular;
                }
            }

            return { ...prev, ejercicios };
        });
    };

    const addEjercicio = () => {
        setForm((prev) => ({
            ...prev,
            ejercicios: [
                ...prev.ejercicios,
                {
                    ejercicio_id: "",
                    nombre: "",
                    grupo_muscular: "",
                    series: 3,
                    repeticiones: "10",
                    peso: 0,
                    tiempo_descanso: 60,
                    orden: prev.ejercicios.length + 1,
                    notas: "",
                },
            ],
        }));
    };

    const removeEjercicio = (index) => {
        setForm((prev) => {
            const ejercicios = prev.ejercicios.filter((_, i) => i !== index);
            return { ...prev, ejercicios };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setGuardando(true);
            setError("");
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/rutinas/${form.id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onSave?.();
            onHide();
        } catch (err) {
            console.error("Error guardando rutina:", err);
            setError("No se pudo guardar la rutina.");
        } finally {
            setGuardando(false);
        }
    };

    if (!form) return null;

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Rutina</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}

                        {/* 🔹 Datos generales */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nombre de la Rutina</Form.Label>
                                    <Form.Control
                                        name="nombre"
                                        value={form.nombre || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Nivel</Form.Label>
                                    <Form.Control
                                        name="nivel"
                                        value={form.nivel || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcion"
                                rows={2}
                                value={form.descripcion || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Objetivo</Form.Label>
                                    <Form.Control
                                        name="objetivo"
                                        value={form.objetivo || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Duración estimada (min)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="duracion_estimada"
                                        value={form.duracion_estimada || ""}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <hr />
                        {/* 🔹 Ejercicios */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0">Ejercicios de la Rutina</h6>
                            <div>
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={addEjercicio}
                                >
                                    <FaPlus className="me-1" /> Agregar existente
                                </Button>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => setShowAddEjercicio(true)}
                                >
                                    <FaPlus className="me-1" /> Crear nuevo
                                </Button>
                            </div>
                        </div>

                        {form.ejercicios.map((ej, idx) => (
                            <div key={idx} className="border rounded p-3 mb-3 bg-light">
                                <Row className="align-items-center gy-2">
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Ejercicio</Form.Label>
                                            <Form.Select
                                                value={ej.ejercicio_id ? ej.ejercicio_id : ""}
                                                onChange={(e) =>
                                                    handleEjercicioChange(
                                                        idx,
                                                        "ejercicio_id",
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            >
                                                <option value="">Seleccione ejercicio</option>
                                                {ejerciciosDisponibles.map((ex) => (
                                                    <option key={ex.id} value={ex.id}>
                                                        {ex.nombre} ({ex.grupo_muscular})
                                                    </option>
                                                ))}
                                            </Form.Select>

                                        </Form.Group>
                                    </Col>

                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Series</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={ej.series || ""}
                                                onChange={(e) =>
                                                    handleEjercicioChange(idx, "series", e.target.value)
                                                }
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Reps</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={ej.repeticiones || ""}
                                                onChange={(e) =>
                                                    handleEjercicioChange(
                                                        idx,
                                                        "repeticiones",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={2}>
                                        <Form.Group>
                                            <Form.Label>Descanso (s)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={ej.tiempo_descanso || ""}
                                                onChange={(e) =>
                                                    handleEjercicioChange(
                                                        idx,
                                                        "tiempo_descanso",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={2} className="text-end align-self-center">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeEjercicio(idx)}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </Col>
                                </Row>

                                {ej.nombre && (
                                    <small className="text-muted">
                                        Seleccionado: {ej.nombre} — {ej.grupo_muscular}
                                    </small>
                                )}
                            </div>
                        ))}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={onHide}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={guardando}>
                            {guardando ? (
                                <>
                                    <Spinner size="sm" className="me-2" /> Guardando...
                                </>
                            ) : (
                                "Guardar Cambios"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* 🔹 Submodal para crear ejercicios */}
            <AddEjercicioModal
                show={showAddEjercicio}
                onHide={() => setShowAddEjercicio(false)}
                onCreated={() => {
                    setShowAddEjercicio(false);
                    // recargar lista de ejercicios disponibles
                    const fetchEjercicios = async () => {
                        const token = localStorage.getItem("token");
                        const { data } = await axios.get(`${API_URL}/ejercicios`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setEjerciciosDisponibles(data);
                    };
                    fetchEjercicios();
                }}
                rutinaId={form?.id}
            />

        </>
    );
};

export default RutinaEditModal;
