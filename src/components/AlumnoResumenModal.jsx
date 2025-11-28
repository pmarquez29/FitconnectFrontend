import { Modal, Button } from "react-bootstrap";

const AlumnoResumenModal = ({ show, onHide, alumno }) => {
    if (!alumno) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title>Perfil de {alumno.nombre}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center mb-3">
                    {alumno.foto ? (
                        <img
                            src={alumno.foto}
                            alt="Foto"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid #eee",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: "50%",
                                background: "#f1f1f1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                fontSize: 40,
                            }}
                        >
                            👤
                        </div>
                    )}
                </div>

                <h4 className="text-center">
                    {alumno.nombre} {alumno.apellido}
                </h4>

                <p className="text-center text-muted mb-4">
                    {alumno.disciplina}
                </p>

                <hr />

                <p><strong>Email:</strong> {alumno.email}</p>
                <p><strong>Teléfono:</strong> {alumno.telefono || "N/A"}</p>
                <p><strong>Objetivo:</strong> {alumno.objetivo || "No definido"}</p>
                <p><strong>Experiencia:</strong> {alumno.nivel_experiencia}</p>
                <p><strong>Último acceso:</strong>
                    {alumno.ultimo_acceso ?
                        new Date(alumno.ultimo_acceso).toLocaleString("es-ES") :
                        "Sin registros"}
                </p>

                <p>
                    <strong>Progreso actual:</strong> {alumno.progreso}%
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AlumnoResumenModal;
