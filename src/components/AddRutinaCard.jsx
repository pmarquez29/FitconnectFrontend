import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    Modal,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Card,
    Divider,
    Chip,
    Alert,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 700,
    maxHeight: "90vh",
    bgcolor: "#ffffff",
    borderRadius: 3,
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
};

const NIVELES = ["principiante", "intermedio", "avanzado"];
const PASOS = ["Información básica", "Ejercicios", "Revisar"];

export default function AddRutinaCard({ onRutinaCreada }) {
    const [open, setOpen] = useState(false);
    const [paso, setPaso] = useState(0);
    const [vistaEjercicio, setVistaEjercicio] = useState("seleccionar"); // 'seleccionar' o 'crear'

    const [disciplinas, setDisciplinas] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [selectedEjercicios, setSelectedEjercicios] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [rutina, setRutina] = useState({
        nombre: "",
        descripcion: "",
        objetivo: "",
        nivel: "intermedio",
        duracion: "",
        frecuencia_semanal: "3 veces por semana",
        disciplina_id: "",
    });

    const [nuevoEjercicio, setNuevoEjercicio] = useState({
        nombre: "",
        grupo_muscular: "",
        equipo_necesario: "",
        instrucciones: "",
        descripcion: "",
    });

    const token = localStorage.getItem("token");
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchDisciplinas();
    }, []);

    const fetchDisciplinas = async () => {
        try {
            const res = await axios.get(`${API_URL}/disciplinas`, authHeader);
            setDisciplinas(res.data);
        } catch (err) {
            console.error("Error al obtener disciplinas:", err);
            setError("No se pudieron cargar las disciplinas");
        }
    };

    const fetchEjercicios = async (disciplinaId) => {
        try {
            const res = await axios.get(
                `${API_URL}/ejercicios/disciplina/${disciplinaId}`,
                authHeader
            );
            setEjercicios(res.data);
        } catch (err) {
            console.error("Error al obtener ejercicios:", err);
            setError("No se pudieron cargar los ejercicios");
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setPaso(0);
        setError("");
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setPaso(0);
        setVistaEjercicio("seleccionar");
        setRutina({
            nombre: "",
            descripcion: "",
            objetivo: "",
            nivel: "intermedio",
            duracion: "",
            frecuencia_semanal: "3 veces por semana",
            disciplina_id: ""
        });
        setSelectedEjercicios([]);
        setNuevoEjercicio({
            nombre: "",
            grupo_muscular: "",
            equipo_necesario: "",
            instrucciones: "",
            descripcion: "",
        });
        setError("");
    };

    const handleSiguiente = () => {
        setError("");

        if (paso === 0) {
            // Validar paso 1
            if (!rutina.nombre.trim()) {
                setError("El nombre de la rutina es obligatorio");
                return;
            }
            if (!rutina.objetivo.trim()) {
                setError("El objetivo es obligatorio");
                return;
            }
            if (!rutina.nivel) {
                setError("Debes seleccionar un nivel");
                return;
            }
            if (!rutina.disciplina_id) {
                setError("Debes seleccionar una disciplina");
                return;
            }
            // Cargar ejercicios de la disciplina seleccionada
            fetchEjercicios(rutina.disciplina_id);
        } else if (paso === 1) {
            // Validar paso 2
            if (selectedEjercicios.length === 0) {
                setError("Debes agregar al menos un ejercicio a la rutina");
                return;
            }
        }

        setPaso(paso + 1);
    };

    const handleAtras = () => {
        setError("");
        if (vistaEjercicio === "crear") {
            setVistaEjercicio("seleccionar");
        } else {
            setPaso(paso - 1);
        }
    };

    const handleAddEjercicio = (e) => {
        const id = e.target.value;
        const ejercicio = ejercicios.find((ej) => ej.id === id);
        if (ejercicio && !selectedEjercicios.find((ej) => ej.id === id)) {
            setSelectedEjercicios([...selectedEjercicios, ejercicio]);
        }
    };

    const handleRemoveEjercicio = (id) => {
        setSelectedEjercicios(selectedEjercicios.filter((e) => e.id !== id));
    };

    const handleGuardarNuevoEjercicio = async () => {
        if (!nuevoEjercicio.nombre.trim()) {
            setError("El nombre del ejercicio es obligatorio");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const body = {
                nombre: nuevoEjercicio.nombre.trim(),
                grupo_muscular: nuevoEjercicio.grupo_muscular.trim(),
                equipo_necesario: nuevoEjercicio.equipo_necesario.trim(),
                instrucciones: nuevoEjercicio.instrucciones.trim(),
                descripcion: nuevoEjercicio.descripcion.trim(),
                disciplina_id: parseInt(rutina.disciplina_id),
            };

            console.log("📤 Enviando nuevo ejercicio:", body);

            const res = await axios.post(`${API_URL}/ejercicios`, body, authHeader);

            console.log("✅ Ejercicio creado:", res.data);

            // Agregar el nuevo ejercicio a la lista de seleccionados
            const ejercicioCreado = {
                id: res.data.id,
                nombre: res.data.nombre,
                grupo_muscular: res.data.grupo_muscular,
                equipo_necesario: res.data.equipo_necesario,
                instrucciones: res.data.instrucciones,
            };

            setSelectedEjercicios([...selectedEjercicios, ejercicioCreado]);

            // Recargar la lista de ejercicios
            await fetchEjercicios(rutina.disciplina_id);

            // Volver a la vista de selección
            setVistaEjercicio("seleccionar");
            setNuevoEjercicio({
                nombre: "",
                grupo_muscular: "",
                equipo_necesario: "",
                instrucciones: "",
                descripcion: "",
            });
        } catch (err) {
            console.error("❌ Error al crear ejercicio:", err);
            const errorMsg = err.response?.data?.error ||
                err.response?.data?.message ||
                "Error al crear el ejercicio. Intenta nuevamente.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const nuevaRutina = {
                nombre: rutina.nombre.trim(),
                descripcion: rutina.descripcion.trim(),
                objetivo: rutina.objetivo.trim(),
                nivel: rutina.nivel,
                duracion: parseInt(rutina.duracion) || 0,
                frecuencia_semanal: rutina.frecuencia_semanal.trim(),
                disciplina_id: rutina.disciplina_id,
                ejercicios: selectedEjercicios.map((ej) => ej.id),
            };

            console.log("📤 Enviando rutina:", nuevaRutina);

            const response = await axios.post(
                `${API_URL}/rutinas`,
                nuevaRutina,
                authHeader
            );

            console.log("✅ Rutina creada:", response.data);

            if (onRutinaCreada) {
                onRutinaCreada();
            }

            handleClose();
        } catch (err) {
            console.error("❌ Error al crear rutina:", err);
            const errorMsg = err.response?.data?.error ||
                err.response?.data?.message ||
                "Error al crear la rutina. Intenta nuevamente.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const renderContenido = () => {
        // Paso 0: Información básica
        if (paso === 0) {
            return (
                <>
                    <TextField
                        label="Nombre de la rutina"
                        fullWidth
                        required
                        value={rutina.nombre}
                        onChange={(e) => setRutina({ ...rutina, nombre: e.target.value })}
                        placeholder="Ej: Rutina de fuerza para principiantes"
                    />

                    <TextField
                        label="Objetivo"
                        fullWidth
                        required
                        value={rutina.objetivo}
                        onChange={(e) => setRutina({ ...rutina, objetivo: e.target.value })}
                        placeholder="Ej: Ganar fuerza y masa muscular"
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Nivel</InputLabel>
                        <Select
                            value={rutina.nivel}
                            label="Nivel"
                            onChange={(e) => setRutina({ ...rutina, nivel: e.target.value })}
                        >
                            {NIVELES.map((nivel) => (
                                <MenuItem key={nivel} value={nivel}>
                                    {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                        <InputLabel>Disciplina</InputLabel>
                        <Select
                            value={rutina.disciplina_id}
                            label="Disciplina"
                            onChange={(e) => setRutina({ ...rutina, disciplina_id: e.target.value })}
                        >
                            {disciplinas.map((disc) => (
                                <MenuItem key={disc.id} value={disc.id}>
                                    {disc.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Frecuencia semanal"
                        fullWidth
                        value={rutina.frecuencia_semanal}
                        onChange={(e) => setRutina({ ...rutina, frecuencia_semanal: e.target.value })}
                        placeholder="Ej: 3 veces por semana"
                    />

                    <TextField
                        label="Duración estimada (minutos)"
                        type="number"
                        fullWidth
                        value={rutina.duracion}
                        onChange={(e) => setRutina({ ...rutina, duracion: e.target.value })}
                        placeholder="60"
                    />

                    <TextField
                        label="Descripción"
                        fullWidth
                        multiline
                        rows={3}
                        value={rutina.descripcion}
                        onChange={(e) => setRutina({ ...rutina, descripcion: e.target.value })}
                        placeholder="Descripción detallada de la rutina..."
                    />
                </>
            );
        }

        // Paso 1: Ejercicios
        if (paso === 1) {
            if (vistaEjercicio === "crear") {
                return (
                    <>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <IconButton onClick={handleAtras} size="small">
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h6">Crear nuevo ejercicio</Typography>
                        </Box>

                        <TextField
                            label="Nombre del ejercicio"
                            fullWidth
                            required
                            value={nuevoEjercicio.nombre}
                            onChange={(e) =>
                                setNuevoEjercicio({ ...nuevoEjercicio, nombre: e.target.value })
                            }
                            placeholder="Ej: Press de banca"
                        />

                        <TextField
                            label="Grupo muscular"
                            fullWidth
                            value={nuevoEjercicio.grupo_muscular}
                            onChange={(e) =>
                                setNuevoEjercicio({ ...nuevoEjercicio, grupo_muscular: e.target.value })
                            }
                            placeholder="Ej: Pecho"
                        />

                        <TextField
                            label="Equipo necesario"
                            fullWidth
                            value={nuevoEjercicio.equipo_necesario}
                            onChange={(e) =>
                                setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    equipo_necesario: e.target.value,
                                })
                            }
                            placeholder="Ej: Barra, discos"
                        />

                        <TextField
                            label="Descripción"
                            fullWidth
                            multiline
                            rows={2}
                            value={nuevoEjercicio.descripcion}
                            onChange={(e) =>
                                setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    descripcion: e.target.value,
                                })
                            }
                            placeholder="Breve descripción del ejercicio"
                        />

                        <TextField
                            label="Instrucciones"
                            fullWidth
                            multiline
                            rows={3}
                            value={nuevoEjercicio.instrucciones}
                            onChange={(e) =>
                                setNuevoEjercicio({
                                    ...nuevoEjercicio,
                                    instrucciones: e.target.value,
                                })
                            }
                            placeholder="Paso a paso de cómo realizar el ejercicio..."
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGuardarNuevoEjercicio}
                            disabled={loading || !nuevoEjercicio.nombre.trim()}
                            fullWidth
                        >
                            {loading ? "Guardando..." : "Guardar y agregar a la rutina"}
                        </Button>
                    </>
                );
            }

            return (
                <>
                    <FormControl fullWidth>
                        <InputLabel>Seleccionar ejercicio</InputLabel>
                        <Select label="Seleccionar ejercicio" onChange={handleAddEjercicio} value="">
                            {ejercicios.length === 0 ? (
                                <MenuItem disabled>No hay ejercicios disponibles</MenuItem>
                            ) : (
                                ejercicios
                                    .filter(ej => !selectedEjercicios.find(sel => sel.id === ej.id))
                                    .map((ej) => (
                                        <MenuItem key={ej.id} value={ej.id}>
                                            {ej.nombre} {ej.grupo_muscular && `— ${ej.grupo_muscular}`}
                                        </MenuItem>
                                    ))
                            )}
                        </Select>
                    </FormControl>

                    <Button
                        startIcon={<AddIcon />}
                        variant="outlined"
                        color="secondary"
                        onClick={() => setVistaEjercicio("crear")}
                        fullWidth
                    >
                        Crear nuevo ejercicio
                    </Button>

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Ejercicios agregados: ({selectedEjercicios.length})
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} minHeight="80px">
                            {selectedEjercicios.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    Aún no has agregado ejercicios
                                </Typography>
                            ) : (
                                selectedEjercicios.map((ej) => (
                                    <Chip
                                        key={ej.id}
                                        label={ej.nombre}
                                        color="primary"
                                        variant="outlined"
                                        onDelete={() => handleRemoveEjercicio(ej.id)}
                                    />
                                ))
                            )}
                        </Box>
                    </Box>
                </>
            );
        }

        // Paso 2: Revisar
        if (paso === 2) {
            const disciplinaSeleccionada = disciplinas.find(d => d.id === rutina.disciplina_id);

            return (
                <Box sx={{
                    bgcolor: "#f8f9fa",
                    p: 3,
                    borderRadius: 2,
                    maxHeight: "400px",
                    overflowY: "auto"
                }}>
                    <Typography variant="h6" gutterBottom color="primary">
                        <CheckCircleIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                        Resumen de la rutina
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Nombre</Typography>
                            <Typography variant="body1" fontWeight="bold">{rutina.nombre}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="caption" color="text.secondary">Objetivo</Typography>
                            <Typography variant="body1">{rutina.objetivo}</Typography>
                        </Box>

                        <Box display="flex" gap={2}>
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary">Nivel</Typography>
                                <Typography variant="body1" textTransform="capitalize">{rutina.nivel}</Typography>
                            </Box>
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary">Disciplina</Typography>
                                <Typography variant="body1">{disciplinaSeleccionada?.nombre}</Typography>
                            </Box>
                        </Box>

                        <Box display="flex" gap={2}>
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary">Duración</Typography>
                                <Typography variant="body1">{rutina.duracion || "No especificada"} min</Typography>
                            </Box>
                            <Box flex={1}>
                                <Typography variant="caption" color="text.secondary">Frecuencia</Typography>
                                <Typography variant="body1">{rutina.frecuencia_semanal}</Typography>
                            </Box>
                        </Box>

                        {rutina.descripcion && (
                            <Box>
                                <Typography variant="caption" color="text.secondary">Descripción</Typography>
                                <Typography variant="body2">{rutina.descripcion}</Typography>
                            </Box>
                        )}

                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Ejercicios ({selectedEjercicios.length})
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                                {selectedEjercicios.map((ej, idx) => (
                                    <Chip
                                        key={ej.id}
                                        label={`${idx + 1}. ${ej.nombre}`}
                                        color="primary"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            );
        }
    };

    return (
        <>
            <Card
                sx={{
                    minHeight: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    border: "2px dashed #90caf9",
                    color: "#1976d2",
                    background: "#f9fcff",
                    "&:hover": { background: "#e3f2fd", borderColor: "#1976d2" },
                    cursor: "pointer",
                    transition: "0.3s",
                }}
                onClick={handleOpen}
            >
                <AddCircleOutlineIcon sx={{ fontSize: 50, mb: 1 }} />
                <Typography variant="h6">Crear nueva rutina</Typography>
            </Card>

            <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                    {/* Header */}
                    <Box sx={{ p: 3, pb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h5" fontWeight="bold">
                                Crear nueva rutina
                            </Typography>
                            <IconButton onClick={handleClose}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {vistaEjercicio === "seleccionar" && (
                            <Stepper activeStep={paso} sx={{ mt: 2 }}>
                                {PASOS.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )}
                    </Box>

                    <Divider />

                    {/* Contenido */}
                    <Box sx={{ p: 3, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        {error && (
                            <Alert severity="error" onClose={() => setError("")}>
                                {error}
                            </Alert>
                        )}

                        {renderContenido()}
                    </Box>

                    {/* Footer */}
                    <Divider />
                    <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
                        {vistaEjercicio === "crear" ? (
                            <Button onClick={handleAtras} startIcon={<ArrowBackIcon />}>
                                Cancelar
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={paso === 0 ? handleClose : handleAtras}
                                    disabled={loading}
                                    startIcon={paso > 0 ? <ArrowBackIcon /> : null}
                                >
                                    {paso === 0 ? "Cancelar" : "Atrás"}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={paso === 2 ? handleSubmit : handleSiguiente}
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : paso === 2 ? "Crear rutina" : "Siguiente"}
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
}