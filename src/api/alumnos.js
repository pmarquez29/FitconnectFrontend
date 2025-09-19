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
    return response.data; // devuelve { alumnoId, credenciales }
};
