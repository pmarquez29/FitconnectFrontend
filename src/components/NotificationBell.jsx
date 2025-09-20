import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getNotifications } from "../api/notifications";
import NotificationList from "./NotificationList";
import "../styles/notifications.css";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:4000");

const NotificationBell = ({ user }) => {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const unreadCount = notifications.filter((n) => !n.leida).length;

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            console.error("Error cargando notificaciones", err);
        }
    };

    useEffect(() => {
        loadNotifications();

        socket.emit("joinNotifications", user.id);

        socket.on("notification", (notif) => {
            setNotifications((prev) => [notif, ...prev]);
        });

        return () => {
            socket.off("notification");
        };
    }, [user.id]);

    return (
        <div className="notification-wrapper">
            <button className="notification-bell" onClick={() => setOpen(!open)}>
                🔔
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            {open && (
                <NotificationList notifications={notifications} onClose={() => setOpen(false)} />
            )}
        </div>
    );
};

export default NotificationBell;
