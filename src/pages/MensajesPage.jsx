import { useEffect, useState } from "react";
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
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getChats().then(setChats).catch(console.error);
    }, []);

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
                    <AlumnoInfoCard alumno={selectedChat?.alumno} />
                </div>
            </main>
        </div>
    );
};

export default MensajesPage;
