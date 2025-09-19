import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// más páginas aquí (Dashboard, etc.)

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<h1>Dashboard (ejemplo)</h1>} />
            </Routes>
        </Router>
    );
}

export default App;
