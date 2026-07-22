import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Home.css";

function LoginBarbero() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "BarberBook | Acceso Barbero";
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/barberos/login`,
      {
        correo,
        password,
      }
    );

      localStorage.setItem("barbero", JSON.stringify(res.data.barbero));
      navigate("/panel-barbero");
    } catch (error) {
      setError("Correo o contraseña incorrectos. Intenta de nuevo.");
    }
  };

  return (
    <section className="reserva-section">
      <Link to="/" className="volver-home">← Volver al inicio</Link>
      <div className="login-barbero-card">
    <h2 className="titulo-login-barbero">Acceso Barbero</h2>

        <form onSubmit={handleLogin}>
          <input
            className="select-reserva"
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
          />
          <input
            className="select-reserva"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: "16px" }}
          />

          {error && (
            <p style={{ color: "#ff4d4d", textAlign: "center", marginBottom: "12px" }}>
              {error}
            </p>
          )}

          <button className="confirmar" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginBarbero;