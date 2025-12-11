import "../styles/perfil.css";
import { FaEnvelope, FaPhone, FaDumbbell, FaVenusMars } from "react-icons/fa";

const PerfilHeader = ({ alumno }) => {
    const usuario = alumno?.Usuario || alumno;

    const imgSrc = usuario?.foto
        ? `data:image/jpeg;base64,${btoa(
            new Uint8Array(usuario.foto.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
            )
        )}`
        : "/assets/avatar.png";

    const disciplina = usuario?.Disciplina?.nombre || "No asignada";
    const edad = alumno?.edad ? `${alumno.edad} años` : "—";

    return (
        <div className="perfil-header nuevo">
            <img src={imgSrc} alt={`${usuario?.nombre} ${usuario?.apellido}`} className="perfil-avatar grande" />

            <div className="perfil-header-info">
                <h2>{usuario?.nombre} {usuario?.apellido}</h2>
                <p className="disciplina"><FaDumbbell /> {disciplina}</p>

                <div className="perfil-mini-datos">
                    <p><FaEnvelope /> {usuario?.email}</p>
                    <p><FaPhone /> {usuario?.telefono || "No registrado"}</p>
                    <p><FaVenusMars /> {usuario?.genero || "—"} · {edad}</p>
                </div>
            </div>
        </div>
    );
};

export default PerfilHeader;
