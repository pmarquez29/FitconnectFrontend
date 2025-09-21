import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip
} from "@mui/material";

const TopStudents = ({ estudiantes }) => {
    if (!estudiantes || estudiantes.length === 0) {
        return <p style={{ padding: "1rem" }}>No hay estudiantes registrados</p>;
    }

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell align="center">Entrenamientos</TableCell>
                        <TableCell align="center">Progreso</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {estudiantes.map((est, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{est.nombre} {est.apellido || ""}</TableCell>
                            <TableCell align="center">{est.total_entrenamientos || 0}</TableCell>
                            <TableCell align="center">
                                <Chip
                                    label={`${typeof est.promedio_series === "number" ? est.promedio_series.toFixed(1) : 0}%`}
                                    color={est.promedio_series >= 0 ? "success" : "error"}
                                    variant="outlined"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TopStudents;
