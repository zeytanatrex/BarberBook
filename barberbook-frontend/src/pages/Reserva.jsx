import { useState } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

function Reserva() {
const [mensajeReserva, setMensajeReserva] = useState("");
const [horaSeleccionada, setHoraSeleccionada] = useState("");
const[horasOcupadas,setHorasOcupadas]=useState([]);
const [servicioSeleccionado, setServicioSeleccionado] = useState("");
const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
const [barberos, setBarberos] = useState([]);
const [fechaSeleccionada, setFechaSeleccionada] = useState("");
const usuario = JSON.parse(localStorage.getItem("usuario"));
useEffect(() => {
  document.title = "BarberBook |  Reserva";
}, []);

useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/barberos`)
    .then((res) => {
      setBarberos(res.data);
    });
}, []);
useEffect(() => {
  if (fechaSeleccionada && barberoSeleccionado) {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reservas/ocupadas`, {
        params: {
          fecha: fechaSeleccionada,
          barbero: barberoSeleccionado,
        },
      })
      .then((res) => {
        setHorasOcupadas(
          res.data.map((h) => h.hora.substring(0, 5))
        );
      });
  }
}, [fechaSeleccionada, barberoSeleccionado]);

const generarHorarios = () => {
  const barbero = barberos.find(
    (b) => `${b.nombre} ${b.apellidos}` === barberoSeleccionado
  );

  if (!barbero) return [];

  const inicio = barbero.horario_inicio.substring(0, 5);
  const fin = barbero.horario_fin.substring(0, 5);

  let horarios = [];

  let [hora, minuto] = inicio.split(":").map(Number);
  const [horaFin, minutoFin] = fin.split(":").map(Number);

  while (
    hora < horaFin ||
    (hora === horaFin && minuto < minutoFin)
  ) {
    const horaTexto = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
    horarios.push(horaTexto);

    minuto += 30;

    if (minuto >= 60) {
      minuto = 0;
      hora += 1;
    }
  }
/* 
  FILTRO DE HORARIOS PASADOS
  --------------------------
  Si el cliente selecciona el día de hoy como fecha,
  no tiene sentido mostrar horarios que ya pasaron.
  
  Por ejemplo: si son las 13:00, ya no se deben mostrar
  las 9:00, 9:30, 10:00, 11:00, 12:00, 12:30, etc.
  
  Esta validación compara la hora actual con cada horario
  generado. Solo se muestran los horarios que aún no han pasado.
  
  Si el cliente elige una fecha futura, se muestran todos
  los horarios disponibles sin restricción. */
    
  const hoy = new Date().toISOString().split("T")[0];
  if (fechaSeleccionada === hoy) {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    return horarios.filter((h) => {
      const [hh, mm] = h.split(":").map(Number);
      // Agrega 30 minutos de margen al horario actual
      const totalMinutosActual = horaActual * 60 + minutoActual + 30;
      const totalMinutosHorario = hh * 60 + mm;
      return totalMinutosHorario > totalMinutosActual;
    });
  }

  return horarios;
};

  const esDomingo = (fecha) => {
    const fechaLocal = new Date(fecha + "T00:00:00");
    return fechaLocal.getDay() === 0;
  };

  if (!usuario) {
  return (
    <section className="reserva-section">
    <div className="vip-card">
    <h1>🔒 BARBERBOOK VIP</h1>
    <p>Solo clientes registrados
    pueden reservar citas.

    Inicia sesión y accede
    a cortes premium.</p>
    <Link to="/login" className="btn-vip">Iniciar sesión</Link>
    <Link to="/" className="volver-home">← Volver al inicio</Link>
    </div>
    </section>);
}
return (
  <section id="reservar" className="reserva-section">
  <Link to="/" className="volver-home">← Volver al inicio</Link>   
  <h2>Reserva tu cita</h2>
  <div className="reserva-card">
  <select className="select-reserva" id="servicio" onChange={(e)=>{ setServicioSeleccionado(e.target.value); setMensajeReserva(""); }}>    <option value=""disabled selected>
  ✂️ Escoge tu servicio</option>
  <option>Corte clásico - S/25</option>
  <option>Arreglo de barba - S/15</option>
  <option>Corte premium - S/40</option>
  </select>

  <select
    className="select-reserva"
    id="barbero"
    value={barberoSeleccionado}
    onChange={(e) => {
      setBarberoSeleccionado(e.target.value);
      setMensajeReserva("");
    }}
  >
    <option value="" disabled>
      👨‍🦱 Escoge tu barbero
    </option>

    {barberos
      .filter((b) => b.disponible)
      .map((b) => (
        <option
          key={b.id}
          value={`${b.nombre} ${b.apellidos}`}
        >
          {b.nombre} {b.apellidos}
        </option>
      ))}
  </select>

  <input
    id="fecha"
    type="date"
    min={new Date().toISOString().split("T")[0]}
    onChange={(e) => {
      const fecha = e.target.value;

      if (esDomingo(fecha)) {
        alert("⚠️ No se atiende los domingos. Elige otra fecha.");
        e.target.value = "";
        setFechaSeleccionada("");
        setHoraSeleccionada("");
        return;
      }

    setFechaSeleccionada(fecha);
  }}
/>
<div className="horarios">
  {barberoSeleccionado ? (
    generarHorarios().map((hora) => {
      const ocupado = horasOcupadas.includes(hora);

    return (
      <button
        key={hora}
        disabled={ocupado}
        className={
          ocupado
            ? "ocupado"
            : horaSeleccionada === hora
            ? "hora-activa"
            : ""
        }
          onClick={() => {
            setHoraSeleccionada(hora);
            document.getElementById("hora").value = hora;
          }}
        >
          {ocupado ? `❌ Ocupado ${hora}` : hora}
        </button>
      );
    })
  ) : (
    <p className="leyenda-horarios">
      Primero selecciona un barbero.
    </p>
  )}

    <input id="hora" hidden readOnly />
    </div>
    <p className="leyenda-horarios">
      Los horarios ocupados no se pueden seleccionar. No atendemos domingos.
    </p>
    <button
  className="confirmar"
  disabled={
    !servicioSeleccionado ||
    !barberoSeleccionado ||
    !fechaSeleccionada ||
    !horaSeleccionada
  }
  onClick={async () => {
    const servicio = document.getElementById("servicio").value;
    const barbero = document.getElementById("barbero").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    if (!servicio || !barbero || !fecha || !hora) {
      alert("⚠️ Completa todos los campos");
      return;
    }
    if (esDomingo(fecha)) {
    alert("⚠️ No se puede reservar los domingos.");
    return;
    }
      try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
    const respuesta = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/reservas`,
    {
      servicio,
      barbero,
      fecha,
      hora,

      usuario_id: usuario.id
}
);

      setMensajeReserva(`✅ ¡Reserva confirmada! Revisa tu correo.

      📋 Servicio: ${servicio}
      ✂️ Barbero: ${barbero}
      📅 Fecha: ${fecha}
      🕐 Hora: ${hora}`);

      document.getElementById("servicio").value = "";
      document.getElementById("barbero").value = "";
      document.getElementById("fecha").value = "";
      document.getElementById("hora").value = "";

      setServicioSeleccionado("");
      setBarberoSeleccionado("");
      setFechaSeleccionada("");
      setHoraSeleccionada("");
    } catch (error) {
    console.log(error.response?.data?.mensaje === "Horario ocupado");
    alert("⚠️ Ese horario ya está reservado. Elige otra hora.");
    }
  }}
>
  Confirmar reserva
</button>
    {mensajeReserva && (
    <div className="mensaje-reserva"><pre>{mensajeReserva}</pre  ></div>)}</div></section>
  );
}

export default Reserva;