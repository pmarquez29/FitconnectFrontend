import "../styles/mensajes.css";

const ChatList = ({ chats, selectedChat, onSelect, search, setSearch }) => {
    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2>Mensajes</h2>
                <button className="new-chat">+</button>
            </div>
            <input
                type="text"
                className="chat-search"
                placeholder="Buscar alumno..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="chat-items">
                {chats
                    .filter(c =>
                        c.usuario?.nombre?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((chat) => (
                        <li
                            key={chat.id}
                            className={`chat-item ${chat.tipo === "sistema" ? "system" : ""} ${selectedChat?.id === chat.id ? "active" : ""}`}
                            onClick={() => onSelect(chat)}
                        >
                            <img
                                src={chat.usuario.foto || "/assets/logo.png"}
                                alt={chat.usuario.nombre}
                                className="chat-avatar"
                            />
                            <div className="chat-info">
                                <strong>{chat.usuario.nombre}</strong>
                                <p>{chat.ultimoMensaje?.contenido || "Sin mensajes"}</p>
                            </div>
                            <span className="chat-time">{
                                new Date(chat.ultimoMensaje?.fecha_envio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            }</span>
                        </li>

                    ))}
            </ul>

        </div>

    );
};

export default ChatList;
