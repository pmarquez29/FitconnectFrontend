import { useEffect, useRef, useState } from "react";
import { getMensajes } from "../api/chat";
import { getRemindersByAlumno } from "../api/notifications";
import socket from "../api/socket"; // Usamos el mismo socket importado
import { FaPaperPlane, FaCalendarAlt } from "react-icons/fa";
import "../styles/mensajes.css";

const ChatWindow = ({ chat, user, onMessageSent }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const messagesEndRef = useRef(null);

    // Cargar historial
    useEffect(() => {
        if (chat) {
            setMensajes([]);
            Promise.all([
                getMensajes(chat.usuario.id),
                getRemindersByAlumno(chat.usuario.id),
            ]).then(([mensajesData, recordatoriosData]) => {
                const remindersAsMsgs = recordatoriosData.map((r) => ({
                    contenido: `📅 RECORDATORIO: ${r.titulo} - ${r.mensaje}`,
                    fecha_envio: r.created_at,
                    tipo: "recordatorio",
                    remitente_id: 0,
                }));
                const todos = [...mensajesData, ...remindersAsMsgs].sort(
                    (a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio)
                );
                setMensajes(todos);
            });
        }
    }, [chat]);

    // ✅ SOCKET: Actualización en Tiempo Real
    useEffect(() => {
        if (!chat) return;

        const handleNuevoMensaje = (msg) => {
            // Normalizar IDs a String para comparación segura
            const msgRemitente = String(msg.remitente_id);
            const msgDestinatario = String(msg.destinatario_id);
            const currentChatUserId = String(chat.usuario.id);

            // CONDICIÓN:
            // 1. El alumno me escribió (remitente == chat abierto)
            // 2. O yo le escribí y me llegó el eco (destinatario == chat abierto)
            if (msgRemitente === currentChatUserId || msgDestinatario === currentChatUserId) {

                setMensajes((prev) => {
                    // Evitar duplicados (por si el envío manual ya lo agregó)
                    const existe = prev.some(m =>
                        m.id === msg.id ||
                        (m.contenido === msg.contenido && Math.abs(new Date(m.fecha_envio) - new Date(msg.fecha_envio)) < 2000)
                    );

                    if (existe) return prev;

                    return [...prev, msg];
                });
            }
        };

        // Asegurar conexión
        if (!socket.connected) socket.connect();

        socket.on("nuevoMensaje", handleNuevoMensaje);

        return () => {
            socket.off("nuevoMensaje", handleNuevoMensaje);
        };
    }, [chat]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        const contenido = nuevoMensaje;
        const fechaActual = new Date().toISOString();

        // 1. Emitir al servidor
        socket.emit("enviarMensaje", {
            destinatario_id: chat.usuario.id,
            contenido: contenido,
        });

        // 2. UI Optimista (Mostrar inmediatamente)
        const msgLocal = {
            id: Date.now(), // ID temporal
            remitente_id: user.id,
            destinatario_id: chat.usuario.id,
            contenido: contenido,
            fecha_envio: fechaActual,
            leido: false,
            tipo: "chat"
        };

        setMensajes((prev) => [...prev, msgLocal]);

        // 3. Avisar al Padre (MensajesPage) para actualizar la lista lateral
        if (onMessageSent) {
            onMessageSent(chat.usuario.id, msgLocal);
        }

        setNuevoMensaje("");
    };

    if (!chat) {
        return (
            <div className="chat-window empty">
                <div style={{fontSize: '4rem', marginBottom: '1rem', opacity: 0.5}}>💬</div>
                <h3>Selecciona un chat</h3>
                <p className="text-muted">Elige un alumno de la lista para comenzar.</p>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <img
                    src={chat.usuario.foto || "/assets/avatar.jpg"}
                    alt={chat.usuario.nombre}
                    className="chat-avatar"
                    onError={(e) => e.target.src = "/assets/avatar.jpg"}
                />
                <div>
                    <h3>{chat.usuario.nombre} {chat.usuario.apellido}</h3>
                    <span style={{fontSize: '0.8rem', color: '#16a34a'}}>● En línea</span>
                </div>
            </div>

            <div className="chat-messages">
                {mensajes.map((msg, i) => {
                    const isSystem = msg.tipo === "recordatorio" || msg.remitente_id === 0;
                    const isOwn = msg.remitente_id === user.id;

                    return (
                        <div
                            key={i}
                            className={`mensaje-bubble ${
                                isSystem ? "sistema" : isOwn ? "propio" : "ajeno"
                            }`}
                        >
                            {isSystem && <FaCalendarAlt className="me-2" />}
                            <span>{msg.contenido}</span>
                            <span className="hora">
                                {new Date(msg.fecha_envio).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="chat-input-area">
                <form className="chat-input-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Escribe un mensaje..."
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                    />
                    <button type="submit" className="send-btn">
                        <FaPaperPlane size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;