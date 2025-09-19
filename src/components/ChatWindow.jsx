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
                <img src={chat.alumno.foto || "/assets/avatar.png"} alt={chat.alumno.nombre} />
                <h3>{chat.alumno.nombre}</h3>
            </div>
            <div className="chat-messages">
                {mensajes.map((msg, i) => (
                    <div
                        key={i}
                        className={`mensaje ${msg.remitente_id === user.id ? "propio" : ""}`}
                    >
                        <p>{msg.contenido}</p>
                        <span>{new Date(msg.fecha_envio).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <form className="chat-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default ChatWindow;
