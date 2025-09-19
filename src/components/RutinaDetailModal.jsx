import { useEffect, useState } from "react";
import { getRutinaById } from "../api/rutinas";
import EjercicioItem from "./EjercicioItem";
import AddEjercicioModal from "./AddEjercicioModal";
import EditEjercicioModal from "./EditEjercicioModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import "../styles/rutinas.css";

const RutinaDetailModal = ({ rutinaId, onClose }) => {
    const [rutina, setRutina] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEjercicio, setEditingEjercicio] = useState(null);
    const [deletingEjercicio, setDeletingEjercicio] = useState(null);

    const loadRutina = async () => {
        if (rutinaId) {
            const data = await getRutinaById(rutinaId);
            setRutina(data);
        }
    };

    useEffect(() => {
        loadRutina();
    }, [rutinaId]);

    if (!rutinaId) return null;

    return (
        <div className="modal-overlay">
            <div className="modal modal-large">
                <button className="close-btn" onClick={onClose}>✖</button>
                {rutina ? (
                    <div>
                        <h2>{rutina.nombre}</h2>
                        <img src={rutina.imagen || "/assets/default-rutina.jpg"} alt={rutina.nombre} />
                        <p>{rutina.descripcion}</p>
                        <h3>Ejercicios</h3>
                        <button onClick={() => setShowAddModal(true)}>➕ Agregar Ejercicio</button>
                        <ul>
                            {(rutina.ejercicios || []).map((ej) => (
                                <EjercicioItem
                                    key={ej.id}
                                    ejercicio={ej}
                                    onEdit={setEditingEjercicio}
                                    onDelete={setDeletingEjercicio}
                                />
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}

                <AddEjercicioModal
                    rutinaId={rutinaId}
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onEjercicioAdded={loadRutina}
                />

                <EditEjercicioModal
                    ejercicio={editingEjercicio}
                    isOpen={!!editingEjercicio}
                    onClose={() => setEditingEjercicio(null)}
                    onEjercicioUpdated={loadRutina}
                />

                <ConfirmDeleteModal
                    ejercicioId={deletingEjercicio}
                    isOpen={!!deletingEjercicio}
                    onClose={() => setDeletingEjercicio(null)}
                    onEjercicioDeleted={loadRutina}
                />
            </div>
        </div>
    );
};

export default RutinaDetailModal;
