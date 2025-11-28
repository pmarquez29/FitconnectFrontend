import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getActiveExercises = async (alumnoId) => {
    const res = await axios.get(`${API_URL}/progreso/alumno/${alumnoId}/ejercicios`, getAuthHeader());
    return res.data;
};

export const createManualProgress = async (data) => {
    const res = await axios.post(`${API_URL}/progreso/manual`, data, getAuthHeader());
    return res.data;
};
