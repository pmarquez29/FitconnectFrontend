import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const WeeklyProgressChart = ({ data }) => {
    const promedio =
        data.length > 0
            ? (data.reduce((a, b) => a + b.progreso, 0) / data.length).toFixed(1)
            : 0;

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                📈 Progreso Semanal
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                Promedio general: <strong>{promedio}%</strong>
            </Typography>

            {data.length > 0 ? (
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="semana" tick={{ fill: "#6b7280" }} />
                            <YAxis tick={{ fill: "#6b7280" }} />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <Area
                                type="monotone"
                                dataKey="progreso"
                                stroke="#2563eb"
                                fill="url(#colorProgress)"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "#2563eb" }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            ) : (
                <Typography align="center" sx={{ color: "#9ca3af", py: 5 }}>
                    No hay datos suficientes para mostrar el progreso semanal.
                </Typography>
            )}
        </Paper>
    );
};

export default WeeklyProgressChart;
