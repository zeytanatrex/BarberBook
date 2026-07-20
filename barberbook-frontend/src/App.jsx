import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Reserva from "./pages/Reserva";
import MisReservas from "./pages/MisReservas";
import Admin from "./pages/Admin";
import PanelBarbero from "./pages/PanelBarbero";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="/mis-reservas" element={<MisReservas />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/panel-barbero" element={<PanelBarbero />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;