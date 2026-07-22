import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";

function Admin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [filtroBarbero, setFiltroBarbero] = useState("");
  const [filtroFecha, setFiltroFecha] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.rol !== "admin") {
      alert("Acceso denegado. Solo el administrador puede ingresar.");
      navigate("/login");
      return;
    }

    setAutorizado(true);
  }, [navigate]);

  useEffect(() => {
    if (!autorizado) return;

    document.title = "BarberBook | Admin";
    cargarReservas();

    axios.get(`${API_URL}/api/barberos`).then((res) => {
      setBarberos(res.data);
    });
  }, [autorizado]);

  const cargarReservas = () => {
     axios.get(`${API_URL}/api/reservas/admin/todas`).then((res) => {
      setReservas(res.data);
    });
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`${API_URL}/api/reservas/${id}/estado`, {
        estado: nuevoEstado,
      });

      setReservas((actuales) =>
        actuales.map((reserva) =>
          reserva.id === id
            ? { ...reserva, estado: nuevoEstado }
            : reserva
        )
      );
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el estado.");
    }
  };

  const guardarBarbero = async () => {
    if (!nombre.trim() || !apellidos.trim() || !horaInicio || !horaFin) {
      alert("Debes completar todos los campos.");
      return;
    }

    if (horaInicio < "08:00" || horaInicio > "21:00") {
      alert("La hora de inicio debe estar entre 08:00 y 21:00");
      return;
    }

    if (horaFin < "08:00" || horaFin > "21:00") {
      alert("La hora de fin debe estar entre 08:00 y 21:00");
      return;
    }

    if (horaFin <= horaInicio) {
      alert("La hora de fin debe ser mayor que la hora de inicio");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/barberos/${editandoId}`,
        {
          nombre,
          apellidos,
          horario_inicio: horaInicio,
          horario_fin: horaFin,
          disponible,
        }
      );

      const res = await axios.get(`${API_URL}/api/barberos`);
      setBarberos(res.data);

      setNombre("");
      setApellidos("");
      setHoraInicio("");
      setHoraFin("");
      setDisponible(true);
      setEditandoId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarBarbero = (barbero) => {
    setEditandoId(barbero.id);
    setNombre(barbero.nombre || "");
    setApellidos(barbero.apellidos || "");
    setHoraInicio(barbero.horario_inicio?.substring(0, 5) || "");
    setHoraFin(barbero.horario_fin?.substring(0, 5) || "");
    setDisponible(Boolean(barbero.disponible));
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const coincideCliente = (reserva.nombre || "")
      .toLowerCase()
      .includes(filtroCliente.trim().toLowerCase());

    const coincideBarbero = filtroBarbero
      ? reserva.barbero?.toLowerCase().includes(filtroBarbero.toLowerCase())
      : true;

    const coincideFecha = filtroFecha
      ? new Date(reserva.fecha).toLocaleDateString("en-CA") === filtroFecha
      : true;

    const coincideEstado = filtroEstado
      ? reserva.estado === filtroEstado
      : true;

    return (
      coincideCliente &&
      coincideBarbero &&
      coincideFecha &&
      coincideEstado
    );
  });

  const obtenerPrecioServicio = (servicio) => {
    const coincidencia = String(servicio).match(
      /S\/\s*(\d+(?:[.,]\d{1,2})?)/i
    );

    return coincidencia
      ? Number.parseFloat(coincidencia[1].replace(",", "."))
      : 0;
  };

  const ingresosDelDia = reservasFiltradas
    .filter((reserva) => reserva.estado === "Atendida")
    .reduce(
      (total, reserva) => total + obtenerPrecioServicio(reserva.servicio),
      0
    );

  const formatoMoneda = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  });

  const puedeProcesar = (reserva) => {
    const ahora = new Date();
    const fechaReserva = new Date(reserva.fecha);

    const [hora, minuto] = reserva.hora.split(":").map(Number);

    fechaReserva.setHours(hora);
    fechaReserva.setMinutes(minuto - 30);
    fechaReserva.setSeconds(0);

    return ahora >= fechaReserva;
  };

  if (!autorizado) return null;

  return (
    <section className="admin-section">
      <Link to="/" className="volver-home">
        ← Volver al inicio
      </Link>

      <h2>Dashboard BarberBook</h2>

      <div className="admin-resumen">
        <div className="card-resumen">
          <h3>{reservasFiltradas.length}</h3>
          <p>Total de Citas</p>
        </div>

        <div className="card-resumen">
          <h3>{formatoMoneda.format(ingresosDelDia)}</h3>
          <p>Ingresos del día</p>
        </div>

        <div className="card-resumen">
          <h3>
            {reservasFiltradas.filter((r) => r.estado === "Confirmada").length}
          </h3>
          <p>Confirmadas</p>
        </div>

        <div className="card-resumen">
          <h3>
            {reservasFiltradas.filter((r) => r.estado === "Atendida").length}
          </h3>
          <p>Atendidas</p>
        </div>

        <div className="card-resumen">
          <h3>
            {reservasFiltradas.filter((r) => r.estado === "No asistió").length}
          </h3>
          <p>No asistió</p>
        </div>

        <div className="card-resumen">
          <h3>
            {reservasFiltradas.filter((r) => r.estado === "Cancelada").length}
          </h3>
          <p>Canceladas</p>
        </div>

        <div className="card-resumen">
          <h3>{barberos.filter((b) => b.disponible).length}</h3>
          <p>Barberos disponibles</p>
        </div>
      </div>

      <h3 className="titulo-barberos">Reservas registradas</h3>

      <div className="filtros-tabla">
        <input
          type="date"
          value={filtroFecha}
          onClick={(e) => e.target.showPicker?.()}
          onChange={(e) => setFiltroFecha(e.target.value)}
          title="Filtrar por fecha"
        />

        <select
          value={filtroBarbero}
          onChange={(e) => setFiltroBarbero(e.target.value)}
        >
          <option value="">Todos los barberos</option>
          {barberos
            .filter((b) => b.disponible)
            .map((b) => (
              <option key={b.id} value={b.nombre}>
                {b.nombre} {b.apellidos}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="🔍 Buscar cliente..."
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option>Confirmada</option>
          <option>Atendida</option>
          <option>No asistió</option>
          <option>Cancelada</option>
        </select>

        <button
          className="btn-limpiar"
          onClick={() => {
            setFiltroFecha(new Date().toLocaleDateString("en-CA"));
            setFiltroBarbero("");
            setFiltroCliente("");
            setFiltroEstado("");
          }}
        >
          Limpiar filtros
        </button>
      </div>

      <div className="tabla-reservas-wrapper">
        <table className="tabla-reservas">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {reservasFiltradas.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "#aaa",
                    padding: "30px",
                  }}
                >
                  No se encontraron reservas.
                </td>
              </tr>
            ) : (
              reservasFiltradas.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.fecha).toLocaleDateString()}</td>
                  <td>{r.hora}</td>
                  <td>{r.nombre}</td>
                  <td>{r.correo}</td>
                  <td>{r.barbero}</td>
                  <td>{r.servicio}</td>

                  <td>
                    {r.estado === "Confirmada" ? (
                      <div className="acciones-reserva">
                        <button
                          className="btn-finalizar"
                          style={{ background: "#4CAF50", color: "#fff" }}
                          disabled={!puedeProcesar(r)}
                          onClick={() => cambiarEstado(r.id, "Atendida")}
                        >
                          ✓ Finalizar
                        </button>

                        <button
                          className="btn-noshow"
                          style={{ background: "#E57373", color: "#fff" }}
                          disabled={!puedeProcesar(r)}
                          onClick={() =>
                            cambiarEstado(r.id, "No asistió")
                          }
                        >
                          ⚠ No asistió
                        </button>
                      </div>
                    ) : (
                      <span
                        className={
                          r.estado === "Atendida"
                            ? "estado-atendida"
                            : r.estado === "No asistió"
                            ? "estado-noshow"
                            : r.estado === "Cancelada"
                            ? "estado-cancelada"
                            : "estado-confirmada"
                        }
                      >
                        {r.estado === "Atendida"
                          ? "✅ Finalizada"
                          : r.estado === "No asistió"
                          ? "🔶 No asistió"
                          : r.estado === "Cancelada"
                          ? "🚫 Cancelada"
                          : "🟡 Pendiente"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-barberos-layout">
        <div className="form-barbero">
          <h4>Editar Barbero</h4>

          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label>Apellidos</label>
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />

          <label>Hora de inicio</label>
          <input
            type="time"
            min="08:00"
            max="21:00"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />

          <label>Hora de fin</label>
          <input
            type="time"
            min="08:00"
            max="21:00"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />

          <div className="campo-disponible">
            <label>
              <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
              />
              Disponible
            </label>
          </div>

          <button onClick={guardarBarbero} disabled={!editandoId}>
            Actualizar Barbero
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={() => {
                setEditandoId(null);
                setNombre("");
                setApellidos("");
                setHoraInicio("");
                setHoraFin("");
                setDisponible(true);
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>

        <div className="admin-barberos">
          <h3 className="titulo-barberos">Gestión de Barberos</h3>

          <div className="lista-barberos">
            <h4>Lista de Barberos</h4>

            <div className="cabecera-barberos">
              <span>Barbero</span>
              <span>Horario</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            {[...barberos]
              .sort((a, b) => b.disponible - a.disponible)
              .map((b) => (
                <div key={b.id} className="fila-barbero">
                  <div className="col-barbero">
                    <strong>
                      {b.nombre} {b.apellidos}
                    </strong>
                  </div>

                  <div className="col-horario">
                    <strong>
                      {b.horario_inicio?.substring(0, 5)} -{" "}
                      {b.horario_fin?.substring(0, 5)}
                    </strong>
                    <small>{b.dias_trabajo}</small>
                  </div>

                  <div
                    className={
                      b.disponible
                        ? "col-estado"
                        : "col-estado no-disponible"
                    }
                  >
                    {b.disponible ? "🟢 Disponible" : "🔴 No disponible"}
                  </div>

                  <div className="col-acciones">
                    <button onClick={() => cargarBarbero(b)}>
                      Editar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Admin;