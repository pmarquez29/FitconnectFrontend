// DashboardCards.jsx
import { useEffect, useState } from "react";
import { MdGroup, MdFitnessCenter, MdAssignment, MdTrendingUp } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import CountUp from "react-countup";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import "../styles/dashboard.css";

const DashboardCards = ({ data }) => {
    const cards = [
        { icon: MdGroup, title: "Alumnos Activos", value: data?.total_alumnos || 0, color: "#3b82f6" },
        { icon: MdFitnessCenter, title: "Rutinas Creadas", value: data?.total_rutinas || 0, color: "#10b981" },
        { icon: MdAssignment, title: "Rutinas Activas", value: data?.rutinas_activas || 0, color: "#f59e0b" },
        { icon: IoStatsChart, title: "Progreso Promedio", value: data?.dificultad_promedio_semana || 0, color: "#8b5cf6", suffix: "%" },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                mb: 4,
            }}
        >
            {cards.map((card, index) => (
                <Paper
                    key={index}
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        ":hover": { transform: "translateY(-5px)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" },
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                bgcolor: `${card.color}22`,
                                color: card.color,
                                borderRadius: 2,
                                p: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <card.icon size={30} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: "#64748b" }}>
                                {card.title}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                <CountUp end={parseFloat(card.value)} duration={1.5} separator="," suffix={card.suffix || ""} />
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            ))}
        </Box>
    );
};

export default DashboardCards;
