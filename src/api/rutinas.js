import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// 🔹 Helper para incluir el token automáticamente
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` },
    };
};

export const getRutinas = async () => {
    const response = await axios.get(`${API_URL}/rutinas`, getAuthHeader());
    return response.data;
};

export const addRutina = async (rutinaData) => {
    const response = await axios.post(`${API_URL}/rutinas`, rutinaData, getAuthHeader());
    return response.data;
};

export const getRutinaById = async (id) => {
    const response = await axios.get(`${API_URL}/rutinas/${id}`, getAuthHeader());
    return response.data;
};

// ✅ Corregido: ahora usa el header correctamente
export const getRutinasPorAlumno = async (alumnoId) => {
    const response = await axios.get(`${API_URL}/asignacion/alumno/${alumnoId}`, getAuthHeader());
    return response.data;
};

export const getRutinasAsignadas = async () => {
    const response = await axios.get(`${API_URL}/rutinas/alumno/mis-rutinas`, getAuthHeader());
    return response.data;
};

// Cambiar estado de rutina (pausar/reanudar)
export const changeRutinaStatus = async (asignacionId, nuevoEstado) => {
    const res = await axios.put(`${API_URL}/asignacion/${asignacionId}/estado`, { estado: nuevoEstado }, getAuthHeader());
    return res.data;
};
