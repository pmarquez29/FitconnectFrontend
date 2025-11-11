import { useEffect, useState } from "react";
import { getRutinas } from "../api/rutinas";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RutinaCard from "../components/RutinaCard";
import AddRutinaModal from "../components/AddRutinaModal";
import RutinaDetailModal from "../components/RutinaDetailModal";
import { FaChartPie, FaTasks, FaClock, FaUsers, FaSync } from "react-icons/fa";
import "../styles/layout.css";
import "../styles/rutinas.css";

const RutinasPage = () => {
    const [rutinas, setRutinas] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedRutina, setSelectedRutina] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState("Todos");
    const [filterDisciplina, setFilterDisciplina] = useState("Todos");
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadRutinas();
    }, []);

    const loadRutinas = async () => {
        try {
            setRefreshing(true);
            const data = await getRutinas();
            setRutinas(data);
        } catch (err) {
            console.error("Error cargando rutinas:", err);
        } finally {
            setRefreshing(false);
        }
    };

    // Estadísticas
    const total = rutinas.length;
    const completadas = rutinas.filter((r) => r.estado === "completada").length;
    const pendientes = rutinas.filter((r) => r.estado === "pendiente").length;
    const activas = rutinas.filter((r) => r.estado === "activa").length;
    const atrasadas = rutinas.filter((r) => r.estado === "atrasada").length;
    const alumnosActivos = total ? Math.round((activas / total) * 100) : 0;

    // Filtros combinados
    const filteredRutinas = rutinas.filter((r) => {
        const matchesSearch = r.nombre.toLowerCase().includes(search.toLowerCase());
        const matchesEstado = filterEstado === "Todos" || r.estado === filterEstado;
        const matchesDisciplina = filterDisciplina === "Todos" || r.Disciplina?.nombre === filterDisciplina;
        return matchesSearch && matchesEstado && matchesDisciplina;
    });

    const disciplinas = [
        "Todos",
        ...new Set(rutinas.map((r) => r.Disciplina?.nombre).filter(Boolean)),
    ];

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                {/* Título y Fecha */}
                <div className="rutinas-header">
                    <h1 className="titulo-rutinas">Gestión de Rutinas</h1>
                    <p className="fecha">
                        {new Date().toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                {/* Tabs de disciplina */}
                <div className="tabs-disciplina">
                    {disciplinas.map((d) => (
                        <button
                            key={d}
                            className={filterDisciplina === d ? "tab active" : "tab"}
                            onClick={() => setFilterDisciplina(d)}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Métricas */}
                <div className="metricas">
                    <div className="card-metrica">
                        <FaTasks className="icon" />
                        <div>
                            <h3>{activas}</h3>
                            <p>Rutinas Activas</p>
                        </div>
                    </div>
                    <div className="card-metrica">
                        <FaChartPie className="icon" />
                        <div>
                            <h3>{completadas}</h3>
                            <p>Completadas</p>
                        </div>
                    </div>
                    <div className="card-metrica">
                        <FaClock className="icon" />
                        <div>
                            <h3>{pendientes}</h3>
                            <p>Pendientes</p>
                        </div>
                    </div>
                    <div className="card-metrica">
                        <FaUsers className="icon" />
                        <div>
                            <h3>{alumnosActivos}%</h3>
                            <p>Alumnos Activos</p>
                        </div>
                    </div>
                </div>

                {/* Filtros de estado */}
                <div className="filtros-estado">
                    {[
                        ["Todos", total],
                        ["activa", activas],
                        ["pendiente", pendientes],
                        ["atrasada", atrasadas],
                        ["completada", completadas],
                    ].map(([estado, count]) => (
                        <button
                            key={estado}
                            className={filterEstado === estado ? "active" : ""}
                            onClick={() => setFilterEstado(estado)}
                        >
                            {estado.charAt(0).toUpperCase() + estado.slice(1)} ({count})
                        </button>
                    ))}

                    <button
                        className="refresh-btn"
                        onClick={loadRutinas}
                        disabled={refreshing}
                    >
                        <FaSync className={refreshing ? "fa-spin" : ""} />
                    </button>
                </div>

                {/* Buscador */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar rutina..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="icon">🔍</span>
                </div>

                {/* Grid de rutinas */}
                <div className="rutinas-grid">
                    <div className="rutina-card add-card" onClick={() => setShowAddModal(true)}>
                        <span className="plus">＋</span>
                        <p>Crear Nueva Rutina</p>
                        <small>Diseña un plan personalizado</small>
                    </div>

                    {filteredRutinas.map((rutina) => (
                        <RutinaCard
                            key={rutina.id}
                            rutina={rutina}
                            onClick={setSelectedRutina}
                        />
                    ))}
                </div>

                <AddRutinaModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onRutinaAdded={loadRutinas}
                />

                <RutinaDetailModal
                    rutinaId={selectedRutina}
                    onClose={() => setSelectedRutina(null)}
                />
            </main>
        </div>
    );
};

export default RutinasPage;
