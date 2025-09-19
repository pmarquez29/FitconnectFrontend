import { useEffect, useState } from "react";
import AddAlumnoModal from "../components/AddAlumnoModal";
import { getAlumnos } from "../api/alumnos";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AlumnoCard from "../components/AlumnoCard";
import AlumnosFilter from "../components/AlumnosFilter";
import "../styles/layout.css";
import "../styles/alumnos.css";

const AlumnosPage = () => {
    const [alumnos, setAlumnos] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [showModal, setShowModal] = useState(false);

    const handleAlumnoAdded = () => {
        setShowModal(false);
        // refrescar lista
        getAlumnos().then(setAlumnos);
    };

    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const data = await getAlumnos();
                setAlumnos(data);
            } catch (err) {
                console.error("Error cargando alumnos", err);
            }
        };
        fetchAlumnos();
    }, []);

    const disciplinas = [...new Set(alumnos.map((a) => a.disciplina).filter(Boolean))];

    const filteredAlumnos = alumnos.filter((a) => {
        const matchesSearch = `${a.nombre} ${a.apellido}`.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "Todos" || a.disciplina === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                <div className="alumnos-header">
                    <h1>Alumnos</h1>
                    <p>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar alumno..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="icon">🔍</span>
                </div>

                <AlumnosFilter
                    disciplinas={disciplinas}
                    selected={filter}
                    onSelect={setFilter}
                />

                <div className="alumnos-grid">
                    {filteredAlumnos.map((alumno) => (
                        <AlumnoCard key={alumno.id} alumno={alumno} />
                    ))}
                </div>

                <button className="btn-add" onClick={() => setShowModal(true)}>➕ Agregar alumno</button>

                <AddAlumnoModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onAlumnoAdded={handleAlumnoAdded}
                />
            </main>
        </div>
    );
};

export default AlumnosPage;
