import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"; // 👈 Importante
import { getChats } from "../api/chat";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import AlumnoInfoCard from "../components/AlumnoInfoCard";
import "../styles/layout.css";
import "../styles/mensajes.css";

const MensajesPage = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [search, setSearch] = useState("");
    const [searchParams] = useSearchParams(); // 👈 Hook de React Router

    const user = JSON.parse(localStorage.getItem("user"));
    const chatParam = searchParams.get("chat"); // 👈 leer el parámetro ?chat=ID

    useEffect(() => {
        // Cargar todos los chats
        getChats()
            .then((data) => {
                setChats(data);

                // Si hay ?chat en la URL, buscar y abrir ese chat automáticamente
                if (chatParam) {
                    const chatEncontrado = data.find(
                        (c) =>
                            c.usuario?.id?.toString() === chatParam.toString() ||
                            c.alumno_id?.toString() === chatParam.toString() ||
                            c.remitente_id?.toString() === chatParam.toString()
                    );
                    if (chatEncontrado) {
                        setSelectedChat(chatEncontrado);
                    }
                }
            })
            .catch(console.error);
    }, [chatParam]);

    return (
        <div className="layout">
            <Sidebar />
            <main className="content mensajes-page">
                <Header user={user} />
                <div className="mensajes-container">
                    <ChatList
                        chats={chats}
                        selectedChat={selectedChat}
                        onSelect={setSelectedChat}
                        search={search}
                        setSearch={setSearch}
                    />
                    <ChatWindow chat={selectedChat} user={user} />
                    <AlumnoInfoCard alumno={selectedChat?.usuario} />
                </div>
            </main>
        </div>
    );
};

export default MensajesPage;
