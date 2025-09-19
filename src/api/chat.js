import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getChats = async () => {
    const response = await axios.get(`${API_URL}/chats`, getAuthHeader());
    return response.data;
};

export const getMensajes = async (chatId) => {
    const response = await axios.get(`${API_URL}/chats/${chatId}/mensajes`, getAuthHeader());
    return response.data;
};

export const sendMensaje = async (chatId, mensaje) => {
    const response = await axios.post(`${API_URL}/chats/${chatId}/mensajes`, { mensaje }, getAuthHeader());
    return response.data;
};
