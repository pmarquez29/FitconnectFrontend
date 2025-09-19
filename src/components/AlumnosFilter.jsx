import "../styles/alumnos.css";

const AlumnosFilter = ({ disciplinas, selected, onSelect }) => {
    return (
        <div className="alumnos-filter">
            <button
                className={selected === "Todos" ? "active" : ""}
                onClick={() => onSelect("Todos")}
            >
                Todos
            </button>
            {disciplinas.map((d, i) => (
                <button
                    key={i}
                    className={selected === d ? "active" : ""}
                    onClick={() => onSelect(d)}
                >
                    {d}
                </button>
            ))}
        </div>
    );
};

export default AlumnosFilter;
