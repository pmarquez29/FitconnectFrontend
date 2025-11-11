import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getChats = async () => {
    const response = await axios.get(`${API_URL}/mensajes/chats`, getAuthHeader());
    return response.data;
};

export const getMensajes = async (usuarioId) => {
    const response = await axios.get(`${API_URL}/mensajes/${usuarioId}`, getAuthHeader());
    return response.data;
};

export const sendMensaje = async (usuarioId, contenido) => {
    const response = await axios.post(`${API_URL}/mensajes`, { destinatario_id: usuarioId, contenido }, getAuthHeader());
    return response.data;
};
