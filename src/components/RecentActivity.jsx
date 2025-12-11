// ✅ RecentActivity.jsx mejorado
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Typography, Box, Avatar
} from "@mui/material";
import { CheckCircle, HourglassBottom, ErrorOutline, PendingActions } from "@mui/icons-material";

const statusStyles = {
    completado: { color: "#16a34a", bg: "#dcfce7", icon: <CheckCircle fontSize="small" /> },
    pendiente: { color: "#f59e0b", bg: "#fef3c7", icon: <PendingActions fontSize="small" /> },
    activa: { color: "#2563eb", bg: "#dbeafe", icon: <HourglassBottom fontSize="small" /> },
    inactiva: { color: "#dc2626", bg: "#fee2e2", icon: <ErrorOutline fontSize="small" /> },
};

const RecentActivity = ({ actividad }) => {
    const getStatus = (estado) => statusStyles[estado?.toLowerCase()] || statusStyles.pendiente;

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 4,
                mb: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#2563eb" }}>
                Actividad Reciente
            </Typography>

            {actividad?.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: "#f1f5f9" }}>
                                <TableCell sx={{ fontWeight: 600 }}>Alumno</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rutina</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Hora</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actividad.map((item, i) => {
                                const s = getStatus(item.estado);
                                const date = item.fecha_asignacion
                                    ? new Date(item.fecha_asignacion)
                                    : null;

                                return (
                                    <TableRow
                                        key={i}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                                            "&:hover": { backgroundColor: "#f0f9ff" },
                                            transition: "0.2s ease",
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500, display: "flex", alignItems: "center", gap: 1 }}>
                                            <Avatar sx={{ width: 30, height: 30, bgcolor: "#e0f2fe", color: "#0369a1", fontSize: "0.9rem" }}>
                                                {item.alumno[0]}
                                            </Avatar>
                                            {item.alumno}
                                        </TableCell>
                                        <TableCell>{item.rutina}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={s.icon}
                                                label={item.estado?.toUpperCase()}
                                                sx={{
                                                    backgroundColor: s.bg,
                                                    color: s.color,
                                                    fontWeight: 600,
                                                    fontSize: "0.8rem",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{date ? date.toLocaleDateString("es-ES") : "—"}</TableCell>
                                        <TableCell>{date ? date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "—"}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box sx={{ textAlign: "center", py: 5, color: "#9ca3af" }}>
                    <PendingActions sx={{ fontSize: 48, mb: 1, color: "#cbd5e1" }} />
                    <Typography>No hay actividad reciente</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RecentActivity;
