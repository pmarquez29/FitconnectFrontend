import { useState } from "react";
import { Dropdown, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
    FaEllipsisH,
    FaUser,
    FaEnvelope,
    FaClock,
    FaComments,
    FaEdit,
    FaTrash,
    FaEye
} from "react-icons/fa";
import { MdFitnessCenter } from "react-icons/md";
import "../styles/alumnos.css";
import defaultAvatar from "../assets/avatar.jpg";
import { getRutinasPorAlumno } from "../api/rutinas.js";
import RutinaCard from "./RutinaCard.jsx";

const AlumnoCard = ({
                        alumno,
                        onEdit,
                        onDelete,
                        onViewProfile,
                        onAssignRoutine,
                    }) => {
    const [imageError, setImageError] = useState(false);
    const [showRutinasModal, setShowRutinasModal] = useState(false);
    const [rutinas, setRutinas] = useState([]);
    const [loadingRutinas, setLoadingRutinas] = useState(false);
    const navigate = useNavigate();

    const getDisciplinaColor = (disciplina) => {
        const colors = {
            GIMNASIO: "#4a90e2",
            CALISTENIA: "#28a745",
            FUTSAL: "#ffc107",
            VOLLEY: "#17a2b8",
            BASQUET: "#dc3545",
        };
        return colors[disciplina?.toUpperCase()] || "#000000";
    };

    const getProgressColor = (progress) => {
        if (progress >= 80) return "#32d657";
        if (progress >= 60) return "#f7b801";
        if (progress >= 40) return "#f18701";
        return "#ff6b6b";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Sin registro";
        const fecha = new Date(dateString);
        if (isNaN(fecha)) return "Sin registro";
        return fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
    };

    const truncateEmail = (email, maxLength = 20) => {
        if (!email || email.length <= maxLength) return email;
        const [name, domain] = email.split("@");
        if (name.length > maxLength - 3) {
            return `${name.substring(0, maxLength - 3)}...@${domain}`;
        }
        return email;
    };

    const progress = alumno.progreso || 0;

    const handleOpenRutinas = async () => {
        setShowRutinasModal(true);
        setLoadingRutinas(true);
        try {
            const data = await getRutinasPorAlumno(alumno.usuario_id || alumno.id);
            setRutinas(data);
        } catch (err) {
            console.error("Error cargando rutinas:", err);
        } finally {
            setLoadingRutinas(false);
        }
    };

    // ✅ LÓGICA DE IMAGEN MEJORADA
    const getAvatarSrc = () => {
        if (imageError) return defaultAvatar;

        let foto = alumno.foto || alumno.Usuario?.foto;

        if (!foto) return defaultAvatar;

        if (typeof foto === 'string' && (foto.startsWith("data:image") || foto.startsWith("http"))) {
            return foto;
        }

        return defaultAvatar;
    };

    return (
        <div className="alumno-card">
            {/* DROPDOWN EN LA ESQUINA - MÍNIMO ESPACIO */}
            <div className="options-dropdown">
                <Dropdown drop="down" align="end">
                    <Dropdown.Toggle
                        as="div"
                        bsPrefix="custom-dropdown-toggle"
                    >
                        <FaEllipsisH />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => onViewProfile?.(alumno)}>
                            <FaEye className="me-2 text-primary" /> Ver Perfil
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onEdit?.(alumno)}>
                            <FaEdit className="me-2 text-warning" /> Editar
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onAssignRoutine?.(alumno)}>
                            <MdFitnessCenter className="me-2 text-success" />{" "}
                            Asignar Rutina
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            onClick={() => onDelete?.(alumno)}
                            className="text-danger"
                        >
                            <FaTrash className="me-2" /> Eliminar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* DISCIPLINA BADGE */}
            <div className="disciplina-badge-container">
                <div
                    className="disciplina-badge"
                    style={{
                        backgroundColor: getDisciplinaColor(alumno.disciplina),
                    }}
                >
                    {alumno.disciplina?.toUpperCase() || "GENERAL"}
                </div>
            </div>

            {/* ✅ 3. AVATAR GRANDE Y VISIBLE */}
            <div className="avatar-container">
                <img
                    src={getAvatarSrc()}
                    alt={`${alumno.nombre} ${alumno.apellido}`}
                    className="alumno-foto"
                    onError={(e) => {
                        e.target.onerror = null; // Prevenir loop infinito
                        setImageError(true);
                    }}
                />
            </div>

            {/* NOMBRE */}
            <h3 className="alumno-nombre">
                {alumno.nombre} {alumno.apellido}
            </h3>

            {/* GRID INFO */}
            <div className="info-grid">
                <div className="info-item">
                    <div className="info-label">
                        <FaEnvelope size={12} />
                        Correo
                    </div>
                    <div className="info-value">{truncateEmail(alumno.email)}</div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <MdFitnessCenter size={12} />
                        Rutina
                    </div>
                    <div className="info-value">
                        {alumno.rutina_asignada || "Ninguna"}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <FaClock size={12} />
                        Último acceso
                    </div>
                    <div className="info-value">
                        {formatDate(alumno.ultimo_acceso || alumno.Usuario?.last_login)}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">Estado</div>
                    <div className="info-value">
                        <span
                            className={`estado-badge ${
                                alumno.activo ? "activo" : "inactivo"
                            }`}
                        >
                            {alumno.activo ? "Activo" : "Inactivo"}
                        </span>
                    </div>
                </div>
            </div>

            {/* PROGRESO */}
            <div className="progreso-container">
                <div className="progreso-header">
                    <span className="progreso-label">Progreso</span>
                    <span
                        className="progreso-value"
                        style={{ color: getProgressColor(progress) }}
                    >
      {progress >= 100 ? "Completado" : `${progress}%`}
    </span>
                </div>
                <div className="progreso">
                    <div
                        className="progreso-bar"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress),
                            transition: "width 0.4s ease, background-color 0.3s ease",
                        }}
                    />
                </div>
                {progress >= 100 && (
                    <p className="text-success text-center mt-1 small fw-semibold">🎉 Rutina completada</p>
                )}

            </div>


            {/* ACCIONES */}
            <div className="acciones">
                <button
                    className="accion-btn"
                    onClick={() =>
                        navigate(`/alumnos/${alumno.usuario_id || alumno.id}`)
                    }
                >
                    <FaUser size={14} />
                    Perfil
                </button>

                <button className="accion-btn" onClick={handleOpenRutinas}>
                    <MdFitnessCenter size={14} />
                    Rutinas
                </button>

                <button
                    className="accion-btn"
                    onClick={() =>
                        navigate(`/mensajes?chat=${alumno.usuario_id || alumno.id}`)
                    }
                >
                    <FaComments size={14} />
                    Chat
                </button>
            </div>

            {/* MODAL DE RUTINAS */}
            <Modal
                show={showRutinasModal}
                onHide={() => setShowRutinasModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Rutinas de {alumno.nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingRutinas ? (
                        <div className="text-center p-3">
                            <Spinner animation="border" />
                            <p>Cargando rutinas...</p>
                        </div>
                    ) : rutinas.length > 0 ? (
                        <div className="rutinas-list">
                            {rutinas.map((r) => (
                                <RutinaCard
                                    key={r.id}
                                    rutina={r}
                                    onClick={(id) => console.log("Abrir detalle", id)}
                                    onEdit={(rutina) => console.log("Editar rutina", rutina)}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>No tiene rutinas asignadas aún.</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AlumnoCard;