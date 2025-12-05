import { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AddRutinaModal from "../components/AddRutinaModal";
import RutinaCardCatalogo from "../components/RutinaCardCatalogo";
import RutinaCardAsignada from "../components/RutinaCardAsignada";
import RutinaAsignadaDetailModal from "../components/RutinaAsignadaDetailModal";
import RutinaCatalogoDetailModal from "../components/RutinaCatalogoDetailModal";
import RutinaEditModal from "../components/RutinaEditModal";
import AddRutinaCard from "../components/AddRutinaCard"; // 🆕 nuevo import
import { getRutinas } from "../api/rutinas";
import axios from "axios";
import "../styles/layout.css";
import "../styles/rutinas.css";
import { Spinner } from "react-bootstrap";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const RutinasPage = () => {
    const [activeTab, setActiveTab] = useState("catalogo");
    const [rutinasCatalogo, setRutinasCatalogo] = useState([]);
    const [rutinasAsignadas, setRutinasAsignadas] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRutinaAsignada, setSelectedRutinaAsignada] = useState(null);
    const [selectedRutinaCatalogo, setSelectedRutinaCatalogo] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterDisciplina, setFilterDisciplina] = useState("Todos");
    const [loading, setLoading] = useState(false);
    const [rutinaParaEditar, setRutinaParaEditar] = useState(null);
    const [selectedAlumno, setSelectedAlumno] = useState(null);

    const token = localStorage.getItem("token");
    const loadedCatalogo = useRef(false);
    const loadedAsignadas = useRef(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // 🔹 Catálogo (solo instructor)
    const fetchRutinasCatalogo = async () => {
        try {
            setLoading(true);
            const data = await getRutinas();
            setRutinasCatalogo(Array.isArray(data) ? [...data] : []);
        } catch (err) {
            console.error("Error obteniendo catálogo:", err);
            setRutinasCatalogo([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Rutinas Asignadas (solo instructor)
    const fetchRutinasAsignadas = async () => {
        try {
            setRutinasAsignadas([]);
            const { data } = await axios.get(`${API_URL}/asignacion/instructor`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRutinasAsignadas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error obteniendo rutinas asignadas:", err);
            setRutinasAsignadas([]);
        }
    };

    useEffect(() => {
        if (activeTab === "catalogo" && !loadedCatalogo.current) {
            fetchRutinasCatalogo();
            loadedCatalogo.current = true;
        } else if (activeTab === "asignadas" && !loadedAsignadas.current) {
            fetchRutinasAsignadas();
            loadedAsignadas.current = true;
        }
    }, [activeTab]);

    const rutinasFiltradas =
        activeTab === "catalogo"
            ? rutinasCatalogo.filter(
                (r) =>
                    r.nombre.toLowerCase().includes(search.toLowerCase()) &&
                    (filterDisciplina === "Todos" ||
                        r.Disciplina?.nombre === filterDisciplina)
            )
            : rutinasAsignadas.filter((r) =>
                (r.nombre || "").toLowerCase().includes(search.toLowerCase())
            );

    const getRutinaKey = (r, tipo) => {
        const id = r.id || r.rutina_id || Math.random();
        return `${tipo}-${id}`;
    };

    if (loading) {
        return (
            <div className="layout">
                <Sidebar
                />
                <main className="content">
                    <Header user={JSON.parse(localStorage.getItem("user") || "{}")} />
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                        <div className="text-center">
                            <Spinner animation="border" size="lg" className="mb-3" />
                            <div>Cargando Rutinas...</div>
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
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                {/* Tabs */}
                <div className="tabs-disciplina" style={{ marginBottom: "1rem" }}>
                    <button
                        className={activeTab === "asignadas" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("asignadas")}
                    >
                        Rutinas Asignadas
                    </button>
                    <button
                        className={activeTab === "catalogo" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("catalogo")}
                    >
                        Catálogo del Instructor
                    </button>
                </div>

                {/* Grid */}
                <div className="rutinas-grid">
                    {activeTab === "catalogo" ? (
                        <>
                            {/* 🆕 Tarjeta para crear rutina */}
                            <AddRutinaCard onClick={() => setShowAddModal(true)} />

                            {rutinasFiltradas.length === 0 ? (
                                <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                                    {loading ? "Cargando rutinas..." : "No hay rutinas para mostrar."}
                                </p>
                            ) : (
                                rutinasFiltradas.map((rutina) => (
                                    <RutinaCardCatalogo
                                        key={getRutinaKey(rutina, "catalogo")}
                                        rutina={rutina}
                                        onSelect={(id, action) => {
                                            if (action === "editar") {
                                                console.log("Editar rutina:", id);
                                            } else {
                                                setSelectedRutinaCatalogo(id);
                                            }
                                        }}
                                    />
                                ))
                            )}
                        </>
                    ) : (
                        rutinasFiltradas.length === 0 ? (
                            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
                                {loading ? "Cargando rutinas..." : "No hay rutinas para mostrar."}
                            </p>
                        ) : (
                            rutinasFiltradas.map((rutina) => (
                                <RutinaCardAsignada
                                    key={`asignada-${rutina.id}`}
                                    rutina={rutina}
                                    onSelect={(id) => {
                                        console.log("Abriendo modal con asignación:", id);
                                        setSelectedRutinaAsignada(id);
                                        setSelectedAlumno(rutina.alumno);
                                    }}
                                />
                            ))
                        )
                    )}
                </div>

                {/* Modales */}
                <AddRutinaModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onRutinaAdded={fetchRutinasCatalogo}
                />
            </main>

            <RutinaAsignadaDetailModal
                show={!!selectedRutinaAsignada}
                onHide={() => {
                    setSelectedRutinaAsignada(null);
                    setSelectedAlumno(null);
                }}
                asignacionId={selectedRutinaAsignada}
                alumno={selectedAlumno}
            />

            <RutinaCatalogoDetailModal
                show={!!selectedRutinaCatalogo}
                onHide={() => setSelectedRutinaCatalogo(null)}
                rutinaId={selectedRutinaCatalogo}
                onEditar={(rutina) => {
                    setRutinaParaEditar(rutina);
                    setSelectedRutinaCatalogo(null);
                }}
            />

            <RutinaEditModal
                show={!!rutinaParaEditar}
                rutina={rutinaParaEditar}
                onHide={() => setRutinaParaEditar(null)}
                onSave={fetchRutinasCatalogo}
            />
        </div>
    );
};

export default RutinasPage;