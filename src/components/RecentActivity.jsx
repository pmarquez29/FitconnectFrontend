import { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, Typography, Box, Avatar, TablePagination
} from "@mui/material";
import { CheckCircle, HourglassBottom, ErrorOutline, PendingActions, AccessTime } from "@mui/icons-material";

const statusStyles = {
    completado: { color: "#166534", bg: "#dcfce7", icon: <CheckCircle style={{ fontSize: 16 }} /> },
    pendiente: { color: "#854d0e", bg: "#fef9c3", icon: <PendingActions style={{ fontSize: 16 }} /> },
    activa: { color: "#1e40af", bg: "#dbeafe", icon: <HourglassBottom style={{ fontSize: 16 }} /> },
    inactiva: { color: "#991b1b", bg: "#fee2e2", icon: <ErrorOutline style={{ fontSize: 16 }} /> },
};

const RecentActivity = ({ actividad }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const getStatus = (estado) => statusStyles[estado?.toLowerCase()] || statusStyles.pendiente;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const currentRows = actividad ? actividad.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : [];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0,
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                overflow: "hidden"
            }}
        >
            <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ color: "#2563eb" }} /> Actividad Reciente
                </Typography>
                <Chip label={`${actividad?.length || 0} Registros`} size="small" sx={{ bgcolor: "#f1f5f9", fontWeight: 600 }} />
            </Box>

            {actividad?.length > 0 ? (
                <>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                    <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>ALUMNO</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>RUTINA</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>ESTADO</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>FECHA</TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: "#64748b", py: 2 }}>HORA</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentRows.map((item, i) => {
                                    const s = getStatus(item.estado);
                                    const date = item.fecha_asignacion ? new Date(item.fecha_asignacion) : null;

                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{
                                                "&:hover": { backgroundColor: "#f8fafc" },
                                                transition: "background-color 0.2s",
                                                borderBottom: "1px solid #f1f5f9"
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    {/* ✅ AVATAR CON FOTO */}
                                                    <Avatar
                                                        src={item.foto}
                                                        alt={item.alumno}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: "#eff6ff",
                                                            color: "#2563eb",
                                                            fontSize: "0.85rem",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        {item.alumno?.[0] || "?"}
                                                    </Avatar>
                                                    <Typography variant="body2" fontWeight={600} color="#334155">
                                                        {item.alumno}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="#475569">{item.rutina}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={s.icon}
                                                    label={item.estado?.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: s.bg,
                                                        color: s.color,
                                                        fontWeight: 700,
                                                        fontSize: "0.7rem",
                                                        border: `1px solid ${s.color}20`,
                                                        height: 24
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: "#64748b" }}>{date ? date.toLocaleDateString("es-ES") : "—"}</TableCell>
                                            <TableCell sx={{ color: "#64748b", fontFamily: 'monospace' }}>
                                                {date ? date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "—"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={actividad.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </>
            ) : (
                <Box sx={{ textAlign: "center", py: 8, color: "#9ca3af" }}>
                    <PendingActions sx={{ fontSize: 50, mb: 2, color: "#e2e8f0" }} />
                    <Typography variant="body1" fontWeight={500}>No hay actividad reciente</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default RecentActivity;