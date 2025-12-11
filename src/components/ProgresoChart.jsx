import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import "../styles/perfil.css";

const ProgresoChart = ({ data }) => {
    // Si no hay datos, mostrar mensaje
    if (!data || data.length === 0) {
        return (
            <div className="progreso-chart vacio">
                <h3>📈 Progreso Diario</h3>
                <p style={{textAlign: "center", color: "#64748b", marginTop: "2rem"}}>
                    Aún no hay registros de entrenamiento.
                </p>
            </div>
        );
    }

    return (
        <div className="progreso-chart">
            <h3>📈 Cumplimiento de Rutina (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="fecha"
                        tick={{fontSize: 12, fill: '#64748b'}}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                    />
                    <YAxis
                        tick={{fontSize: 12, fill: '#64748b'}}
                        domain={[0, 100]} // Forzar escala de 0 a 100%
                        unit="%"
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value, name) => [
                            name === "progreso" ? `${value}%` : value,
                            name === "progreso" ? "Cumplimiento" : "Ejercicios"
                        ]}
                    />
                    <Legend />

                    {/* Línea de Progreso (Porcentaje) */}
                    <Line
                        type="monotone"
                        dataKey="progreso"
                        name="progreso"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#2563eb", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProgresoChart;