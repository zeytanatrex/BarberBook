import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function PanelBarbero() {
  const navigate = useNavigate();
  const [barberos, setBarberos] = useState([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toLocaleDateString("en-CA")
  );

  // ✅ PROTECCIÓN: solo admin puede entrar
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const rol = usuario?.rol || usuario?.role || "";

    if (rol !== "admin" && rol !== "administrador") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // ✅ BLOQUEAR RETROCESO completamente
  useEffect(() => {
    // Apila varias entradas en el historial para que el atrás no funcione fácil
    for (let i = 0; i < 5; i++) {
      window.history.pushState(null, "", window.location.href);
    }

    const bloquearRetroceso = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", bloquearRetroceso);

    return () => {
      window.removeEventListener("popstate", bloquearRetroceso);
    };
  }, []);

  useEffect(() => {
    document.title = "BarberBook | Panel Barbero";

    axios.get("http://localhost:3000/api/barberos").then((res) => {
      setBarberos(res.data.filter((b) => b.disponible));
    });
  }, []);

  useEffect(() => {
    if (!barberoSeleccionado) return;

    const intervalo = setInterval(() => {
      cargarReservas(barberoSeleccionado);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [barberoSeleccionado, fechaSeleccionada]);

  const cargarReservas = async (idBarbero) => {
    setBarberoSeleccionado(idBarbero);

    if (!idBarbero) {
      setReservas([]);
      return;
    }

    setCargando(true);

    try {
      const res = await axios.get(
        `http://localhost:3000/api/reservas/barbero/${idBarbero}?fecha=${fechaSeleccionada}`
      );

      const reservasOrdenadas = res.data.sort((a, b) => {
        if (a.estado === "Confirmada" && b.estado !== "Confirmada") return -1;
        if (a.estado !== "Confirmada" && b.estado === "Confirmada") return 1;
        return a.hora.localeCompare(b.hora);
      });

      setReservas(reservasOrdenadas);
    } catch (error) {
      console.error(error);
    }

    setCargando(false);
  };

  const colorEstado = (estado) => {
    if (estado === "Atendida") return "#3ddc84";
    if (estado === "No asistió") return "#ff4d4d";
    if (estado === "Cancelada") return "#ff4d4d";
    return "#d4af37";
  };

  return (
    <section className="admin-section">

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          background: "transparent",
          color: "#d4af37",
          border: "none",
          cursor: "pointer",
          fontSize: "15px",
          marginBottom: "10px"
        }}
      >
        ← Volver al inicio
      </button>

      <h2>Panel del Barbero</h2>

      <p style={{ color: "#aaa", marginBottom: "10px" }}>
        Selecciona tu nombre para ver tus citas
      </p>

      <p style={{ color: "#d4af37", marginBottom: "16px", fontWeight: "bold" }}>
        {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString("es-PE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <input
        type="date"
        min={new Date().toLocaleDateString("en-CA")}
        value={fechaSeleccionada}
        onChange={(e) => {
          setFechaSeleccionada(e.target.value);
          if (barberoSeleccionado) cargarReservas(barberoSeleccionado);
        }}
        style={{
          background: "#111",
          color: "#d4af37",
          border: "1px solid #d4af37",
          borderRadius: "8px",
          padding: "8px 12px",
          marginBottom: "30px",
          fontSize: "15px",
          display: "block",
          margin: "0 auto 30px auto",
          textAlign: "center",
        }}
      />

      <div style={{ marginBottom: "30px" }}>
        <select
          className="select-reserva"
          style={{
            maxWidth: "350px",
            background: "#111",
            color: "white",
            border: "1px solid #d4af37",
          }}
          value={barberoSeleccionado}
          onChange={(e) => cargarReservas(e.target.value)}
        >
          <option value="">-- Selecciona tu nombre --</option>
          {barberos.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre} {b.apellidos}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p style={{ color: "#d4af37" }}>Cargando citas...</p>}

      {!cargando && barberoSeleccionado && (
        <div className="tabla-reservas-wrapper tabla-panel-barbero">
          <table className="tabla-reservas">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#aaa", padding: "30px" }}>
                    No tienes citas para esta fecha
                  </td>
                </tr>
              ) : (
                reservas.map((r) => (
                  <tr key={r.id}>
                    <td>{r.hora}</td>
                    <td>{r.nombre}</td>
                    <td>{r.servicio}</td>
                    <td style={{ color: colorEstado(r.estado), fontWeight: "bold" }}>
                      {r.estado}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default PanelBarbero;