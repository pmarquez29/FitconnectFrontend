import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";
import TopStudents from "../components/TopStudents";
import WeeklyProgressChart from "../components/WeeklyProgressChart";
import { Grid, Paper, Typography } from "@mui/material";
import "../styles/layout.css";
import "../styles/dashboard.css";

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const dashboardData = await getDashboard();
                setData(dashboardData);
            } catch (err) {
                console.error("Error cargando dashboard", err);
            }
        };
        fetchDashboard();
    }, []);



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

                <DashboardCards data={data} />
                <RecentActivity actividad={data?.actividad_reciente || []} />

                {/* Mejores alumnos y progreso semanal */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Mejores Alumnos
                            </Typography>
                            <TopStudents estudiantes={data?.mejor_estudiantes || []} />
                        </Paper>
                    </Grid>

                    <Grid >
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Progreso Semanal
                            </Typography>
                            <WeeklyProgressChart data={data?.progreso_semanal || []} />
                        </Paper>
                    </Grid>
                </Grid>
            </main>
        </div>
    );
};

export default DashboardPage;
