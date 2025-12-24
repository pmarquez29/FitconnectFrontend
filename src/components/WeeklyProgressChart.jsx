import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{ bgcolor: "#1e293b", color: "#fff", p: 1.5, borderRadius: 2, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
                <Typography variant="body2" fontWeight={600}>{`Semana: ${label}`}</Typography>
                <Typography variant="body2" sx={{ color: "#60a5fa" }}>
                    {`Progreso: ${payload[0].value}%`}
                </Typography>
            </Box>
        );
    }
    return null;
};

const WeeklyProgressChart = ({ data }) => {
    const promedio = data.length > 0
        ? (data.reduce((a, b) => a + b.progreso, 0) / data.length).toFixed(1)
        : 0;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                border: "1px solid #e2e8f0",
                height: "100%",
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp sx={{ color: "#2563eb" }} /> Rendimiento Semanal
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
                        Promedio general de cumplimiento
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#2563eb" }}>
                        {promedio}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#16a34a", fontWeight: 600, bgcolor: "#dcfce7", px: 1, py: 0.5, borderRadius: 1 }}>
                        + Promedio General
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 300 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="semana"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="progreso"
                                stroke="#2563eb"
                                strokeWidth={3}
                                fill="url(#colorProgress)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <Box sx={{ height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: "#94a3b8" }}>No hay datos suficientes</Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default WeeklyProgressChart;