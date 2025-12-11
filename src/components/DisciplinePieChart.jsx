import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import "../styles/estadisticas.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { disciplina, cantidad } = payload[0].payload;
        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                }}
            >
                <strong>{disciplina}</strong>
                <p style={{ margin: 0, color: "#2563eb" }}>
                    {cantidad} alumno{cantidad !== 1 ? "s" : ""}
                </p>
            </div>
        );
    }
    return null;
};

const DisciplinePieChart = ({ data = [] }) => {
    const total = data.reduce((acc, cur) => acc + (cur.cantidad || 0), 0);

    return (
        <div className="chart-container">
            <h3>🏋️‍♂️ Distribución de Alumnos por Disciplina</h3>

            {data.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9ca3af", padding: "2rem" }}>
                    No hay alumnos registrados todavía
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={110}
                            innerRadius={60}
                            paddingAngle={3}
                            dataKey="cantidad"
                            nameKey="disciplina"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            formatter={(value) => (
                                <span style={{ color: "#374151", fontSize: "0.9rem" }}>
                  {value}
                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}

            {/* 🧮 Total en el centro */}
            {total > 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: "55%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        pointerEvents: "none",
                    }}
                >
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "#6b7280",
                            marginBottom: "0.1rem",
                        }}
                    >
                        Total
                    </p>
                    <p style={{ fontSize: "1.4rem", fontWeight: 600, color: "#2563eb" }}>
                        {total}
                    </p>
                </div>
            )}
        </div>
    );
};

export default DisciplinePieChart;
