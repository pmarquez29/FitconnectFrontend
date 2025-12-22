import { useEffect, useState } from "react";
import { Container, Row, Col, Form, InputGroup, Button, Alert, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { FaSearch, FaPlus, FaCalendarAlt, FaSync, FaUsers } from "react-icons/fa"; // Added FaUsers icon
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
    // ... (Todo el estado y lógica se mantiene IDÉNTICO, solo cambia el return visual) ...
    const [alumnos, setAlumnos] = useState([]);
    const [filteredAlumnos, setFilteredAlumnos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showAssignRutinaModal, setShowAssignRutinaModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAlumno, setSelectedAlumno] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", variant: "success" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => { loadAlumnos(); }, []);
    useEffect(() => { filterAlumnos(); }, [alumnos, search, filter]);

    const loadAlumnos = async (showRefresh = false) => {
        try {
            if (showRefresh) setRefreshing(true); else setLoading(true);
            setError("");
            const data = await getAlumnos();
            setAlumnos(data.map(normalizarAlumno));
        } catch (err) {
            console.error("Error:", err);
            setError(err.response?.data?.error || "Error al cargar alumnos");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ... (El resto de funciones auxiliares como filterAlumnos, handles, etc. siguen igual)
    const filterAlumnos = () => {
        let filtered = alumnos.filter((alumno) => {
            const matchesSearch = `${alumno.nombre} ${alumno.apellido} ${alumno.email}`
                .toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === "Todos" || alumno.disciplina === filter;
            return matchesSearch && matchesFilter;
        });
        setFilteredAlumnos(filtered);
    };

    const showToast = (message, variant = "success") => setToast({ show: true, message, variant });
    const hideToast = () => setToast({ show: false, message: "", variant: "success" });

    // Handlers (Mantenidos igual)
    const handleAddAlumno = () => { setSelectedAlumno(null); setShowAddModal(true); };
    const handleEditAlumno = (a) => { setSelectedAlumno(a); setShowEditModal(true); };
    const handleViewProfile = (a) => { setSelectedAlumno(a); setShowProfileModal(true); };
    const handleAssignRutina = (a) => { setSelectedAlumno(a); setShowAssignRutinaModal(true); };
    const handleDeleteAlumno = (a) => { setSelectedAlumno(a); setShowDeleteModal(true); };
    const handleChat = (a) => navigate(`/chat/${a.usuario_id || a.id}`);

    const handleToggleStatus = async (alumno) => {
        try {
            await toggleAlumnoStatus(alumno.usuario_id || alumno.id);
            showToast(`Estado cambiado exitosamente`, "success");
            loadAlumnos(true);
        } catch (err) {
            showToast("Error al cambiar estado", "danger");
        }
    };

    const handleAlumnoAdded = (credenciales) => {
        setShowAddModal(false); loadAlumnos(true);
        if (credenciales) alert(`✅ Credenciales:\nEmail: ${credenciales.email}\nPass: ${credenciales.password}`);
        else showToast("Alumno agregado");
    };
    const handleAlumnoUpdated = () => { setShowEditModal(false); showToast("Actualizado"); loadAlumnos(true); };
    const handleRutinaAssigned = () => { setShowAssignRutinaModal(false); showToast("Rutina asignada"); loadAlumnos(true); };
    const handleAlumnoDeleted = () => { setShowDeleteModal(false); showToast("Eliminado"); loadAlumnos(true); };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        // Sequelize devuelve bytea como { type: 'Buffer', data: [...] }
        // Si viene directo como array, usa buffer, si viene como objeto, usa buffer.data
        const bytes = buffer.data ? new Uint8Array(buffer.data) : new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const normalizarAlumno = (a) => {
        const u = a.Usuario || {};

        // Lógica corregida para procesar la imagen Bytea a Base64
        let avatarSource = null;

        if (u.foto) {
            try {
                if (typeof u.foto === 'string') {
                    // Si por alguna razón el backend ya lo manda como string
                    avatarSource = u.foto;
                } else {
                    // Si es un objeto Buffer (array de bytes), lo convertimos
                    avatarSource = `data:image/jpeg;base64,${arrayBufferToBase64(u.foto)}`;
                }
            } catch (error) {
                console.error("Error al procesar la foto:", error);
            }
        }

        return {
            usuario_id: a.usuario_id,
            id: a.usuario_id,
            nombre: u.nombre,
            apellido: u.apellido,
            email: u.email,
            telefono: u.telefono,
            genero: u.genero,
            fecha_nacimiento: u.fecha_nacimiento,
            activo: u.activo,
            last_login: u.last_login || null,
            disciplina: u.Disciplina?.nombre || "Sin disciplina",

            // Aquí asignamos la foto ya procesada
            foto: avatarSource,

            peso: a.peso,
            altura: a.altura,
            objetivo: a.objetivo,
            nivel_experiencia: a.nivel_experiencia,
            progreso: a.progreso || 0,
            ultimo_acceso: u.fecha_registro,
            rutina_asignada: a.AsignacionRutinas?.find(r => r.estado === "activa")?.Rutina?.nombre || "Sin asignar",
            Usuario: u
        };
    };

    const disciplinas = [...new Set(alumnos.map((a) => a.Usuario?.Disciplina?.nombre || a.disciplina).filter(Boolean))];

    if (loading) {
        return (
            <div className="layout">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
                <main className="content">
                    <Header user={JSON.parse(localStorage.getItem("user") || "{}")} />
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="layout">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <main className="content bg-light"> {/* Fondo gris claro para resaltar tarjetas */}
                <Header user={JSON.parse(localStorage.getItem("user") || "{}")} />

                <Container fluid className="px-4 py-4">
                    {/* Header Mejorado */}
                    <div className="d-flex justify-content-between align-items-center mb-5">
                        <div>
                            <h1 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <FaUsers className="text-primary" /> Gestión de Alumnos
                            </h1>
                            <p className="text-muted mb-0">Administra el progreso y rutinas de tus estudiantes</p>
                        </div>
                        <Button
                            variant="primary"
                            size="lg"
                            className="shadow-sm d-flex align-items-center gap-2 px-4 rounded-pill"
                            onClick={handleAddAlumno}
                        >
                            <FaPlus /> Nuevo Alumno
                        </Button>
                    </div>

                    {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

                    {/* Filtros Modernos */}
                    <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border">
                        <Row className="g-3 align-items-center">
                            <Col lg={5}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white border-end-0 ps-3">
                                        <FaSearch className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Buscar por nombre..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="border-start-0 ps-2 shadow-none"
                                        style={{height: '50px'}}
                                    />
                                </InputGroup>
                            </Col>
                            <Col lg={7}>
                                <div className="d-flex gap-2 overflow-auto pb-1" style={{scrollbarWidth: 'none'}}>
                                    <Button
                                        variant={filter === "Todos" ? "dark" : "light"}
                                        onClick={() => setFilter("Todos")}
                                        className="rounded-pill px-3 fw-bold border"
                                    >
                                        Todos ({alumnos.length})
                                    </Button>
                                    {disciplinas.map((d) => (
                                        <Button
                                            key={d}
                                            variant={filter === d ? "primary" : "light"}
                                            onClick={() => setFilter(d)}
                                            className="rounded-pill px-3 fw-bold border text-nowrap"
                                        >
                                            {d}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="link"
                                        onClick={() => loadAlumnos(true)}
                                        className="ms-auto text-decoration-none text-muted"
                                        disabled={refreshing}
                                    >
                                        <FaSync className={refreshing ? "fa-spin" : ""} />
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Grid */}
                    <Row className="g-4">
                        {filteredAlumnos.map((alumno) => (
                            <Col key={alumno.usuario_id || alumno.id} xl={3} lg={4} md={6} sm={12}>
                                <AlumnoCard
                                    alumno={alumno}
                                    onEdit={handleEditAlumno}
                                    onDelete={handleDeleteAlumno}
                                    onViewProfile={handleViewProfile}
                                    onAssignRoutine={handleAssignRutina}
                                    onChat={handleChat}
                                />
                            </Col>
                        ))}
                    </Row>

                    {filteredAlumnos.length === 0 && (
                        <div className="text-center py-5">
                            <div className="mb-3 text-muted" style={{fontSize: '3rem'}}>🔍</div>
                            <h4 className="text-muted fw-bold">No se encontraron resultados</h4>
                            <p className="text-muted">Prueba con otros términos de búsqueda</p>
                        </div>
                    )}
                </Container>

                {/* Modals & Toasts (Igual que antes) */}
                <AddAlumnoModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAlumnoAdded={handleAlumnoAdded} />
                <EditAlumnoModal show={showEditModal} onHide={() => setShowEditModal(false)} alumno={selectedAlumno} onAlumnoUpdated={handleAlumnoUpdated} />
                <AlumnoPerfilModal show={showProfileModal} onHide={() => setShowProfileModal(false)} alumnoId={selectedAlumno?.usuario_id || selectedAlumno?.id} />
                <AssignRutinaModal show={showAssignRutinaModal} onHide={() => setShowAssignRutinaModal(false)} alumno={selectedAlumno} onRutinaAssigned={handleRutinaAssigned} />
                <DeleteConfirmationModal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} alumno={selectedAlumno} onAlumnoDeleted={handleAlumnoDeleted} />
                <ToastContainer position="bottom-end" className="p-4">
                    <Toast show={toast.show} onClose={hideToast} delay={4000} autohide bg={toast.variant}>
                        <Toast.Body className="text-white fw-bold">{toast.message}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </main>
        </div>
    );
};

export default AlumnosPage;