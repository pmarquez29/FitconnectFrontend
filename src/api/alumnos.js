import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getAlumnos = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/alumnos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addAlumno = async (alumnoData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/alumnos`, alumnoData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getAlumnoById = async (id) => {
    const res = await axios.get(`${API_URL}/alumnos/${id}`, getAuthHeader());
    return res.data;
};

export const getAlumnoProgreso = async (id) => {
    const res = await axios.get(`${API_URL}/alumnos/${id}/progreso`, getAuthHeader());
    return res.data;
};

export const getAlumnoActividad = async (id) => {
    const res = await axios.get(`${API_URL}/alumnos/${id}/actividad`, getAuthHeader());
    return res.data;
};

export const getAlumnoHistorialRutinas = async (id) => {
    const res = await axios.get(`${API_URL}/alumnos/${id}/historial-rutinas`, getAuthHeader());
    return res.data;
};

export const getAlumnoComparativoRutinas = async (id) => {
    const res = await axios.get(`${API_URL}/alumnos/${id}/comparativo-rutinas`, getAuthHeader());
    return res.data;
};

