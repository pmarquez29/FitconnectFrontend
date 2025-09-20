import NotificationBell from "./NotificationBell";
import "../styles/header.css";

const Header = ({ user }) => {
    return (
        <header className="header">
            <div></div>
            <div className="header-right">
                <NotificationBell user={user} />
                <div className="user-profile">
                    <img src={user.foto || "./assets/avatar.jpg"} alt={user.nombre} />
                    <span>{user.nombre}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
