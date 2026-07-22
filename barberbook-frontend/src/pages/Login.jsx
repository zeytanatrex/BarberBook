import { useEffect, useState } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login(){
const [mostrarPassword, setMostrarPassword] = useState(false);
const navigate = useNavigate();
useEffect(() => {
  document.title = "BarberBook | Login";
}, []);
return(
    <section id="login" className="login-section">
    <div className="auth-card">
    <h2>Iniciar sesión</h2>
    <p>Accede a tu cuenta para reservar tu cita</p>

    <input id="correo" placeholder="📧 Correo" />

    <div className="password-container">
  <input
    id="password"
    type={mostrarPassword ? "text" : "password"}
    placeholder="🔒 Contraseña"
    style={{
      width: "100%",
      paddingRight: "50px",
      boxSizing: "border-box"
    }}
  />
  <span
    onClick={() => setMostrarPassword(!mostrarPassword)}
    className="toggle-password"
  >
    {mostrarPassword ? "Ocultar" : "Ver"}
  </span>
</div>
    <button
    onClick={async () => {
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    if (!correo || !password) {
      alert("⚠️ Completa todos los campos");
      return;
    }

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/usuarios/login`,
        {
          correo,
          password,
        }
      );
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));

      alert("✅ Login correcto");

      if (respuesta.data.usuario.rol === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(
      error.response?.data?.mensaje ||
      "❌ Error al iniciar sesión"
      );
    }
  }}
>
  Ingresar
</button>
<button
style={{
  background: "transparent",
  border: "2px solid #d4af37",
  color: "#d4af37",
  marginTop: "10px"
}}
onClick={async () => {
  const correo = document.getElementById("correo").value;

  if (!correo) {
    alert("Ingresa tu correo");
    return;
  }

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/usuarios/reenviar-verificacion`,
      { correo }
    );

    alert("✅ Correo de verificación enviado");
  } catch (error) {
    alert("❌ Error al reenviar correo");
  }
}}
>
  Reenviar verificación
</button>
    <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
    <Link to="/" className="volver-home">← Volver al inicio</Link>
    </div>
    </section>);}
    export default Login;