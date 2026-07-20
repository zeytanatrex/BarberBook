import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [mostrarAnteriores, setMostrarAnteriores] = useState(false);

  useEffect(() => {
    document.title = "BarberBook | Mis reservas";
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    axios
      .get(`http://localhost:3000/api/reservas/${usuario.id}`)
      .then((res) => setReservas(res.data));
  }, []);

  const colorEstado = (estado) => {
    if (estado === "Atendida") return "#3ddc84";
    if (estado === "No asistió" || estado === "Cancelada") return "#ff4d4d";
    return "#d4af37";
  };

  const obtenerFechaISO = (fecha) => {
    const coincidencia = String(fecha).match(/^(\d{4}-\d{2}-\d{2})/);
    if (coincidencia) return coincidencia[1];

    const fechaLocal = new Date(fecha);
    return [
      fechaLocal.getFullYear(),
      String(fechaLocal.getMonth() + 1).padStart(2, "0"),
      String(fechaLocal.getDate()).padStart(2, "0"),
    ].join("-");
  };

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = obtenerFechaISO(fecha).split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const fechaActual = new Date();
  const hoy = [
    fechaActual.getFullYear(),
    String(fechaActual.getMonth() + 1).padStart(2, "0"),
    String(fechaActual.getDate()).padStart(2, "0"),
  ].join("-");

  const reservasProximas = reservas.filter(
  (reserva) => obtenerFechaISO(reserva.fecha) >= hoy
);

const reservasAnteriores = reservas.filter(
  (reserva) => obtenerFechaISO(reserva.fecha) < hoy
);

const reservasDelFiltro = mostrarAnteriores
  ? reservasAnteriores
  : reservasProximas;

const fechasDisponibles = [
  ...new Set(reservasDelFiltro.map((r) => obtenerFechaISO(r.fecha))),
].sort((a, b) =>
  mostrarAnteriores ? b.localeCompare(a) : a.localeCompare(b)
);

const reservasVisibles = reservasDelFiltro
  .filter((r) => !fechaFiltro || obtenerFechaISO(r.fecha) === fechaFiltro)
  .sort((a, b) => {
    const fechaA = new Date(`${obtenerFechaISO(a.fecha)}T${a.hora}`);
    const fechaB = new Date(`${obtenerFechaISO(b.fecha)}T${b.hora}`);

    return mostrarAnteriores ? fechaB - fechaA : fechaA - fechaB;
  });

  const puedeCancelar = (reserva) => {
    return (
      obtenerFechaISO(reserva.fecha) >= hoy &&
      reserva.estado === "Confirmada"
    );
  };

const cancelarReserva = async (id) => {
  const confirmar = window.confirm("¿Seguro que quieres cancelar esta reserva?");

  if (!confirmar) return;

  try {
    await axios.put(`http://localhost:3000/api/reservas/${id}/estado`, {
      estado: "Cancelada",
    });

    setReservas(
      reservas.map((r) =>
        r.id === id ? { ...r, estado: "Cancelada" } : r
      )
    );

    alert("✅ Reserva cancelada correctamente. El barbero será notificado.");
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    alert("❌ No se pudo cancelar la reserva");
  }
};

  return (
    <section className="reserva-section">
      <Link to="/" className="volver-home">
        ← Volver
      </Link>

      <h2>Mis reservas</h2>

      

      {reservas.length > 0 && (
  <div className="mis-reservas-filtro">
    <p>Elige qué reservas ver</p>

    <div className="mis-reservas-fechas">
      <button
        type="button"
        className={!mostrarAnteriores ? "fecha-activa" : ""}
        onClick={() => {
          setMostrarAnteriores(false);
          setFechaFiltro("");
        }}
      >
        Próximas
      </button>

      <button
        type="button"
        className={mostrarAnteriores ? "fecha-activa" : ""}
        onClick={() => {
          setMostrarAnteriores(true);
          setFechaFiltro("");
        }}
      >
        Anteriores
      </button>
    </div>

    {fechasDisponibles.length > 0 && (
      <>
        <p>Filtrar por fecha</p>

        <div className="mis-reservas-fechas">
          <button
            type="button"
            className={!fechaFiltro ? "fecha-activa" : ""}
            onClick={() => setFechaFiltro("")}
          >
            Todas
          </button>

          {fechasDisponibles.map((fecha) => (
            <button
              key={fecha}
              type="button"
              className={fechaFiltro === fecha ? "fecha-activa" : ""}
              onClick={() => setFechaFiltro(fecha)}
            >
              {formatearFecha(fecha)}
            </button>
          ))}
        </div>
      </>
    )}
  </div>
)}

      {reservas.length === 0 ? (
  <div className="vip-card" style={{ textAlign: "center", color: "#aaa" }}>
    <p>No tienes reservas aún.</p>

    <Link
      to="/reserva"
      className="btn-vip"
      style={{ marginTop: "16px", display: "inline-block" }}
    >
      Reservar ahora
    </Link>
  </div>
) : (
  <div className="mis-reservas-lista">
    {reservasDelFiltro.length === 0 ? (
      <div className="mis-reservas-vacia">
        {mostrarAnteriores
          ? "No tienes reservas anteriores."
          : "No tienes próximas reservas."}
      </div>
    ) : (
      reservasVisibles.map((reserva) => (
        <div key={reserva.id} className="mis-reservas-card">
          <div className="mis-reservas-header">
            <span className="mis-reservas-servicio">
              ✂️ {reserva.servicio}
            </span>

            <span
              className="mis-reservas-estado"
              style={{ color: colorEstado(reserva.estado) }}
            >
              {reserva.estado || "Confirmada"}
            </span>
          </div>

          <div className="mis-reservas-info">
            <p>👨‍🦱 <strong>{reserva.barbero}</strong></p>
            <p>📅 {formatearFecha(reserva.fecha)}</p>
            <p>🕐 {reserva.hora}</p>
          </div>

          {puedeCancelar(reserva) && (
            <button
              className="btn-cancelar"
              onClick={() => cancelarReserva(reserva.id)}
            >
              Cancelar reserva
            </button>
          )}
        </div>
      ))
    )}

    {reservasDelFiltro.length > 0 && reservasVisibles.length === 0 && (
      <div className="mis-reservas-vacia">
        No tienes reservas para la fecha seleccionada.
      </div>
    )}
  </div>
)}

    </section>
  );
}

export default MisReservas;