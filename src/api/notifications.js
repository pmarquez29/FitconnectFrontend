import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const getNotifications = async () => {
    const response = await axios.get(`${API_URL}/notificaciones`, getAuthHeader());
    return response.data;
};

export const markAsRead = async (id) => {
    const response = await axios.put(`${API_URL}/notificaciones/${id}/leida`, {}, getAuthHeader());
    return response.data;
};

export const createReminder = async (usuarioId, titulo, mensaje) => {
    const response = await axios.post(
        `${API_URL}/notificaciones/recordatorio`,
        { usuario_id: usuarioId, titulo, mensaje },
        getAuthHeader()
    );
    return response.data;
};

export const getRemindersByAlumno = async (alumnoId) => {
    const response = await axios.get(`${API_URL}/notificaciones/alumno/${alumnoId}`, getAuthHeader());
    return response.data;
};

