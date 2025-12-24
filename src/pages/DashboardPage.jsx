import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";
import TopStudents from "../components/TopStudents";
import WeeklyProgressChart from "../components/WeeklyProgressChart";
import { Grid, Box, CircularProgress, Container } from "@mui/material";
import "../styles/dashboard.css";

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const dashboardData = await getDashboard();
                setData(dashboardData);
            } catch (err) {
                console.error("❌ Error cargando dashboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading)
        return (
            <Box className="loading-container">
                <CircularProgress size={60} thickness={4} sx={{ color: "#2563eb" }} />
            </Box>
        );

    return (
        <div className="layout">
            <Sidebar
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            <main className="content">
                <Header />
                <br/>
                <Box sx={{ pb: 4, maxWidth: '1600px', margin: '0 auto' }}>
                    {/* 1. Tarjetas de Resumen (KPIs) */}
                    <Box sx={{ mb: 4 }}>
                        <DashboardCards data={data} />
                    </Box>

                    <RecentActivity actividad={data?.actividad_reciente || []} />
                    <br/>
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} lg={8}>
                            <WeeklyProgressChart data={data?.progreso_semanal || []} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <TopStudents estudiantes={data?.mejor_estudiantes || []} />
                        </Grid>
                    </Grid>


                </Box>
            </main>
        </div>
    );
};

export default DashboardPage;