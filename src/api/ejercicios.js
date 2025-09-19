import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const addEjercicioToRutina = async (rutinaId, data) => {
    const response = await axios.post(`${API_URL}/rutinas/${rutinaId}/ejercicios`, data, getAuthHeader());
    return response.data;
};

export const updateEjercicio = async (ejercicioId, data) => {
    const response = await axios.put(`${API_URL}/ejercicios/${ejercicioId}`, data, getAuthHeader());
    return response.data;
};

export const deleteEjercicio = async (ejercicioId) => {
    const response = await axios.delete(`${API_URL}/ejercicios/${ejercicioId}`, getAuthHeader());
    return response.data;
};
