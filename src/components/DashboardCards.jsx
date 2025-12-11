import { MdGroup, MdFitnessCenter, MdAssignment } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { Box, Typography, Paper, Stack } from "@mui/material";
import CountUp from "react-countup";
import "../styles/dashboard.css";

const DashboardCards = ({ data }) => {
    const cards = [
        {
            title: "Alumnos Activos",
            value: data?.total_alumnos || 0,
            icon: <MdGroup size={28} />,
            color: "#2563eb",
        },
        {
            title: "Rutinas Totales",
            value: data?.total_rutinas || 0,
            icon: <MdFitnessCenter size={28} />,
            color: "#16a34a",
        },
        {
            title: "Rutinas Activas",
            value: data?.rutinas_activas || 0,
            icon: <MdAssignment size={28} />,
            color: "#f59e0b",
        },
        {
            title: "Progreso Promedio",
            value: data?.progreso_promedio || 0,
            suffix: "%",
            icon: <IoStatsChart size={28} />,
            color: "#8b5cf6",
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2,
                mb: 4,
            }}
        >
            {cards.map((card, i) => (
                <Paper
                    key={i}
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        transition: "all 0.3s ease",
                        ":hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    <Box
                        sx={{
                            bgcolor: `${card.color}15`,
                            color: card.color,
                            borderRadius: 2,
                            p: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        {card.icon}
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" sx={{ color: "#64748b" }}>
                            {card.title}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: card.color }}>
                            <CountUp
                                end={parseFloat(card.value)}
                                duration={1.5}
                                separator=","
                                suffix={card.suffix || ""}
                            />
                        </Typography>
                    </Box>
                </Paper>
            ))}
        </Box>
    );
};

export default DashboardCards;
