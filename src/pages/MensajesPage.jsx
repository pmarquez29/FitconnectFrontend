import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
// Importamos el socket compartido
import socket from "../api/socket";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import AlumnoInfoCard from "../components/AlumnoInfoCard";
import { getChats } from "../api/chat";
import "../styles/mensajes.css";

const MensajesPage = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Usuario actual (Instructor)
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const location = useLocation();

    // 1. CONEXIÓN DEL SOCKET Y CARGA INICIAL
    useEffect(() => {
        // Asegurar que el socket tenga el token actualizado y conectar
        if (!socket.connected) {
            socket.auth = { token: localStorage.getItem("token") };
            socket.connect();
        }

        loadChats();

        // Debug: confirmar conexión
        socket.on("connect", () => console.log("🟢 Socket conectado en MensajesPage"));

        return () => {
            socket.off("connect");
        };
    }, []);

    // Seleccionar chat por URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const chatId = params.get("chat");
        if (chatId && chats.length > 0 && !selectedChat) {
            const chatToSelect = chats.find(c => c.id.toString() === chatId);
            if (chatToSelect) setSelectedChat(chatToSelect);
        }
    }, [location, chats, selectedChat]);

    const loadChats = async () => {
        try {
            const data = await getChats();
            setChats(data);
            setLoading(false);
        } catch (error) {
            console.error("Error cargando chats:", error);
            setLoading(false);
        }
    };

    // ✅ FUNCIÓN CRÍTICA: Actualiza la lista lateral
    // Mueve el chat al principio y actualiza el último mensaje
    const handleChatUpdate = useCallback((chatId, ultimoMensaje) => {
        setChats((prevChats) => {
            // Convertimos a String para evitar errores de comparación (Number vs String)
            const targetId = String(chatId);
            const index = prevChats.findIndex((c) => String(c.id) === targetId);

            if (index !== -1) {
                // Clonamos el array para forzar re-render en React
                const newChats = [...prevChats];

                // Actualizamos el objeto chat
                const chatActualizado = {
                    ...newChats[index],
                    ultimoMensaje: {
                        contenido: ultimoMensaje.contenido,
                        fecha_envio: ultimoMensaje.fecha_envio
                    }
                };

                // Lo sacamos de su posición y lo ponemos primero (unshift)
                newChats.splice(index, 1);
                newChats.unshift(chatActualizado);

                return newChats;
            } else {
                // Si es un chat nuevo (alumno nuevo escribe), recargamos toda la lista
                loadChats();
                return prevChats;
            }
        });
    }, []);

    // 2. ESCUCHAR SOCKET (Mensajes Entrantes)
    useEffect(() => {
        const handleNuevoMensaje = (msg) => {
            console.log("🔔 Mensaje recibido en socket:", msg);

            // LÓGICA PARA IDENTIFICAR EL CHAT:
            // Si yo (currentUser.id) envié el mensaje -> El chat es el destinatario.
            // Si yo recibí el mensaje -> El chat es el remitente (el alumno).
            const myId = String(currentUser.id);
            const remitente = String(msg.remitente_id);

            let chatToUpdateId;

            if (remitente === myId) {
                chatToUpdateId = msg.destinatario_id; // Mensaje saliente (echo)
            } else {
                chatToUpdateId = msg.remitente_id;    // Mensaje entrante (alumno)
            }

            handleChatUpdate(chatToUpdateId, msg);
        };

        socket.on("nuevoMensaje", handleNuevoMensaje);

        return () => {
            socket.off("nuevoMensaje", handleNuevoMensaje);
        };
    }, [handleChatUpdate, currentUser.id]);

    return (
        <div className="layout">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            <main className="content bg-light">
                <Header user={currentUser} />

                <Container fluid className="p-3" style={{ height: "calc(100vh - 80px)" }}>
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <div className="mensajes-container">
                            {/* Pasamos handleChatUpdate solo si necesitas depurar,
                                pero ChatList se actualiza vía props 'chats' */}
                            <ChatList
                                chats={chats}
                                selectedChat={selectedChat}
                                onSelect={setSelectedChat}
                                search={search}
                                setSearch={setSearch}
                            />

                            <ChatWindow
                                chat={selectedChat}
                                user={currentUser}
                                // Pasamos callback para actualizar lista al enviar manual
                                onMessageSent={handleChatUpdate}
                            />

                            {selectedChat ? (
                                <AlumnoInfoCard alumno={selectedChat.usuario || selectedChat} />
                            ) : (
                                <div className="d-none d-lg-flex bg-white border-start align-items-center justify-content-center text-muted">
                                    <p>Selecciona un chat para ver detalles</p>
                                </div>
                            )}
                        </div>
                    )}
                </Container>
            </main>
        </div>
    );
};

export default MensajesPage;