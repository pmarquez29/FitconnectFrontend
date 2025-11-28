import { useEffect, useRef, useState } from "react";
import { getMensajes } from "../api/chat";
import { getRemindersByAlumno } from "../api/notifications";
import { io } from "socket.io-client";
import "../styles/mensajes.css";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000", {
    auth: { token: localStorage.getItem("token") },
});

const ChatWindow = ({ chat, user }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const messagesEndRef = useRef(null);

    // ✅ Cargar mensajes iniciales del chat
    useEffect(() => {
        if (chat) {
            Promise.all([
                getMensajes(chat.usuario.id),
                getRemindersByAlumno(chat.usuario.id)
            ]).then(([mensajes, recordatorios]) => {
                const remindersAsMsgs = recordatorios.map((r) => ({
                    contenido: `🕒 ${r.titulo}\n${r.mensaje}`,
                    fecha_envio: r.created_at,
                    tipo: "recordatorio",
                }));
                setMensajes([...mensajes, ...remindersAsMsgs].sort(
                    (a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio)
                ));
            });
        }
    }, [chat]);

    // ✅ Escuchar mensajes en tiempo real
    useEffect(() => {
        socket.on("nuevoMensaje", (msg) => {
            // Solo agregar si pertenece a este chat
            if (
                msg.remitente_id === chat?.usuario?.id ||
                msg.destinatario_id === chat?.usuario?.id
            ) {
                setMensajes((prev) => [...prev, msg]);
            }
        });

        socket.on("mensajeEnviado", (msg) => {
            setMensajes((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("nuevoMensaje");
            socket.off("mensajeEnviado");
        };
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    // ✅ Enviar mensaje
    const handleSend = (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        socket.emit("enviarMensaje", {
            destinatario_id: chat.usuario.id,
            contenido: nuevoMensaje,
        });

        setNuevoMensaje("");
    };

    if (!chat) {
        return (
            <div className="chat-window empty">
                <p>💬 Selecciona un alumno para comenzar el chat</p>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
                <img
                    src={chat.usuario.foto || "/assets/avatar.jpg"}
                    alt={chat.usuario.nombre}
                    className="chat-avatar"
                />
                <div>
                    <h3>{chat.usuario.nombre}</h3>
                    <span className="status online">En línea</span>
                </div>
            </div>

            {/* Mensajes */}
            <div className="chat-messages">
                {mensajes.map((msg, i) => (
                    <div
                        key={i}
                        className={`mensaje-bubble ${
                            msg.tipo === "recordatorio"
                                ? "sistema"
                                : msg.remitente_id === user.id
                                    ? "propio"
                                    : "ajeno"
                        }`}
                    >
                        <p>{msg.contenido}</p>
                    </div>

                ))}
                <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <form className="chat-input" onSubmit={handleSend}>
                <button type="button" className="attach-btn">📎</button>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button type="submit" className="send-btn">➤</button>
            </form>
        </div>
    );
};

export default ChatWindow;
