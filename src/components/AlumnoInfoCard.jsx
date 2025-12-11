import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlumnoDetalles } from "../api/alumnos";
import "../styles/mensajes.css";
import AssignRutinaModal from "./AssignRutinaModal";
import RegistrarProgresoModal from "./RegistrarProgresoModal";
import { createReminder } from "../api/notifications";
import Swal from "sweetalert2";

const AlumnoInfoCard = ({ alumno }) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showProgresoModal, setShowProgresoModal] = useState(false);

    useEffect(() => {
        if (!alumno) return;
        const fetchInfo = async () => {
            try {
                setLoading(true);
                const data = await getAlumnoDetalles(alumno.id || alumno.usuario_id);
                setInfo(data);
            } catch (err) {
                console.error("Error cargando detalles del alumno:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, [alumno]);

    const handleProgramarRecordatorio = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Programar recordatorio",
            html: `
                <input id="titulo" class="swal2-input" placeholder="Título del recordatorio">
                <textarea id="mensaje" class="swal2-textarea" placeholder="Mensaje para el alumno"></textarea>
                <input id="fecha" type="date" class="swal2-input" />
            `,
            focusConfirm: false,
            preConfirm: () => ({
                titulo: document.getElementById("titulo").value,
                mensaje: document.getElementById("mensaje").value,
                fecha: document.getElementById("fecha").value,
            }),
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
        });

        if (formValues) {
            try {
                await createReminder(
                    alumno.id || alumno.usuario_id,
                    formValues.titulo,
                    formValues.mensaje,
                    formValues.fecha
                );
                Swal.fire("✅ Recordatorio creado", "El alumno será notificado", "success");
            } catch (err) {
                console.error("Error al crear recordatorio:", err);
                Swal.fire("Error", "No se pudo crear el recordatorio", "error");
            }
        }
    };

    if (!alumno) {
        return (
            <div className="alumno-info-card empty">
                <p>Selecciona un alumno para ver su información</p>
            </div>
        );
    }

    if (loading) return <div className="alumno-info-card">Cargando información...</div>;

    const usuario = info || alumno;
    const disciplina = usuario?.disciplina || "Sin disciplina";
    const rutinas = usuario?.rutinas || [];

    return (
        <div className="alumno-info-card">
            <div className="alumno-header">
                <h4>{disciplina.toUpperCase()}</h4>
            </div>

            <div className="alumno-profile">
                <img
                    src={usuario?.foto || "/assets/avatar.png"}
                    alt={usuario?.nombre}
                    className="alumno-avatar"
                />
                <div className="alumno-details">
                    <h3>{usuario?.nombre} {usuario?.apellido}</h3>
                    <p className="alumno-email">{usuario?.email}</p>
                    <p>
                        <strong>Objetivo:</strong> {usuario?.objetivo || "No definido"} <br />
                        <strong>Nivel:</strong> {usuario?.nivel_experiencia || "No especificado"} <br />
                        <strong>Peso:</strong> {usuario?.peso || "?"} kg – <strong>Altura:</strong> {usuario?.altura || "?"} cm
                    </p>
                </div>
            </div>

            <div className="rutinas-historial">
                <h5>📋 HISTORIAL DE RUTINAS</h5>

                {rutinas.length > 0 ? (
                    <div className="rutinas-scroll">
                        {rutinas.map((r) => (
                            <div key={r.id} className="rutina-item">
                                <div className="rutina-header">
            <span className="estado">
              {r.Rutina?.nombre || `Rutina #${r.rutina_id}`}
            </span>
                                    <span className={`estado-text ${r.estado?.toLowerCase() || "activa"}`}>
              {r.estado || "Activa"} — {r.progreso || 0}%
            </span>
                                </div>

                                <small className="text-muted">
                                    Asignada el{" "}
                                    {new Date(r.fecha_asignacion).toLocaleDateString("es-BO", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </small>

                                <div className="progress-bar">
                                    <div
                                        className={`progress ${r.estado?.toLowerCase() || "activa"}`}
                                        style={{
                                            width: `${r.progreso || 0}%`,
                                            background:
                                                r.progreso >= 100
                                                    ? "#16a34a"
                                                    : r.progreso >= 50
                                                        ? "#2563eb"
                                                        : "#93c5fd",
                                        }}
                                    ></div>
                                </div>

                                {r.Rutina && (
                                    <div className="rutina-detalle small mt-1">
                                        <p className="text-muted">{r.Rutina.objetivo}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No tiene rutinas asignadas.</p>
                )}
            </div>


            <div className="acciones">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/alumnos/${alumno.id || alumno.usuario_id}`)}
                >
                    👤 Ver perfil completo
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => setShowAssignModal(true)}
                >
                    ➕ Asignar nueva rutina
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => setShowProgresoModal(true)}
                >
                    ✅ Registrar progreso manual
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={handleProgramarRecordatorio}
                >
                    ⏰ Programar recordatorio
                </button>
            </div>

            {/* Modales */}
            <AssignRutinaModal
                show={showAssignModal}
                onHide={() => setShowAssignModal(false)}
                alumno={alumno}
                onRutinaAssigned={() => window.location.reload()}
            />

            <RegistrarProgresoModal
                show={showProgresoModal}
                onHide={() => setShowProgresoModal(false)}
                alumno={alumno}
            />
        </div>
    );
};

export default AlumnoInfoCard;
