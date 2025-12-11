import { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Alert, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaSearch, FaPlus, FaCalendarAlt, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Components
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AlumnoCard from "../components/AlumnoCard";
import AddAlumnoModal from "../components/AddAlumnoModal";
import EditAlumnoModal from "../components/EditAlumnoModal";
import AlumnoPerfilModal from "../components/AlumnoPerfilModal";
import AssignRutinaModal from "../components/AssignRutinaModal";
import DeleteConfirmationModal from "../components/EliminarAlumnoModal";


// API
import { getAlumnos, toggleAlumnoStatus } from "../api/alumnos";

// Styles

import "../styles/alumnos.css";

const AlumnosPage = () => {
    // State for alumnos data
    const [alumnos, setAlumnos] = useState([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // State for search and filters
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");

    // State for modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAssignRutinaModal, setShowAssignRutinaModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);

    // State for sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // State for notifications
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Load alumnos on component mount
    useEffect(() => {
        loadAlumnos();
    }, []);

    // Filter alumnos when search or filter changes
    useEffect(() => {
        filterAlumnos();
    }, [alumnos, search, filter]);

    const loadAlumnos = async (showRefresh = false) => {
        try {
            if (showRefresh) setRefreshing(true);
            else setLoading(true);
            setError("");

            const data = await getAlumnos();
            setAlumnos(data.map(normalizarAlumno));
        } catch (err) {
            console.error("Error loading alumnos:", err);
            setError(err.response?.data?.error || "Error al cargar alumnos");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterAlumnos = () => {
        let filtered = alumnos.filter((alumno) => {
            const matchesSearch = `${alumno.nombre} ${alumno.apellido} ${alumno.email}`
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesFilter = filter === "Todos" || alumno.disciplina === filter;


            return matchesSearch && matchesFilter;
        });

        setFilteredAlumnos(filtered);
    };

    const showToast = (message, variant = "success") => {
        setToast({ show: true, message, variant });
    };

    const hideToast = () => {
        setToast({ show: false, message: "", variant: "success" });
    };

    // Get unique disciplinas for filters
    const disciplinas = [...new Set(
        alumnos
            .map((a) => a.Usuario?.Disciplina?.nombre || a.disciplina)
            .filter(Boolean)
    )];

    // Modal handlers
    const handleAddAlumno = () => {
        setSelectedAlumno(null);
        setShowAddModal(true);
    };

    const handleEditAlumno = (alumno) => {
        setSelectedAlumno(alumno);
        setShowEditModal(true);
    };

    const handleViewProfile = (alumno) => {
        setSelectedAlumno(alumno);
        setShowProfileModal(true);
    };

    const handleAssignRutina = (alumno) => {
        setSelectedAlumno(alumno);
        setShowAssignRutinaModal(true);
    };

    const handleDeleteAlumno = (alumno) => {
        setSelectedAlumno(alumno);
        setShowDeleteModal(true);
    };

    const handleToggleStatus = async (alumno) => {
        try {
            await toggleAlumnoStatus(alumno.usuario_id || alumno.id);
            showToast(
                `Estado del alumno ${alumno.activo ? 'desactivado' : 'activado'} exitosamente`,
                "success"
            );
            loadAlumnos(true);
        } catch (err) {
            console.error("Error toggling status:", err);
            showToast("Error al cambiar estado del alumno", "danger");
        }
    };

    const handleChat = (alumno) => {
        // Navigate to chat or implement chat functionality
        navigate(`/chat/${alumno.usuario_id || alumno.id}`);
    };

    // Event handlers for successful operations
    const handleAlumnoAdded = (credenciales) => {
        setShowAddModal(false);
        loadAlumnos(true);

        if (credenciales) {
            const { email, password } = credenciales;
            alert(
                `✅ Alumno agregado exitosamente.\n\nCredenciales de acceso:\n📧 Email: ${email}\n🔑 Contraseña: ${password}\n\n⚠️ Guárdalas, se mostrarán solo una vez.`
            );
        } else {
            showToast("Alumno agregado exitosamente");
        }
    };


    const handleAlumnoUpdated = () => {
        setShowEditModal(false);
        showToast("Alumno actualizado exitosamente");
        loadAlumnos(true);
    };

    const handleRutinaAssigned = () => {
        setShowAssignRutinaModal(false);
        showToast("Rutina asignada exitosamente");
        loadAlumnos(true);
    };

    const handleAlumnoDeleted = () => {
        setShowDeleteModal(false);
        showToast("Alumno eliminado exitosamente");
        loadAlumnos(true);
    };

    const normalizarAlumno = (a) => {
        const u = a.Usuario || {};

        return {
            usuario_id: a.usuario_id,
            id: a.usuario_id, // por compatibilidad

            // Datos del usuario
            nombre: u.nombre,
            apellido: u.apellido,
            email: u.email,
            telefono: u.telefono,
            genero: u.genero,
            fecha_nacimiento: u.fecha_nacimiento,
            activo: u.activo,
            last_login: u.last_login || null,

            // Disciplina
            disciplina: u.Disciplina?.nombre || "Sin disciplina",

            // Foto
            foto: u.foto
                ? `data:image/jpeg;base64,${Buffer.from(u.foto).toString("base64")}`
                : null,

            // Datos de alumno
            peso: a.peso,
            altura: a.altura,
            objetivo: a.objetivo,
            nivel_experiencia: a.nivel_experiencia,
            progreso: a.progreso || 0,

            // Extras
            ultimo_acceso: u.fecha_registro,
            rutina_asignada: a.AsignacionRutinas?.find(r => r.estado === "activa")?.Rutina?.nombre || "Sin asignar",

            // Esto permite compatibilidad con tus handlers
            Usuario: u
        };
    };


    if (loading) {
        return (
            <div className="layout">
                <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    collapsed={sidebarCollapsed}
                    setCollapsed={setSidebarCollapsed}
                />
                <main className="content">
                    <Header user={JSON.parse(localStorage.getItem("user") || "{}")} />
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                        <div className="text-center">
                            <Spinner animation="border" size="lg" className="mb-3" />
                            <div>Cargando alumnos...</div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="layout">
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user") || "{}")} />

                <Container fluid className="px-4">
                    {/* Header Section */}
                    <Row className="mb-4">
                        <Col>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <h1 className="text-primary fw-bold mb-1">Alumnos</h1>
                                    <p className="text-muted mb-0">
                                        <FaCalendarAlt className="me-2" />
                                        {new Date().toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </p>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => loadAlumnos(true)}
                                        disabled={refreshing}
                                        className="d-flex align-items-center gap-2"
                                    >
                                        <FaSync className={refreshing ? "fa-spin" : ""} />
                                        {refreshing ? "Actualizando..." : "Actualizar"}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="d-flex align-items-center gap-2"
                                        onClick={handleAddAlumno}
                                    >
                                        <FaPlus /> Agregar Alumno
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Error Alert */}
                    {error && (
                        <Row className="mb-3">
                            <Col>
                                <Alert variant="danger" dismissible onClose={() => setError("")}>
                                    {error}
                                </Alert>
                            </Col>
                        </Row>
                    )}

                    {/* Search and Filter Section */}
                    <Row className="mb-4">
                        <Col lg={6}>
                            <InputGroup size="lg">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar alumno por nombre, apellido o email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-end-0"
                                />
                                <InputGroup.Text className="bg-white border-start-0">
                                    <FaSearch className="text-muted" />
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <Col lg={6}>
                            <div className="d-flex gap-2 flex-wrap">
                                <Button
                                    variant={filter === "Todos" ? "primary" : "outline-primary"}
                                    onClick={() => setFilter("Todos")}
                                    size="sm"
                                >
                                    Todos ({alumnos.length})
                                </Button>
                                {disciplinas.map((disciplina) => {
                                    const count = alumnos.filter(a =>
                                        (a.Usuario?.Disciplina?.nombre || a.disciplina) === disciplina
                                    ).length;
                                    return (
                                        <Button
                                            key={disciplina}
                                            variant={filter === disciplina ? "primary" : "outline-primary"}
                                            onClick={() => setFilter(disciplina)}
                                            size="sm"
                                        >
                                            {disciplina} ({count})
                                        </Button>
                                    );
                                })}
                            </div>
                        </Col>
                    </Row>

                    {/* Results Summary */}
                    <Row className="mb-3">
                        <Col>
                            <small className="text-muted">
                                Mostrando {filteredAlumnos.length} de {alumnos.length} alumnos
                                {search && ` | Búsqueda: "${search}"`}
                                {filter !== "Todos" && ` | Filtro: ${filter}`}
                            </small>
                        </Col>
                    </Row>

                    {/* Alumnos Grid */}
                    <Row>
                        {filteredAlumnos.map((alumno) => (
                            <Col key={alumno.usuario_id || alumno.id} xl={3} lg={4} md={6} sm={12} className="mb-4">
                                <AlumnoCard
                                    alumno={alumno}
                                    onEdit={handleEditAlumno}
                                    onDelete={handleDeleteAlumno}
                                    onViewProfile={handleViewProfile}
                                    onAssignRoutine={handleAssignRutina}
                                    onChat={handleChat}
                                    onToggleStatus={handleToggleStatus}
                                />
                            </Col>
                        ))}
                    </Row>

                    {/* Empty State */}
                    {filteredAlumnos.length === 0 && !loading && (
                        <Row>
                            <Col className="text-center py-5">
                                <div className="empty-state">
                                    <div className="empty-icon mb-3">👤</div>
                                    <h4 className="text-muted">
                                        {search || filter !== "Todos"
                                            ? "No se encontraron alumnos"
                                            : "No tienes alumnos registrados"
                                        }
                                    </h4>
                                    <p className="text-muted">
                                        {search || filter !== "Todos"
                                            ? "Intenta ajustar los filtros de búsqueda"
                                            : "Comienza agregando tu primer alumno"
                                        }
                                    </p>
                                    {!search && filter === "Todos" && (
                                        <Button
                                            variant="primary"
                                            onClick={handleAddAlumno}
                                            className="mt-2"
                                        >
                                            <FaPlus className="me-2" />
                                            Agregar Primer Alumno
                                        </Button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    )}
                </Container>

                {/* Modals */}
                <AddAlumnoModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onAlumnoAdded={handleAlumnoAdded}
                />

                <EditAlumnoModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    alumno={selectedAlumno}
                    onAlumnoUpdated={handleAlumnoUpdated}
                />

                <AlumnoPerfilModal
                    show={showProfileModal}
                    onHide={() => setShowProfileModal(false)}
                    alumnoId={selectedAlumno?.usuario_id || selectedAlumno?.id}
                />

                <AssignRutinaModal
                    show={showAssignRutinaModal}
                    onHide={() => setShowAssignRutinaModal(false)}
                    alumno={selectedAlumno}
                    onRutinaAssigned={handleRutinaAssigned}
                />

                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    alumno={selectedAlumno}
                    onAlumnoDeleted={handleAlumnoDeleted}
                />

                {/* Toast Notifications */}
                <ToastContainer position="top-end" className="p-3">
                    <Toast
                        show={toast.show}
                        onClose={hideToast}
                        delay={4000}
                        autohide
                        bg={toast.variant}
                    >
                        <Toast.Header>
                            <strong className="me-auto">
                                {toast.variant === "success" ? "Éxito" : "Error"}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className="text-white">
                            {toast.message}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </main>
        </div>
    );
};

export default AlumnosPage;