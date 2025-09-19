import { useEffect, useState } from "react";
import { getRutinas } from "../api/rutinas";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RutinaCard from "../components/RutinaCard";
import AddRutinaModal from "../components/AddRutinaModal";
import RutinaDetailModal from "../components/RutinaDetailModal";
import "../styles/layout.css";
import "../styles/rutinas.css";

const RutinasPage = () => {
    const [rutinas, setRutinas] = useState([]);
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRutina, setSelectedRutina] = useState(null);

    useEffect(() => {
        loadRutinas();
    }, []);

    const loadRutinas = async () => {
        try {
            const data = await getRutinas();
            setRutinas(data);
        } catch (err) {
            console.error("Error cargando rutinas", err);
        }
    };

    const filteredRutinas = rutinas.filter((r) =>
        r.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                <div className="rutinas-header">
                    <h1>Rutinas</h1>
                    <p>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar rutina..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="icon">🔍</span>
                </div>

                <div className="rutinas-grid">
                    <div className="rutina-card add-card" onClick={() => setShowAddModal(true)}>
                        ➕ Nueva Rutina
                    </div>
                    {filteredRutinas.map((rutina) => (
                        <RutinaCard key={rutina.id} rutina={rutina} onClick={setSelectedRutina} />
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
