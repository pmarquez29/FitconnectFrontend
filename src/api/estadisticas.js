import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getResumen = async () => {
    const res = await axios.get(`${API_URL}/estadisticas/resumen`, getAuthHeader());
    return res.data;
};

export const getProgresoSemanal = async () => {
    const res = await axios.get(`${API_URL}/estadisticas/progreso-semanal`, getAuthHeader());
    return res.data;
};

export const getAlumnosPorDisciplina = async () => {
    const res = await axios.get(`${API_URL}/estadisticas/disciplinas`, getAuthHeader());
    return res.data;
};

export const getTopAlumnos = async () => {
    const res = await axios.get(`${API_URL}/estadisticas/top-alumnos`, getAuthHeader());
    return res.data;
};
