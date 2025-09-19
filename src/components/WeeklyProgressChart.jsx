import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/dashboard.css";

const WeeklyProgressChart = ({ data }) => {
    return (
        <section className="weekly-progress">
            <h2>Progreso semanal</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="carga" stroke="#2563eb" />
                </LineChart>
            </ResponsiveContainer>
        </section>
    );
};

export default WeeklyProgressChart;
