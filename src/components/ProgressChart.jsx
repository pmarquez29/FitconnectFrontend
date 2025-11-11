import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "../styles/estadisticas.css";

const ProgressChart = ({ data }) => (
    <div className="chart-container">
        <h3>📅 Progreso Semanal Global</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="progreso" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default ProgressChart;
