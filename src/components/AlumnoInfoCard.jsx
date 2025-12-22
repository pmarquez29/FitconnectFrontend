import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlumnoDetalles } from "../api/alumnos";
import "../styles/mensajes.css";
import AssignRutinaModal from "./AssignRutinaModal";
import RegistrarProgresoModal from "./RegistrarProgresoModal";
import { createReminder } from "../api/notifications";
import Swal from "sweetalert2";
import { FaUser, FaDumbbell, FaCheckCircle, FaClock } from "react-icons/fa";

const AlumnoInfoCard = ({ alumno }) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showProgresoModal, setShowProgresoModal] = useState(false);

    useEffect(() => {
        if (!alumno) return;
        setInfo(null);
        const fetchInfo = async () => {
            try {
                setLoading(true);
                const data = await getAlumnoDetalles(alumno.id || alumno.usuario_id);
                setInfo(data);
            } catch (err) {
                console.error("Error cargando detalles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [alumno]);

    // ✅ FUNCIÓN CORREGIDA Y ROBUSTA PARA EL AVATAR
    const getAvatarSrc = (usuario) => {
        if (!usuario) return "/assets/avatar.jpg";

        const foto = usuario.foto;
        if (!foto) return "/assets/avatar.jpg";

        // Caso 1: Ya es un string Base64 correcto
        if (typeof foto === 'string') {
            // Si viene con el prefijo, lo devolvemos tal cual
            if (foto.startsWith('data:image') || foto.startsWith('http')) return foto;
            // Si viene el string base64 puro sin prefijo, se lo agregamos
            return `data:image/jpeg;base64,${foto}`;
        }

        // Caso 2: Es un Buffer (array de bytes)
        try {
            const bytes = foto.data ? new Uint8Array(foto.data) : new Uint8Array(foto);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpeg;base64,${window.btoa(binary)}`;
        } catch (e) {
            console.error("Error convirtiendo imagen", e);
            return "/assets/avatar.jpg";
        }
    };

    const handleProgramarRecordatorio = async () => {
        const { value: formValues } = await Swal.fire({
            title: '📅 Nuevo Recordatorio',
            html: `
            <div class="swal-form-layout">
                <div class="swal-field-group">
                    <label>Título</label>
                    <input id="titulo" class="swal-custom-input" placeholder="Ej: Traer toalla y agua">
                </div>
                
                <div class="swal-field-group">
                    <label>Mensaje</label>
                    <textarea id="mensaje" class="swal-custom-input" rows="3" placeholder="Escribe los detalles aquí..."></textarea>
                </div>
                
                <div class="swal-field-group">
                    <label>Fecha de envío</label>
                    <input id="fecha" type="date" class="swal-custom-input" />
                </div>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: 'Guardar Recordatorio',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false, // 👈 Importante: Desactiva estilos nativos feos
            customClass: {
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'btn-swal-confirm',
                cancelButton: 'btn-swal-cancel',
                validationMessage: 'swal-custom-validation'
            },
            focusConfirm: false,
            preConfirm: () => {
                const titulo = document.getElementById("titulo").value;
                const mensaje = document.getElementById("mensaje").value;
                const fecha = document.getElementById("fecha").value;

                if (!titulo || !mensaje || !fecha) {
                    Swal.showValidationMessage('⚠️ Por favor completa todos los campos');
                    return false;
                }
                return { titulo, mensaje, fecha };
            },
        });

        if (formValues) {
            try {
                await createReminder(alumno.id || alumno.usuario_id, formValues.titulo, formValues.mensaje, formValues.fecha);

                // Alerta de éxito también estilizada
                await Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'El alumno recibirá la notificación.',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: { popup: 'swal-custom-popup' }
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo crear el recordatorio.',
                    buttonsStyling: false,
                    customClass: {
                        popup: 'swal-custom-popup',
                        confirmButton: 'btn-swal-confirm'
                    }
                });
            }
        }
    };

    if (!alumno) return <div className="alumno-info-card empty"><p className="text-muted">Selecciona un chat</p></div>;
    if (loading) return <div className="alumno-info-card empty"><div className="spinner-border text-primary"></div></div>;

    const usuario = info || alumno;
    const rutinas = usuario?.rutinas || [];

    return (
        <div className="alumno-info-card">
            <div className="alumno-scroll-content">
                <div className="profile-header">

                    {/* ✅ AQUÍ ESTÁ EL ARREGLO VISUAL: Estilos en línea para forzar el círculo */}
                    <div style={{
                        width: "100px",
                        height: "100px",
                        margin: "0 auto 1rem auto", // Centrado
                        position: "relative"
                    }}>
                        <img
                            src={getAvatarSrc(usuario)}
                            alt={usuario?.nombre}
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover", // 👈 ESTO EVITA QUE SE ESTIRE O PIXELE
                                border: "4px solid #e0f2fe",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                            }}
                            onError={(e) => e.target.src = "/assets/avatar.jpg"}
                        />
                    </div>

                    <h3>{usuario?.nombre} {usuario?.apellido}</h3>
                    <p className="profile-email">{usuario?.email}</p>
                    <span className="disciplina-badge">{usuario?.disciplina || "Sin Disciplina"}</span>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Peso</span>
                        <div className="stat-value">{usuario?.peso || "--"} kg</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Altura</span>
                        <div className="stat-value">{usuario?.altura || "--"} cm</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Nivel</span>
                        <div className="stat-value" style={{fontSize: '0.85rem'}}>{usuario?.nivel_experiencia || "N/A"}</div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Objetivo</span>
                        <div className="stat-value" style={{fontSize: '0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{usuario?.objetivo || "N/A"}</div>
                    </div>
                </div>

                <div className="section-title mt-3">Rutina Activa</div>
                {rutinas.length > 0 ? (
                    rutinas.slice(0, 3).map((r) => (
                        <div key={r.id} className="rutina-mini-card">
                            <div className="rutina-mini-header">
                                <span className="rutina-name">{r.Rutina?.nombre || "Rutina"}</span>
                                <span className={`rutina-status ${r.estado?.toLowerCase()}`}>{r.estado || "Activa"}</span>
                            </div>
                            <div className="mini-progress-track">
                                <div className="mini-progress-fill" style={{width: `${r.progreso || 0}%`, backgroundColor: r.progreso >= 100 ? '#16a34a' : '#2563eb'}}></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-muted text-center py-2" style={{fontSize: '0.85rem'}}>No hay rutinas asignadas</p>
                )}
            </div>

            <div className="acciones-container">
                <button className="btn-action btn-primary" onClick={() => setShowAssignModal(true)}><FaDumbbell /> Asignar</button>
                <div className="d-flex gap-2">
                    <button className="btn-action btn-outline flex-grow-1" onClick={() => setShowProgresoModal(true)}><FaCheckCircle /> Progreso</button>
                    <button className="btn-action btn-outline flex-grow-1" onClick={handleProgramarRecordatorio}><FaClock /> Recordatorio</button>
                </div>
                <button className="btn-action btn-outline" onClick={() => navigate(`/alumnos/${alumno.id || alumno.usuario_id}`)}><FaUser /> Perfil Completo</button>
            </div>

            <AssignRutinaModal show={showAssignModal} onHide={() => setShowAssignModal(false)} alumno={alumno} onRutinaAssigned={() => window.location.reload()} />
            <RegistrarProgresoModal show={showProgresoModal} onHide={() => setShowProgresoModal(false)} alumno={alumno} />
        </div>
    );
};

export default AlumnoInfoCard;