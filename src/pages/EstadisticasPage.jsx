import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import ProgressChart from "../components/ProgressChart";
import DisciplinePieChart from "../components/DisciplinePieChart";
import TopAlumnosTable from "../components/TopAlumnosTable";
import {
    getResumen,
    getProgresoSemanal,
    getAlumnosPorDisciplina,
    getTopAlumnos
} from "../api/estadisticas";
import "../styles/layout.css";
import "../styles/estadisticas.css";

const EstadisticasPage = () => {
    const [resumen, setResumen] = useState({});
    const [progreso, setProgreso] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [topAlumnos, setTopAlumnos] = useState([]);

    useEffect(() => {
        (async () => {
            setResumen(await getResumen());
            setProgreso(await getProgresoSemanal());
            setDisciplinas(await getAlumnosPorDisciplina());
            setTopAlumnos(await getTopAlumnos());
        })();
    }, []);

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={user} />

                <div className="estadisticas-header">
                    <div>
                        <h1>📊 Estadísticas del Entrenamiento</h1>
                        <p>
                            {new Date().toLocaleDateString("es-ES", {
                                weekday: "long", year: "numeric",
                                month: "long", day: "numeric"
                            })}
                        </p>
                    </div>
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
