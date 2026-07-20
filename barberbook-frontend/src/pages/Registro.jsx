import "../styles/Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Registro() {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "BarberBook | Registro";
  }, []);

  return (
    <section id="registro" className="login-section">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <p>Regístrate para reservar tu cita fácilmente</p>
        <input
          id="nombre"
          type="text"
          placeholder="👤 Nombre completo"
        />
        <input
          id="correo"
          type="email"
          placeholder="📧 Correo electrónico"
        />
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

<p
style={{
  fontSize: "12px",
  color: "#888",
  marginTop: "8px"
}}
>
🔒 Mínimo 8 caracteres, una mayúscula, un número y un símbolo.
</p>
        <button
          onClick={async () => {
            const nombre =
            document.getElementById("nombre").value;
            const correo =
            document.getElementById("correo").value;
            const password =
            document.getElementById("password").value;
            if(!nombre || !correo || !password){
              alert("⚠️ Completa todos los campos");
              return;
            } 
          const regexPassword =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,20}$/;
          if (!regexPassword.test(password)) {
            alert(
              "La contraseña debe tener entre 8 y 20 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
            );
            return;
          }
          const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!regexCorreo.test(correo)) {
            alert("Ingresa un correo electrónico válido");
            return;
          }
            try {
      await axios.post(
        "http://localhost:3000/api/usuarios/registro",
        {
          nombre,
          correo,
          password,
        }
      );
          alert("✅ Usuario registrado. Revisa tu correo para verificar tu cuenta.");
          navigate("/login");

        } catch (error) {
          console.log("ERROR COMPLETO:");
          console.log(error);

          console.log("MENSAJE:");
          console.log(error.message);

          console.log("RESPUESTA:");
          console.log(error.response);

          alert("❌ Error al registrar");
        }
              }}>
              Registrarme
            </button>
            <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
            <Link
              to="/" className="volver-home">← Volver al inicio</Link>
          </div>
        </section>
      );
    }
    export default Registro;