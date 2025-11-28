import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlumnoDetalles } from "../api/alumnos";
import "../styles/mensajes.css";
import AssignRutinaModal from "./AssignRutinaModal";
import { createReminder } from "../api/notifications";
import Swal from "sweetalert2";
import RegistrarProgresoModal from "./RegistrarProgresoModal.jsx";


const AlumnoInfoCard = ({ alumno }) => {
    const navigate = useNavigate();
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showAssignModal, setShowAssignModal] = useState(false);

    const [showProgresoModal, setShowProgresoModal] = useState(false);


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
            cancelButtonText: "Cancelar"
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

    const handleRegistrarProgreso = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Registrar progreso manual",
            html: `
        <input id="asignacion" class="swal2-input" placeholder="ID de asignación">
        <input id="ejercicio" class="swal2-input" placeholder="ID de ejercicio">
        <input id="series" class="swal2-input" placeholder="Series completadas">
        <input id="reps" class="swal2-input" placeholder="Repeticiones realizadas">
        <input id="peso" class="swal2-input" placeholder="Peso utilizado (kg)">
        <textarea id="notas" class="swal2-textarea" placeholder="Notas adicionales"></textarea>
        <label style="display:flex;align-items:center;gap:5px;justify-content:center;margin-top:8px;">
            <input type="checkbox" id="completado"> Completado
        </label>
        `,
            focusConfirm: false,
            preConfirm: () => ({
                asignacion_id: document.getElementById("asignacion").value,
                ejercicio_id: document.getElementById("ejercicio").value,
                series_completadas: document.getElementById("series").value,
                repeticiones_realizadas: document.getElementById("reps").value,
                peso_utilizado: document.getElementById("peso").value,
                notas: document.getElementById("notas").value,
                completado: document.getElementById("completado").checked,
                alumno_id: alumno.id || alumno.usuario_id,
            }),
            showCancelButton: true,
            confirmButtonText: "Registrar",
            cancelButtonText: "Cancelar"
        });

        if (formValues) {
            try {
                await createManualProgress(formValues);
                Swal.fire("✅ Progreso registrado", "El avance fue guardado correctamente", "success");
            } catch (err) {
                console.error("Error registrando progreso:", err);
                Swal.fire("Error", "No se pudo registrar el progreso", "error");
            }
        }
    };

    const handleRutinaAssigned = () => {
        setShowAssignModal(false);
        // Actualizar rutinas luego de asignar
        setTimeout(() => window.location.reload(), 1000);
    };


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

    if (!alumno) {
        return (
            <div className="alumno-info-card empty">
                <p>Selecciona un alumno para ver su información</p>
            </div>
        );
    }

    if (loading) return <div className="alumno-info-card">Cargando información...</div>;

    const usuario = info?.Usuario || alumno;
    const rutinas = info?.AsignacionRutinas || [];
    const disciplina = usuario?.Disciplina?.nombre || "SIN DISCIPLINA";

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
                </div>
            </div>

            <div className="rutinas-historial">
                <h5>📋 HISTORIAL DE RUTINAS</h5>

                {rutinas.length > 0 ? (
                    rutinas.map((r) => (
                        <div key={r.id} className="rutina-item">
                            <div className="rutina-header">
                                <span className={`estado ${r.estado?.toLowerCase()}`}>
                                    {r.Rutina?.nombre}
                                </span>
                                <span className="estado-text">
                                    {r.estado || "Activa"} - {r.progreso || 0}%
                                </span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className={`progress ${r.estado?.toLowerCase() || "activa"}`}
                                    style={{ width: `${r.progreso || 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tiene rutinas registradas.</p>
                )}
            </div>

            <div className="acciones">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/alumnos/${alumno.id || alumno.usuario_id}`)}
                >
                    👤 Ver perfil completo
                </button>
                <button className="btn btn-secondary" onClick={() => setShowAssignModal(true)}>
                    ➕ Asignar nueva rutina
                </button>

                <button className="btn btn-secondary" onClick={() => setShowProgresoModal(true)}>
                    ✅ Registrar progreso manual
                </button>


                <button
                    className="btn btn-secondary"
                    onClick={() => handleProgramarRecordatorio()}
                >
                    ⏰ Programar recordatorio
                </button>

            </div>

            <AssignRutinaModal
                show={showAssignModal}
                onHide={() => setShowAssignModal(false)}
                alumno={alumno}
                onRutinaAssigned={handleRutinaAssigned}
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
