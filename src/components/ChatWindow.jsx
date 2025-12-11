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

    useEffect(() => {
        if (chat) {
            Promise.all([
                getMensajes(chat.usuario.id),
                getRemindersByAlumno(chat.usuario.id),
            ]).then(([mensajes, recordatorios]) => {
                const remindersAsMsgs = recordatorios.map((r) => ({
                    contenido: `🕒 ${r.titulo}\n${r.mensaje}`,
                    fecha_envio: r.created_at,
                    tipo: "recordatorio",
                    remitente_id: 0, // ✅ sistema
                }));
                setMensajes(
                    [...mensajes, ...remindersAsMsgs].sort(
                        (a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio)
                    )
                );
            });
        }
    }, [chat]);

    useEffect(() => {
        socket.on("nuevoMensaje", (msg) => {
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

            <div className="chat-messages">
                {mensajes.map((msg, i) => {
                    const isSystem = msg.tipo === "recordatorio" || msg.remitente_id === 0;
                    const isOwn = msg.remitente_id === user.id;

                    return (
                        <div
                            key={i}
                            className={`mensaje-bubble ${
                                isSystem ? "sistema propio" : isOwn ? "propio" : "ajeno"
                            }`}
                        >
                            {isSystem && <span className="sistema-icon">📅</span>}
                            <p>{msg.contenido}</p>
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

            <form className="chat-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button type="submit" className="send-btn">
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
