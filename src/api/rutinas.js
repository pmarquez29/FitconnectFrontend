import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const getRutinas = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/rutinas`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const addRutina = async (rutinaData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/rutinas`, rutinaData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getRutinaById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/rutinas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};


