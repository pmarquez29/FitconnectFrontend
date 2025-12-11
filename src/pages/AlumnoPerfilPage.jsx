import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PerfilHeader from "../components/PerfilHeader"; // Asegúrate de importar este nuevo componente
import RutinaCardResumen from "../components/RutinaCardResumen";
import ProgresoChart from "../components/ProgresoChart";
import ActividadReciente from "../components/ActividadReciente";
import HistorialRutinas from "../components/HistorialRutinas";
import ComparativoRutinas from "../components/ComparativoRutinas";
// Importamos iconos nuevos para la sección de datos
import { FaWeight, FaRulerVertical, FaHeartbeat, FaLayerGroup, FaBullseye, FaChartLine } from "react-icons/fa";

import {
    getAlumnoById,
    getAlumnoProgreso,
    getAlumnoActividad,
    getAlumnoHistorialRutinas,
    getAlumnoComparativoRutinas,
} from "../api/alumnos";
import "../styles/perfil.css";
import Header from "../components/Header.jsx";

const AlumnoPerfilPage = () => {
    const { id } = useParams();
    const [alumno, setAlumno] = useState(null);
    const [progreso, setProgreso] = useState([]);
    const [actividad, setActividad] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [comparativo, setComparativo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [a, p, act, h, c] = await Promise.all([
                    getAlumnoById(id),
                    getAlumnoProgreso(id),
                    getAlumnoActividad(id),
                    getAlumnoHistorialRutinas(id),
                    getAlumnoComparativoRutinas(id),
                ]);

                // Extraer rutina activa (ahora viene con datos completos gracias al backend)
                const rutinaActiva = a.AsignacionRutinas?.find(r => r.estado === "activa")?.Rutina || null;

                // Calcular edad
                const fechaNac = a.Usuario?.fecha_nacimiento ? new Date(a.Usuario.fecha_nacimiento) : null;
                const edad = fechaNac ? new Date().getFullYear() - fechaNac.getFullYear() : "--";

                setAlumno({
                    ...a,
                    edad,
                    rutina: rutinaActiva
                });
                setProgreso(p);
                setActividad(act);
                setHistorial(h);
                setComparativo(c);
            } catch (err) {
                console.error("Error cargando datos del alumno:", err);
            }
        };
        fetchData();
    }, [id]);

    if (!alumno) return <p>Cargando...</p>;

    // 🧮 CALCULAR IMC (Índice de Masa Corporal)
    const calcularIMC = (peso, altura) => {
        if (!peso || !altura) return { valor: "—", estado: "" };
        const alturaMetros = altura / 100;
        const imc = (peso / (alturaMetros * alturaMetros)).toFixed(1);
        let estado = "Normal";
        if (imc < 18.5) estado = "Bajo peso";
        else if (imc >= 25 && imc < 29.9) estado = "Sobrepeso";
        else if (imc >= 30) estado = "Obesidad";
        return { valor: imc, estado };
    };

    const imcData = calcularIMC(alumno.peso, alumno.altura);

    return (
        <div className="layout">
            <Sidebar />
            <main className="content perfil-page">
                <Header title="Perfil del Alumno" />
                <br/>
                <PerfilHeader alumno={alumno} />

                <div className="perfil-container fade-in">

                    <section className="perfil-grid">
                        {/* 📊 TARJETA DE DATOS FÍSICOS MEJORADA */}
                        <div className="perfil-card datos-card">
                            <h3><FaChartLine /> Estadísticas Físicas</h3>

                            <div className="datos-grid-visual">
                                {/* Item 1: Peso */}
                                <div className="dato-item">
                                    <div className="icon-box blue"><FaWeight /></div>
                                    <div>
                                        <span className="label">Peso Actual</span>
                                        <p className="valor">{alumno.peso || "—"} <small>kg</small></p>
                                    </div>
                                </div>

                                {/* Item 2: Altura */}
                                <div className="dato-item">
                                    <div className="icon-box green"><FaRulerVertical /></div>
                                    <div>
                                        <span className="label">Altura</span>
                                        <p className="valor">{alumno.altura ? Math.floor(alumno.altura) : "—"} <small>cm</small></p>
                                    </div>
                                </div>

                                {/* Item 3: IMC (Calculado) */}
                                <div className="dato-item">
                                    <div className="icon-box orange"><FaHeartbeat /></div>
                                    <div>
                                        <span className="label">IMC ({imcData.estado})</span>
                                        <p className="valor">{imcData.valor}</p>
                                    </div>
                                </div>

                                {/* Item 4: Nivel */}
                                <div className="dato-item">
                                    <div className="icon-box purple"><FaLayerGroup /></div>
                                    <div>
                                        <span className="label">Nivel</span>
                                        <p className="valor texto-pequeno">{alumno.nivel_experiencia || "Principiante"}</p>
                                    </div>
                                </div>

                                {/* Item 5: Objetivo (Ocupa doble espacio si es posible) */}
                                <div className="dato-item full-width">
                                    <div className="icon-box red"><FaBullseye /></div>
                                    <div>
                                        <span className="label">Objetivo Principal</span>
                                        <p className="valor texto-pequeno">{alumno.objetivo || "No definido"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TARJETA DE RUTINA */}
                        <div className="perfil-card resumen-card">
                            <RutinaCardResumen rutina={alumno.rutina} />
                        </div>
                    </section>

                    {/* Resto de componentes... */}
                    <section className="perfil-metricas">
                        <div className="perfil-card">
                            <ProgresoChart data={progreso} />
                        </div>
                        <div className="perfil-card">
                            <ComparativoRutinas data={comparativo} />
                        </div>
                    </section>

                    <section className="perfil-tablas">
                        <div className="perfil-card">
                            <HistorialRutinas historial={historial} />
                        </div>
                        <div className="perfil-card">
                            <ActividadReciente actividades={actividad} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AlumnoPerfilPage;