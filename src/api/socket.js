import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Creamos la instancia una sola vez
const socket = io(API_URL, {
    auth: { token: localStorage.getItem("token") },
    autoConnect: false,
    reconnection: true,
});

export default socket;