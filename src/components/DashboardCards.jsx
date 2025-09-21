import {
    MdGroup,
    MdFitnessCenter,
    MdAssignment,
    MdTrendingUp
} from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import "../styles/dashboard.css";

const DashboardCards = ({ data }) => {
    const cards = [
        {
            icon: MdGroup,
            title: "Alumnos Activos",
            value: data?.total_alumnos || 0,
            color: "blue",
            trend: null
        },
        {
            icon: MdFitnessCenter,
            title: "Rutinas Creadas",
            value: data?.total_rutinas || 0,
            color: "green",
            trend: null
        },
        {
            icon: MdAssignment,
            title: "Pendientes",
            value: data?.rutinas_activas || 0,
            color: "orange",
            trend: null
        },
        {
            icon: IoStatsChart,
            title: "Progreso Promedio",
            value: "53%", // Valor hardcodeado por ahora, después se calculará
            color: "purple",
            trend: "+5.2%"
        },
    ];

    return (
        <div className="dashboard-cards">
            {cards.map((card, index) => (
                <div className={`dashboard-card ${card.color}`} key={index}>
                    <div className="card-content">
                        <div className="card-icon">
                            <card.icon className="icon" size={32} />
                        </div>
                        <div className="card-info">
                            <h3 className="card-title">{card.title}</h3>
                            <div className="card-value-container">
                                <span className="card-value">{card.value}</span>
                                {card.trend && (
                                    <span className={`card-trend ${card.trend.includes('+') ? 'positive' : 'negative'}`}>
                                        <MdTrendingUp size={16} />
                                        {card.trend}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardCards;