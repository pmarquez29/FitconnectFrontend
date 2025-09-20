import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PerfilHeader from "../components/PerfilHeader";
import RutinaCardResumen from "../components/RutinaCardResumen";
import ProgresoChart from "../components/ProgresoChart";
import ActividadReciente from "../components/ActividadReciente";
import { getAlumnoById, getAlumnoProgreso, getAlumnoActividad } from "../api/alumnos";
import HistorialRutinas from "../components/HistorialRutinas";
import { getAlumnoHistorialRutinas } from "../api/alumnos";
import ComparativoRutinas from "../components/ComparativoRutinas";
import { getAlumnoComparativoRutinas } from "../api/alumnos";
import "../styles/layout.css";
import "../styles/perfil.css";

const AlumnoPerfilPage = () => {
    const { id } = useParams();
    const [alumno, setAlumno] = useState(null);
    const [progreso, setProgreso] = useState([]);
    const [actividad, setActividad] = useState([]);

    const [historial, setHistorial] = useState([]);
    const [comparativo, setComparativo] = useState([]);

    useEffect(() => {
        getAlumnoById(id).then(setAlumno);
        getAlumnoProgreso(id).then(setProgreso);
        getAlumnoActividad(id).then(setActividad);
        getAlumnoHistorialRutinas(id).then(setHistorial);
        getAlumnoComparativoRutinas(id).then(setComparativo);
    }, [id]);


    if (!alumno) return <p>Cargando perfil...</p>;

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />

                <PerfilHeader alumno={alumno} />

                <section className="alumno-datos">
                    <h3>Datos del Alumno</h3>
                    <p><strong>Email:</strong> {alumno.email}</p>
                    <p><strong>Teléfono:</strong> {alumno.telefono}</p>
                    <p><strong>Edad:</strong> {alumno.edad}</p>
                    <p><strong>Peso:</strong> {alumno.peso} kg</p>
                    <p><strong>Altura:</strong> {alumno.altura} cm</p>
                    <p><strong>Objetivo:</strong> {alumno.objetivo}</p>
                </section>
                <RutinaCardResumen rutina={alumno.rutina} />
                <HistorialRutinas historial={historial} />
                <ComparativoRutinas data={comparativo} />
                <ProgresoChart data={progreso} />
                <ActividadReciente actividades={actividad} />
            </main>
        </div>

    );
};

export default AlumnoPerfilPage;
