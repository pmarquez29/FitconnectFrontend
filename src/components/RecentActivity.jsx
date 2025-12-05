// RecentActivity.jsx
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Typography, Box
} from "@mui/material";
import { CheckCircle, PendingActions, ErrorOutline } from "@mui/icons-material";

const statusStyles = {
    completado: { color: "#16a34a", background: "#dcfce7", icon: <CheckCircle fontSize="small" /> },
    pendiente: { color: "#d97706", background: "#fef3c7", icon: <PendingActions fontSize="small" /> },
    activa: { color: "#2563eb", background: "#dbeafe", icon: <PendingActions fontSize="small" /> },
    inactiva: { color: "#dc2626", background: "#fee2e2", icon: <ErrorOutline fontSize="small" /> }
};

const RecentActivity = ({ actividad }) => {
    const getStatus = (estado) => {
        const key = estado?.toLowerCase();
        return statusStyles[key] || statusStyles["pendiente"];
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3,
                mb: 3,
                transition: "0.3s ease all",
            }}
        >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Actividad Reciente
            </Typography>

            {actividad && actividad.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: "#f8fafc" }}>
                                <TableCell>Alumno</TableCell>
                                <TableCell>Rutina</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Hora</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {actividad.map((item, index) => {
                                const status = getStatus(item.estado);
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#fcfcfc" },
                                            "&:hover": { backgroundColor: "#f9fafb" },
                                            transition: "0.2s ease",
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{item.alumno}</TableCell>
                                        <TableCell>{item.rutina}</TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={status.icon}
                                                label={item.estado?.toUpperCase() || "PENDIENTE"}
                                                sx={{
                                                    color: status.color,
                                                    backgroundColor: status.background,
                                                    fontWeight: 600,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.fecha_asignacion
                                                ? new Date(item.fecha_asignacion).toLocaleDateString("es-ES")
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            {item.fecha_asignacion
                                                ? new Date(item.fecha_asignacion).toLocaleTimeString("es-ES", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })
                                                : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "#9ca3af",
                    }}
                >
                    <PendingActions sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                    <Typography>No hay actividad reciente</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RecentActivity;
