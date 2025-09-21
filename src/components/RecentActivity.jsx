import { styled } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import "../styles/dashboard.css";

// Styled components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    borderRadius: 16,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    marginTop: 16,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    '& .MuiTableCell-head': {
        backgroundColor: '#f8fafc',
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#64748b',
        borderBottom: 'none',
        padding: '16px',
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#f8fafc',
    },
    '& .MuiTableCell-root': {
        borderBottom: '1px solid #f1f5f9',
        padding: '16px',
    }
}));

const StatusChip = styled(Chip)(({ status }) => ({
    fontSize: '0.75rem',
    fontWeight: 500,
    height: 24,
    ...(status === 'completado' && {
        backgroundColor: '#dcfce7',
        color: '#16a34a',
    }),
    ...(status === 'pendiente' && {
        backgroundColor: '#fef3c7',
        color: '#d97706',
    }),
    ...(status === 'activa' && {
        backgroundColor: '#dbeafe',
        color: '#2563eb',
    }),
}));

const RecentActivity = ({ actividad }) => {
    const getStatusLabel = (estado) => {
        const statusMap = {
            'activa': 'completado',
            'completada': 'completado',
            'pendiente': 'pendiente',
            'inactiva': 'pendiente'
        };
        return statusMap[estado?.toLowerCase()] || 'pendiente';
    };

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                Actividad Reciente
            </Typography>

            {actividad && actividad.length > 0 ? (
                <StyledTableContainer component={Paper}>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <TableCell>Actividad Reciente</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Rutina</TableCell>
                                <TableCell>Carga (Kg)</TableCell>
                                <TableCell>Fecha Completada</TableCell>
                                <TableCell>Hora</TableCell>
                                <TableCell width={60}></TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {actividad.map((item, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {item.alumno || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <StatusChip
                                            label={getStatusLabel(item.estado).toUpperCase()}
                                            status={getStatusLabel(item.estado)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {item.rutina || 'Sin rutina'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            60 {/* Placeholder */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.fecha_asignacion ?
                                                new Date(item.fecha_asignacion).toLocaleDateString('es-ES') :
                                                'N/A'
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.fecha_asignacion ?
                                                new Date(item.fecha_asignacion).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }) :
                                                'N/A'
                                            }
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" sx={{ color: '#64748b' }}>
                                            <MoreVert fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            ) : (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        border: '1px solid #e5e7eb'
                    }}
                >
                    <Typography color="text.secondary">
                        No hay actividad reciente
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default RecentActivity;