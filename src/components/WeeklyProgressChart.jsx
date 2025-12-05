// WeeklyProgressChart.jsx
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Box, Typography, Paper } from "@mui/material";

const WeeklyProgressChart = ({ data }) => {
    const chartData = data?.map((d, i) => ({
        name: `Sem ${i + 1}`,
        entrenamientos: d.total_entrenamientos,
        completados: d.entrenamientos_completados,
        actividad: (d.entrenamientos_completados / (d.total_entrenamientos || 1)) * 100
    })) || [];

    const avg = chartData.length ?
        (chartData.reduce((sum, d) => sum + d.actividad, 0) / chartData.length).toFixed(1) :
        0;

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Progreso Semanal
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                Promedio de actividad: <strong>{avg}%</strong>
            </Typography>

            {chartData.length ? (
                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                            <YAxis tick={{ fill: "#6b7280" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    borderRadius: 8,
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="actividad"
                                stroke="#10b981"
                                fill="url(#colorGreen)"
                                strokeWidth={2}
                                dot={{ fill: "#10b981" }}
                                activeDot={{ r: 6 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            ) : (
                <Typography align="center" sx={{ color: "#9ca3af", py: 4 }}>
                    No hay datos de progreso disponibles
                </Typography>
            )}
        </Paper>
    );
};

export default WeeklyProgressChart;
