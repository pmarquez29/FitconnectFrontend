import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

// Obtener todos los alumnos del instructor
export const getAlumnos = async () => {


    try {
        const response = await axios.get(`${API_URL}/alumnos`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumnos:", error);
        throw error;
    }
};

// Crear nuevo alumno
export const addAlumno = async (alumnoData) => {
    try {
        const response = await axios.post(`${API_URL}/alumnos`, alumnoData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error creating alumno:", error);
        throw error;
    }
};

// Obtener alumno por ID
export const getAlumnoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno by ID:", error);
        throw error;
    }
};

// Actualizar alumno
export const updateAlumno = async (id, alumnoData) => {
    try {
        const response = await axios.put(`${API_URL}/alumnos/${id}`, alumnoData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error updating alumno:", error);
        throw error;
    }
};

// Eliminar alumno
export const deleteAlumno = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/alumnos/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error deleting alumno:", error);
        throw error;
    }
};

// Activar/Desactivar alumno
export const toggleAlumnoStatus = async (id) => {
    try {
        const response = await axios.patch(`${API_URL}/alumnos/${id}/toggle-status`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error toggling alumno status:", error);
        throw error;
    }
};

// Obtener progreso del alumno
export const getAlumnoProgreso = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}/progreso`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno progress:", error);
        throw error;
    }
};

// Obtener actividad del alumno
export const getAlumnoActividad = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}/actividad`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno activity:", error);
        throw error;
    }
};

// Obtener historial de rutinas
export const getAlumnoHistorialRutinas = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}/historial-rutinas`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno rutinas history:", error);
        throw error;
    }
};

// Comparativo de rutinas
export const getAlumnoComparativoRutinas = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}/comparativo-rutinas`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno rutinas comparison:", error);
        throw error;
    }
};

// Asignar rutina a alumno
export const assignRutinaToAlumno = async (alumnoId, rutinaId, fechaInicio, notas = '') => {
    try {
        const response = await axios.post(`${API_URL}/asignacion`, {
            rutina_id: rutinaId,
            alumno_id: alumnoId,
            fecha_inicio: fechaInicio,
            notas
        }, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error assigning rutina to alumno:", error);
        throw error;
    }
};

// Obtener rutinas disponibles
export const getAvailableRutinas = async () => {
    try {
        const response = await axios.get(`${API_URL}/rutinas`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting available rutinas:", error);
        throw error;
    }
};

// Enviar mensaje a alumno
export const sendMessageToAlumno = async (alumnoId, mensaje) => {
    try {
        const response = await axios.post(`${API_URL}/mensajes`, {
            destinatario_id: alumnoId,
            contenido: mensaje
        }, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error sending message to alumno:", error);
        throw error;
    }
};

// Obtener estadísticas del alumno
export const getAlumnoStats = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/alumnos/${id}/stats`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting alumno stats:", error);
        throw error;
    }
};

// Obtener disciplinas disponibles
export const getDisciplinas = async () => {
    try {
        const response = await axios.get(`${API_URL}/disciplinas`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error("Error getting disciplinas:", error);
        throw error;
    }
};

export const getAlumnoDetalles = async (id) => {
    const response = await axios.get(`${API_URL}/alumnos/${id}/detalles`, getAuthHeader());
    return response.data;
};

