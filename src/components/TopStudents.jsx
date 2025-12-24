import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, LinearProgress, Avatar, Tooltip
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Oro, Plata, Bronce

const TopStudents = ({ estudiantes }) => (
    <Paper
        elevation={0}
        sx={{
            p: 0,
            borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
            height: "100%", // Para que ocupe el mismo alto que la gráfica
            display: "flex",
            flexDirection: "column"
        }}
    >
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: "#f59e0b" }} /> Mejores Alumnos
            </Typography>
        </Box>

        {!estudiantes?.length ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                <Typography align="center" sx={{ color: "#9ca3af" }}>
                    Sin datos registrados
                </Typography>
            </Box>
        ) : (
            <TableContainer sx={{ px: 0 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3, color: "#64748b", fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>ALUMNO</TableCell>
                            <TableCell align="center" sx={{ color: "#64748b", fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}>PROGRESO</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {estudiantes.map((est, i) => {
                            const progreso = parseFloat(est.promedio_series) || 0;
                            const color = progreso >= 80 ? "success" : progreso >= 50 ? "primary" : "warning";

                            return (
                                <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell sx={{ pl: 3, py: 2 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Box sx={{ position: "relative" }}>
                                                <Avatar
                                                    src={est.foto} // Si tienes foto, úsala
                                                    sx={{ width: 36, height: 36, bgcolor: i < 3 ? `${medalColors[i]}20` : "#f1f5f9", color: "#334155", fontWeight: "bold", border: i < 3 ? `2px solid ${medalColors[i]}` : "none" }}
                                                >
                                                    {est.nombre[0]}
                                                </Avatar>
                                                {i < 3 && (
                                                    <Box sx={{ position: "absolute", top: -5, right: -5, fontSize: "0.8rem" }}>
                                                        {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" fontWeight={700} color="#1e293b">
                                                    {est.nombre} {est.apellido}
                                                </Typography>
                                                <Typography variant="caption" color="#64748b">
                                                    {est.total_entrenamientos} entrenamientos
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 2, pr: 3 }}>
                                        <Tooltip title={`${progreso}% Completado`}>
                                            <Box sx={{ width: "100%", minWidth: 80 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                    <Typography variant="caption" fontWeight={700} color={color + ".main"}>
                                                        {progreso.toFixed(0)}%
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progreso}
                                                    color={color}
                                                    sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9" }}
                                                />
                                            </Box>
                                        </Tooltip>
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