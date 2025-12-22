import { FaSearch, FaCircle } from "react-icons/fa";
import "../styles/mensajes.css";

const ChatList = ({ chats, selectedChat, onSelect, search, setSearch }) => {

    // ✅ Función auxiliar para procesar la imagen (Igual que en AlumnoInfoCard)
    const getAvatarSrc = (usuario) => {
        if (!usuario) return "/assets/avatar.jpg";

        const foto = usuario.foto;
        if (!foto) return "/assets/avatar.jpg";

        // Si ya es string (url o base64)
        if (typeof foto === 'string') {
            if (foto.startsWith('data:image') || foto.startsWith('http')) return foto;
            return `data:image/jpeg;base64,${foto}`;
        }

        // Si es Buffer
        try {
            const bytes = foto.data ? new Uint8Array(foto.data) : new Uint8Array(foto);
            let binary = '';
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpeg;base64,${window.btoa(binary)}`;
        } catch (e) {
            return "/assets/avatar.jpg";
        }
    };

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2>Mensajes</h2>
                <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="chat-search"
                        placeholder="Buscar alumno..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <ul className="chat-items">
                {chats.length === 0 ? (
                    <div className="text-center p-4 text-muted">No hay chats disponibles</div>
                ) : (
                    chats
                        .filter(c => c.usuario?.nombre?.toLowerCase().includes(search.toLowerCase()))
                        .map((chat) => (
                            <li
                                key={chat.id}
                                className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
                                onClick={() => onSelect(chat)}
                            >
                                <div className="chat-avatar-container">
                                    {/* ✅ IMAGEN CON SEGURIDAD EXTRA */}
                                    <img
                                        src={getAvatarSrc(chat.usuario)}
                                        alt={chat.usuario.nombre}
                                        className="chat-avatar"
                                        onError={(e) => e.target.src = "/assets/avatar.jpg"} // Fallback final
                                    />
                                    <span className="online-badge"></span>
                                </div>

                                <div className="chat-info">
                                    <div className="chat-name-row">
                                        <strong>{chat.usuario.nombre} {chat.usuario.apellido}</strong>
                                        <span className="chat-date">
                                            {chat.ultimoMensaje &&
                                                new Date(chat.ultimoMensaje.fecha_envio).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                        </span>
                                    </div>
                                    <p className="chat-preview">
                                        {chat.ultimoMensaje?.contenido || "Inicia una conversación"}
                                    </p>
                                </div>
                            </li>
                        ))
                )}
            </ul>
        </div>
    );
};

export default ChatList;