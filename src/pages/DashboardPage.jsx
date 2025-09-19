import { useEffect, useState } from "react";
import { getDashboard } from "../api/dashboard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import RecentActivity from "../components/RecentActivity";
import TopStudents from "../components/TopStudents";
import WeeklyProgressChart from "../components/WeeklyProgressChart";
import "../styles/layout.css";
import "../styles/dashboard.css";

const DashboardPage = () => {
    const [data, setData] = useState(null);

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

    if (!data) return <p>Cargando...</p>;

    return (
        <div className="layout">
            <Sidebar />
            <main className="content">
                <Header user={JSON.parse(localStorage.getItem("user"))} />
                <DashboardCards data={data} />
                <RecentActivity actividad={data.actividad_reciente || []} />
                <TopStudents estudiantes={data.mejor_estudiantes || []} />
                <WeeklyProgressChart data={data.progreso_semanal || []} />
            </main>
        </div>
    );
};

export default DashboardPage;
