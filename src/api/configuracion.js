import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getPerfil = async () => {
    const res = await axios.get(`${API_URL}/instructor/perfil`, getAuthHeader());
    return res.data;
};

export const updatePerfil = async (data) => {
    const res = await axios.put(`${API_URL}/instructor/perfil`, data, getAuthHeader());
    return res.data;
};

export const changePassword = async (passwords) => {
    const res = await axios.put(`${API_URL}/instructor/cambiar-password`, passwords, getAuthHeader());
    return res.data;
};

export const updatePreferencias = async (data) => {
    const res = await axios.put(`${API_URL}/instructor/preferencias`, data, getAuthHeader());
    return res.data;
};

export const deleteCuenta = async () => {
    const res = await axios.delete(`${API_URL}/instructor/cuenta`, getAuthHeader());
    return res.data;
};
