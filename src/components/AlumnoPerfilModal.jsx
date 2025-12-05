import { useState, useEffect } from "react";
import { Modal, Row, Col, Card, Badge, Tab, Tabs, Alert, Spinner } from "react-bootstrap";
import { getAlumnoById, getAlumnoStats, getAlumnoProgreso } from "../api/alumnos";
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaWeight, FaRuler, FaChartLine, FaDumbbell, FaCalendarCheck } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const AlumnoPerfilModal = ({ show, onHide, alumnoId }) => {
    const [alumno, setAlumno] = useState(null);
    const [stats, setStats] = useState(null);
    const [progreso, setProgreso] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("info");

    useEffect(() => {
        if (show && alumnoId) {
            loadAlumnoData();
        }
    }, [show, alumnoId]);

    const loadAlumnoData = async () => {
        setLoading(true);
        setError("");

        try {
            const [alumnoData, statsData, progresoData] = await Promise.all([
                getAlumnoById(alumnoId).catch(err => {
                    console.error("Error loading alumno:", err);
                    return null;
                }),
                getAlumnoStats(alumnoId).catch(err => {
                    console.error("Error loading stats:", err);
                    return null;
                }),
                getAlumnoProgreso(alumnoId).catch(err => {
                    console.error("Error loading progreso:", err);
                    return [];
                })
            ]);

            setAlumno(alumnoData);
            setStats(statsData);
            setProgreso(progresoData);
        } catch (err) {
            console.error("Error loading alumno data:", err);
            setError("Error al cargar información del alumno");
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const InfoCard = ({ icon, title, value, subtitle }) => (
        <Card className="h-100 shadow-sm border-0">
            <Card.Body className="text-center p-3">
                <div className="text-primary mb-2">{icon}</div>
                <h6 className="text-muted mb-1 small">{title}</h6>
                <div className="fw-bold">{value}</div>
                {subtitle && <small className="text-muted">{subtitle}</small>}
            </Card.Body>
        </Card>
    );

    const renderInfoTab = () => (
        <Row className="g-3">
            <Col md={4}>
                <InfoCard
                    icon={<FaUser size={24} />}
                    title="Información Personal"
                    value={`${alumno?.Usuario?.nombre || alumno?.nombre || ''} ${alumno?.Usuario?.apellido || alumno?.apellido || ''}`}
                    subtitle={`${calculateAge(alumno?.Usuario?.fecha_nacimiento)} años`}
                />
            </Col>
            <Col md={4}>
                <InfoCard
                    icon={<FaEnvelope size={24} />}
                    title="Email"
                    value={alumno?.Usuario?.email || alumno?.email || 'N/A'}
                />
            </Col>
            <Col md={4}>
                <InfoCard
                    icon={<FaPhone size={24} />}
                    title="Teléfono"
                    value={alumno?.Usuario?.telefono || alumno?.telefono || 'N/A'}
                />
            </Col>
            <Col md={3}>
                <InfoCard
                    icon={<FaWeight size={24} />}
                    title="Peso"
                    value={alumno?.peso ? `${alumno.peso} kg` : 'N/A'}
                />
            </Col>
            <Col md={3}>
                <InfoCard
                    icon={<FaRuler size={24} />}
                    title="Altura"
                    value={alumno?.altura ? `${alumno.altura} cm` : 'N/A'}
                />
            </Col>
            <Col md={3}>
                <InfoCard
                    icon={<FaDumbbell size={24} />}
                    title="Nivel"
                    value={alumno?.nivel_experiencia || 'N/A'}
                />
            </Col>
            <Col md={3}>
                <InfoCard
                    icon={<FaBirthdayCake size={24} />}
                    title="Género"
                    value={alumno?.Usuario?.genero || alumno?.genero || 'N/A'}
                />
            </Col>
            {alumno?.objetivo && (
                <Col md={12}>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <h6 className="mb-0">Objetivo</h6>
                            </div>
                            <p className="mb-0 text-muted">{alumno.objetivo}</p>
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </Row>
    );

    const renderStatsTab = () => (
        <Row className="g-3">
            {stats ? (
                <>
                    <Col md={3}>
                        <InfoCard
                            icon={<FaCalendarCheck size={24} />}
                            title="Entrenamientos"
                            value={stats.total_entrenamientos || 0}
                            subtitle="Completados"
                        />
                    </Col>
                    <Col md={3}>
                        <InfoCard
                            icon={<FaChartLine size={24} />}
                            title="Progreso"
                            value={`${stats.progreso_general || 0}%`}
                            subtitle="General"
                        />
                    </Col>
                    <Col md={3}>
                        <InfoCard
                            icon={<FaDumbbell size={24} />}
                            title="Rutinas"
                            value={stats.rutinas_asignadas || 0}
                            subtitle="Asignadas"
                        />
                    </Col>
                    <Col md={3}>
                        <InfoCard
                            icon={<FaWeight size={24} />}
                            title="Peso Actual"
                            value={stats.peso_actual ? `${stats.peso_actual} kg` : 'N/A'}
                            subtitle="Último registro"
                        />
                    </Col>

                    {progreso && progreso.length > 0 && (
                        <Col md={12}>
                            <Card className="shadow-sm border-0">
                                <Card.Header>
                                    <h6 className="mb-0">Progreso de Entrenamientos</h6>
                                </Card.Header>
                                <Card.Body>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={progreso}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="fecha" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="entrenamientos"
                                                stroke="#4a90e2"
                                                strokeWidth={2}
                                                name="Entrenamientos"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="progreso"
                                                stroke="#28a745"
                                                strokeWidth={2}
                                                name="Progreso %"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </>
            ) : (
                <Col md={12}>
                    <Alert variant="info">
                        No hay estadísticas disponibles para este alumno.
                    </Alert>
                </Col>
            )}
        </Row>
    );

    return (
        <Modal show={show} onHide={onHide} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    Perfil de {alumno?.Usuario?.nombre || alumno?.nombre || ''} {alumno?.Usuario?.apellido || alumno?.apellido || ''}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" className="mb-3" />
                        <div>Cargando información del alumno...</div>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : alumno ? (
                    <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
                        <Tab eventKey="info" title="Información Personal">
                            {renderInfoTab()}
                        </Tab>
                        <Tab eventKey="stats" title="Estadísticas">
                            {renderStatsTab()}
                        </Tab>
                    </Tabs>
                ) : (
                    <Alert variant="warning">No se pudo cargar la información del alumno.</Alert>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AlumnoPerfilModal;