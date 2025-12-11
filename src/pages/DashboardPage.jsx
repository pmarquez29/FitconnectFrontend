import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";
import TopStudents from "../components/TopStudents";
import WeeklyProgressChart from "../components/WeeklyProgressChart";
import { Grid, Box, CircularProgress } from "@mui/material";
import "../styles/layout.css";
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
                <CircularProgress color="primary" />
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

                {/* Tarjetas de resumen */}
                <DashboardCards data={data} />
                <RecentActivity actividad={data?.actividad_reciente || []} />

                <Grid container columns={2} spacing={2} >
                        <WeeklyProgressChart data={data?.progreso_semanal || []} />
                        <TopStudents estudiantes={data?.mejor_estudiantes || []} />
                </Grid>
            </main>
        </div>
    );
};

export default DashboardPage;
