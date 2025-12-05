// TopStudents.jsx
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, LinearProgress, Box
} from "@mui/material";

const medal = (idx) => {
    const colors = ["#facc15", "#9ca3af", "#f97316"];
    return idx < 3 ? (
        <span style={{
            fontSize: "1.2rem",
            marginRight: "8px",
            color: colors[idx],
        }}>
      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
    </span>
    ) : null;
};

const TopStudents = ({ estudiantes }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                transition: "0.3s ease all",
                mb: 3,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Mejores Alumnos
            </Typography>

            {(!estudiantes || estudiantes.length === 0) ? (
                <Typography align="center" sx={{ color: "#9ca3af", py: 6 }}>
                    No hay estudiantes registrados
                </Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: "#f8fafc" }}>
                                <TableCell>Alumno</TableCell>
                                <TableCell align="center">Entrenamientos</TableCell>
                                <TableCell align="center" sx={{ width: "40%" }}>Progreso</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {estudiantes.map((est, idx) => {
                                const progreso = parseFloat(est.promedio_series) || 0;
                                const color = progreso >= 70 ? "success" : progreso >= 50 ? "warning" : "error";

                                return (
                                    <TableRow
                                        key={idx}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#fcfcfc" },
                                            "&:hover": { backgroundColor: "#f9fafb" },
                                            transition: "0.2s ease",
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {medal(idx)}
                                            {est.nombre} {est.apellido}
                                        </TableCell>
                                        <TableCell align="center">{est.total_entrenamientos}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progreso}
                                                    color={color}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 5,
                                                        width: "100%",
                                                        flexGrow: 1,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    sx={{ minWidth: 40, fontWeight: 600, color: "#374151" }}
                                                >
                                                    {progreso.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
};

export default TopStudents;
