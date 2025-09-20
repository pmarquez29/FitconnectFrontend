import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
} from "recharts";
import "../styles/dashboard.css";

const WeeklyProgressChart = ({ data }) => {
    return (
        <section className="weekly-progress">
            <h2>Progreso semanal</h2>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <defs>
                            <linearGradient id="colorCarga" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="dia" />
                        <YAxis />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="carga"
                            stroke="#2563eb"
                            fillOpacity={1}
                            fill="url(#colorCarga)"
                        />
                        <Line
                            type="monotone"
                            dataKey="carga"
                            stroke="#2563eb"
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>No hay datos de progreso</p>
            )}
        </section>
    );
};

export default WeeklyProgressChart;
