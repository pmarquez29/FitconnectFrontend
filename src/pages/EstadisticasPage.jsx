import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import ProgressChart from "../components/ProgressChart";
import DisciplinePieChart from "../components/DisciplinePieChart";
import TopAlumnosTable from "../components/TopAlumnosTable";
import { getResumen, getProgresoSemanal, getAlumnosPorDisciplina, getTopAlumnos } from "../api/estadisticas";
import "../styles/layout.css";
import "../styles/estadisticas.css";

const EstadisticasPage = () => {
    const [resumen, setResumen] = useState({});
    const [progreso, setProgreso] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [topAlumnos, setTopAlumnos] = useState([]);

    useEffect(() => {
        getResumen().then(setResumen);
        getProgresoSemanal().then(setProgreso);
        getAlumnosPorDisciplina().then(setDisciplinas);
        getTopAlumnos().then(setTopAlumnos);
    }, []);

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                <div className="estadisticas-header">
                    <h1>Estadísticas</h1>
                    <p>{new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>

                <StatsCards resumen={resumen} />

                <div className="estadisticas-grid">
                    <ProgressChart data={progreso} />
                    <DisciplinePieChart data={disciplinas} />
                </div>

                <TopAlumnosTable alumnos={topAlumnos} />
            </main>
        </div>
    );
};

export default EstadisticasPage;
