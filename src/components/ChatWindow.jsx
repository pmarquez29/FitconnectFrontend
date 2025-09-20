import { useEffect, useRef, useState } from "react";
import { getMensajes, sendMensaje } from "../api/chat";
import { io } from "socket.io-client";
import "../styles/mensajes.css";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

const ChatWindow = ({ chat, user }) => {
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (chat) {
            getMensajes(chat.id).then(setMensajes);

            socket.emit("joinRoom", chat.id);

            socket.on("receiveMessage", (msg) => {
                if (msg.chat_id === chat.id) {
                    setMensajes((prev) => [...prev, msg]);
                }
            });

            return () => {
                socket.emit("leaveRoom", chat.id);
                socket.off("receiveMessage");
            };
        }
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim()) return;

        const msgData = await sendMensaje(chat.id, nuevoMensaje);
        socket.emit("sendMessage", msgData);

        setMensajes((prev) => [...prev, msgData]);
        setNuevoMensaje("");
    };

    if (!chat) {
        return <div className="chat-window empty">Selecciona un chat para comenzar</div>;
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <img
                    src={chat.usuario.foto || "../assets/avatar.png"}
                    alt={chat.usuario.nombre}
                    className="chat-avatar"
                />
                <div>
                    <h3>{chat.usuario.nombre}</h3>
                    <span className="status online">Online</span>
                </div>
            </div>

            <div className="chat-messages">
                {mensajes.map((msg, i) => (
                    <div
                        key={i}
                        className={`mensaje-bubble ${msg.remitente_id === user.id ? "propio" : "ajeno"}`}
                    >
                        <p>{msg.contenido}</p>
                        <span className="hora">
                            {new Date(msg.fecha_envio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>

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
