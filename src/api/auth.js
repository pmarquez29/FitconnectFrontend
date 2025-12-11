import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const exit = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// 🆕 Registro de Instructor
export const register = async (data) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
};

// 🆕 Recuperar Contraseña (Simulación)
export const recoverPassword = async (email) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
};

// 🆕 Obtener Disciplinas (Para el select del registro)
// ✅ Esta función ahora funcionará porque el backend es público
export const getDisciplinasPublicas = async () => {
    const response = await axios.get(`${API_URL}/disciplinas`);
    return response.data;
};