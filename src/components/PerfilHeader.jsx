import "../styles/perfil.css";
import { FaEnvelope, FaPhone, FaDumbbell, FaVenusMars } from "react-icons/fa";

const PerfilHeader = ({ alumno }) => {
    // Intentamos obtener los datos ya sea del objeto plano o anidado en Usuario
    const usuario = alumno?.Usuario || alumno;

    // ✅ LÓGICA DE FOTO SIMPLIFICADA
    // El backend ya envía la foto convertida a Base64 string, así que la usamos directo.
    const getAvatarSrc = () => {
        if (!usuario?.foto) return "/assets/avatar.png";

        // Si ya es un string (Base64 o URL), úsalo
        if (typeof usuario.foto === 'string') {
            return usuario.foto;
        }

        // Fallback por si acaso llega algo raro
        return "/assets/avatar.png";
    };

    const disciplina = usuario?.disciplina || usuario?.Disciplina?.nombre || "No asignada";
    const edad = alumno?.edad ? `${alumno.edad} años` : "—";

    return (
        <div className="perfil-header nuevo">
            <img
                src={getAvatarSrc()}
                alt={`${usuario?.nombre} ${usuario?.apellido}`}
                className="perfil-avatar grande"
                onError={(e) => e.target.src = "/assets/avatar.png"} // Protección extra
            />

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