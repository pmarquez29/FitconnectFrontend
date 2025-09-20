import { markAsRead } from "../api/notifications";
import "../styles/notifications.css";

const NotificationList = ({ notifications, onClose }) => {
    const handleClick = async (notif) => {
        try {
            await markAsRead(notif.id);
        } catch (err) {
            console.error("Error al marcar como leída", err);
        }
        onClose();
        // Aquí podrías redirigir según el tipo de notificación
        // if (notif.tipo === "mensaje") navigate("/mensajes");
    };

    return (
        <div className="notification-list">
            <div className="notification-header">
                <h4>Notificaciones</h4>
                <button onClick={onClose}>✖</button>
            </div>
            <ul>
                {notifications.length === 0 && <li>No tienes notificaciones</li>}
                {notifications.map((n) => (
                    <li
                        key={n.id}
                        className={!n.leida ? "unread" : ""}
                        onClick={() => handleClick(n)}
                    >
                        <p>{n.mensaje}</p>
                        <span>{new Date(n.fecha).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationList;
