import "../styles/mensajes.css";

const ChatList = ({ chats, selectedChat, onSelect, search, setSearch }) => {
    return (
        <div className="chat-list">
            <h2>Mensajes</h2>
            <input
                type="text"
                placeholder="Buscar alumno..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <ul>
                {chats
                    .filter(c => c.alumno.nombre.toLowerCase().includes(search.toLowerCase()))
                    .map((chat) => (
                        <li
                            key={chat.id}
                            className={selectedChat?.id === chat.id ? "active" : ""}
                            onClick={() => onSelect(chat)}
                        >
                            <img src={chat.alumno.foto || "/assets/avatar.png"} alt={chat.alumno.nombre} />
                            <div>
                                <strong>{chat.alumno.nombre}</strong>
                                <p>{chat.ultimoMensaje?.contenido || "Sin mensajes"}</p>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default ChatList;
