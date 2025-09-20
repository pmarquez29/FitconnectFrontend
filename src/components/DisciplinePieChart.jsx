import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/estadisticas.css";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#9333ea"];

const DisciplinePieChart = ({ data }) => {
    return (
        <div className="chart-container">
            <h3>Distribución de Alumnos por Disciplina</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="cantidad"
                        nameKey="disciplina"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DisciplinePieChart;
