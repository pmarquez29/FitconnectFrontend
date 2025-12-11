// ✅ TopStudents.jsx mejorado
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, LinearProgress, Avatar
} from "@mui/material";

const medal = (idx) => ["🥇", "🥈", "🥉"][idx] || "";

const TopStudents = ({ estudiantes }) => (
    <Paper
        elevation={3}
        sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            background: "linear-gradient(180deg, #ffffff 0%, #fafafa 100%)",
        }}
    >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#2563eb" }}>
            Mejores Alumnos
        </Typography>

        {!estudiantes?.length ? (
            <Typography align="center" sx={{ color: "#9ca3af", py: 5 }}>
                No hay estudiantes registrados
            </Typography>
        ) : (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ background: "#f1f5f9" }}>
                            <TableCell>Alumno</TableCell>
                            <TableCell align="center">Entrenamientos</TableCell>
                            <TableCell align="center" sx={{ width: "40%" }}>Progreso</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {estudiantes.map((est, i) => {
                            const progreso = parseFloat(est.promedio_series) || 0;
                            const color =
                                progreso >= 90 ? "success" :
                                    progreso >= 70 ? "primary" :
                                        progreso >= 50 ? "warning" : "error";
                            return (
                                <TableRow
                                    key={i}
                                    sx={{
                                        "&:hover": { background: "#f8fafc" },
                                        transition: "0.2s ease",
                                    }}
                                >
                                    <TableCell sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#e0f2fe", color: "#0369a1", fontSize: "0.9rem" }}>
                                            {est.nombre[0]}
                                        </Avatar>
                                        {medal(i)} {est.nombre} {est.apellido}
                                    </TableCell>
                                    <TableCell align="center">{est.total_entrenamientos}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={progreso}
                                                color={color}
                                                sx={{ height: 10, borderRadius: 5, width: "100%" }}
                                            />
                                            <Typography sx={{ minWidth: 45, fontWeight: 600, color: "#334155" }}>
                                                {progreso.toFixed(0)}%
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

export default TopStudents;
