import "../styles/perfil.css";

const PerfilHeader = ({ alumno }) => {
    return (
        <div className="perfil-header">
            <img src={alumno.foto || "/assets/avatar.png"} alt={alumno.nombre} />
            <div>
                <h1>{alumno.nombre} {alumno.apellido}</h1>
                <p>{alumno.disciplina}</p>
            </div>
        </div>
    );
};

export default PerfilHeader;
