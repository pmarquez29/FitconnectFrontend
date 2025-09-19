import "../styles/rutinas.css";

const RutinaCard = ({ rutina, onClick }) => {
    return (
        <div className="rutina-card" onClick={() => onClick(rutina.id)}>
            <img
                src={rutina.imagen || "/assets/default-rutina.jpg"}
                alt={rutina.nombre}
                className="rutina-img"
            />
            <div className="rutina-info">
                <h3>{rutina.nombre}</h3>
                <p>{rutina.descripcion || "Sin descripción"}</p>
            </div>
        </div>
    );
};

export default RutinaCard;
