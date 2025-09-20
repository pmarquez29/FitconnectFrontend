import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "../styles/perfil.css";

const ComparativoRutinas = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="comparativo-rutinas">
                <h3>Comparativo de Rutinas</h3>
                <p>No hay datos suficientes para comparar rutinas.</p>
            </div>
        );
    }

    return (
        <div className="comparativo-rutinas">
            <h3>Comparativo de Rutinas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rutina" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progreso" fill="#2563eb" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ComparativoRutinas;
