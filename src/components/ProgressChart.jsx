import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
} from "recharts";
import "../styles/estadisticas.css";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
            >
                <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
                <p style={{ margin: 0, color: "#2563eb" }}>
                    Progreso: <strong>{payload[0].value}%</strong>
                </p>
            </div>
        );
    }
    return null;
};

const ProgressChart = ({ data = [] }) => {
    // Calculamos promedio global (para la línea de referencia)
    const avg =
        data.length > 0
            ? (
                data.reduce((acc, cur) => acc + (parseFloat(cur.progreso) || 0), 0) /
                data.length
            ).toFixed(1)
            : 0;

    return (
        <div className="chart-container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>📅 Progreso Semanal Global</h3>
                <span
                    style={{
                        fontSize: "0.9rem",
                        color: "#6b7280",
                        fontWeight: 500,
                    }}
                >
          Promedio general:{" "}
                    <strong style={{ color: "#2563eb" }}>{avg}%</strong>
        </span>
            </div>

            {data.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                    No hay registros de progreso aún 📉
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="semana"
                            tick={{ fill: "#4b5563", fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 100]}
                            tick={{ fill: "#4b5563", fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            label={{
                                value: "Progreso (%)",
                                angle: -90,
                                position: "insideLeft",
                                offset: 10,
                                fill: "#6b7280",
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <ReferenceLine
                            y={avg}
                            label={{
                                value: `Media: ${avg}%`,
                                position: "right",
                                fill: "#2563eb",
                                fontSize: 12,
                            }}
                            stroke="#2563eb"
                            strokeDasharray="4 4"
                        />
                        <Line
                            type="monotone"
                            dataKey="progreso"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 5, strokeWidth: 2, stroke: "#2563eb", fill: "#fff" }}
                            activeDot={{ r: 7 }}
                            name="Progreso semanal"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default ProgressChart;
