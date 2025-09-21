import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import "../styles/dashboard.css";

const WeeklyProgressChart = ({ data }) => {
    // Transformar los datos para el formato esperado por Recharts
    const formatChartData = (rawData) => {
        if (!rawData || rawData.length === 0) return [];

        return rawData.map((item, index) => ({
            name: index + 1, // Número del día (1, 2, 3, etc.)
            entrenamientos: item.total_entrenamientos || 0,
            completados: item.entrenamientos_completados || 0,
            // Calcular un valor de "actividad" para mostrar en la gráfica
            actividad: ((item.entrenamientos_completados || 0) / Math.max(item.total_entrenamientos || 1, 1)) * 100
        }));
    };

    const chartData = formatChartData(data);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{`Día ${label}`}</p>
                    <p className="tooltip-content">
                        <span className="tooltip-value">
                            Entrenamientos: {payload[0]?.payload?.entrenamientos || 0}
                        </span>
                    </p>
                    <p className="tooltip-content">
                        <span className="tooltip-value">
                            Completados: {payload[0]?.payload?.completados || 0}
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="weekly-progress">
            <div className="section-header">
                <h2>Progreso Semanal</h2>
                <span className="chart-indicator">
                    <span className="indicator-dot"></span>
                    Actividad
                </span>
            </div>

            {chartData.length > 0 ? (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                domain={[0, 'dataMax + 20']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="actividad"
                                stroke="#22c55e"
                                strokeWidth={2}
                                fill="url(#colorGradient)"
                                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Etiquetas del eje X personalizadas */}
                    <div className="chart-labels">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                        <span>Actividad</span>
                    </div>
                </div>
            ) : (
                <div className="empty-chart">
                    <p>No hay datos de progreso disponibles</p>
                </div>
            )}
        </section>
    );
};

export default WeeklyProgressChart;