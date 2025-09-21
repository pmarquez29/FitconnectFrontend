import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEllipsisH, FaUser, FaEnvelope, FaDumbbell, FaClock, FaCode, FaEdit, FaTrash, FaEye, FaComments } from "react-icons/fa";
import { MdFitnessCenter } from "react-icons/md";
import "../styles/alumnos.css";

const AlumnoCard = ({ alumno, onEdit, onDelete, onViewProfile, onAssignRoutine, onChat }) => {
    const [imageError, setImageError] = useState(false);

    // Función para obtener color de disciplina
    const getDisciplinaColor = (disciplina) => {
        const colors = {
            'GIMNASIO': '#4a90e2',
            'CALISTENIA': '#28a745',
            'FUTSAL': '#ffc107',
            'VOLLEY': '#17a2b8',
            'BASQUET': '#dc3545'
        };
        return colors[disciplina?.toUpperCase()] || '#6c757d';
    };

    // Función para obtener color de progreso
    const getProgressColor = (progress) => {
        if (progress >= 80) return '#28a745';
        if (progress >= 60) return '#ffc107';
        if (progress >= 40) return '#fd7e14';
        return '#dc3545';
    };

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Función para truncar email
    const truncateEmail = (email, maxLength = 20) => {
        if (!email || email.length <= maxLength) return email;
        const [name, domain] = email.split('@');
        if (name.length > maxLength - 3) {
            return `${name.substring(0, maxLength - 3)}...@${domain}`;
        }
        return email;
    };

    const progress = alumno.progreso || 0;

    return (
        <div className="alumno-card">
            {/* Header con disciplina y opciones */}
            <div className="card-header">
                <div
                    className="disciplina-badge"
                    style={{ backgroundColor: getDisciplinaColor(alumno.disciplina) }}
                >
                    {alumno.disciplina?.toUpperCase() || "GENERAL"}
                </div>

                <Dropdown className="options-dropdown" drop="down">
                    <Dropdown.Toggle variant="light" className="options-btn">
                        <FaEllipsisH />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={() => onViewProfile?.(alumno)}>
                            <FaEye className="me-2" />
                            Ver Perfil
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onEdit?.(alumno)}>
                            <FaEdit className="me-2" />
                            Editar
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onAssignRoutine?.(alumno)}>
                            <MdFitnessCenter className="me-2" />
                            Asignar Rutina
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            onClick={() => onDelete?.(alumno)}
                            className="text-danger"
                        >
                            <FaTrash className="me-2" />
                            Eliminar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Avatar */}
            <div className="avatar-container">
                {!imageError && alumno.foto ? (
                    <img
                        src={alumno.foto}
                        alt={`${alumno.nombre} ${alumno.apellido}`}
                        className="alumno-foto"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="avatar-placeholder">
                        <FaUser size={32} />
                    </div>
                )}
            </div>

            {/* Nombre */}
            <h3 className="alumno-nombre">
                {alumno.nombre} {alumno.apellido}
            </h3>

            {/* Información en grid */}
            <div className="info-grid">
                <div className="info-item">
                    <div className="info-label">
                        <FaEnvelope size={12} />
                        <span>Correo</span>
                    </div>
                    <div className="info-value" title={alumno.email}>
                        {truncateEmail(alumno.email) || 'No disponible'}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <MdFitnessCenter size={12} />
                        <span>Rutina asignada</span>
                    </div>
                    <div className="info-value">
                        {alumno.rutina_asignada || 'Secundary'}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <FaClock size={12} />
                        <span>Último acceso</span>
                    </div>
                    <div className="info-value">
                        {formatDate(alumno.ultimo_acceso) || '03/23 - 03/24'}
                    </div>
                </div>

                <div className="info-item">
                    <div className="info-label">
                        <span>Estado</span>
                    </div>
                    <div className="info-value">
                        <span className={`estado-badge ${alumno.activo ? 'activo' : 'inactivo'}`}>
                            {alumno.activo !== false ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Barra de progreso */}
            <div className="progreso-container">
                <div className="progreso-header">
                    <span className="progreso-label">Progreso</span>
                    <span className="progreso-value">{progress}%</span>
                </div>
                <div className="progreso">
                    <div
                        className="progreso-bar"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress)
                        }}
                    />
                </div>
            </div>

            {/* Botones de acción */}
            <div className="acciones">
                <button
                    className="accion-btn primary"
                    onClick={() => onViewProfile?.(alumno)}
                    title="Ver perfil"
                >
                    <FaUser size={14} />
                    <span>Perfil</span>
                </button>
                <button
                    className="accion-btn success"
                    onClick={() => onAssignRoutine?.(alumno)}
                    title="Asignar rutina"
                >
                    <MdFitnessCenter size={14} />
                    <span>Rutinas</span>
                </button>
                <button
                    className="accion-btn info"
                    onClick={() => onChat?.(alumno)}
                    title="Iniciar chat"
                >
                    <FaComments size={14} />
                    <span>Stats</span>
                </button>
            </div>

            {/* Código del alumno */}
            <div className="codigo-container">
                <FaCode size={12} className="me-1" />
                <span>Código: <strong>{alumno.codigo_acceso || alumno.id || '123'}</strong></span>
            </div>
        </div>
    );
};

export default AlumnoCard;