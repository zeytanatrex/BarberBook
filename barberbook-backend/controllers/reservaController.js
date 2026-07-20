const db = require("../config/db");
const transporter = require("../utils/email");

exports.crearReserva = (req, res) => {
const { servicio, barbero, fecha, hora, usuario_id } = req.body;

const verificar = `
  SELECT * FROM reservas
  WHERE fecha = ?
  AND hora = ?
  AND barbero = ?
  AND estado != 'Cancelada'
`;

db.query(verificar, [fecha, hora, barbero], (error, result) => {
  if (error) return res.status(500).json(error);

  if (result.length > 0) {
    return res.status(400).json({
      mensaje: "Horario ocupado",
    });
  }

  const sql = `
    INSERT INTO reservas 
    (servicio, barbero, fecha, hora, usuario_id, estado) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [servicio, barbero, fecha, hora, usuario_id, "Confirmada"],
    (error, result) => {
      if (error) return res.status(500).json(error);

  const reservaId = result.insertId;
  const buscarDatos = `
  SELECT 
    usuarios.nombre AS nombreCliente,
    usuarios.correo AS correoCliente,
    barberos.correo AS correoBarbero,
    CONCAT(barberos.nombre, ' ', barberos.apellidos) AS nombreBarbero
    FROM usuarios
    LEFT JOIN barberos 
    ON ? = CONCAT(barberos.nombre, ' ', barberos.apellidos)
    WHERE usuarios.id = ?
`;

db.query(
buscarDatos,
[barbero, usuario_id],
(errorDatos, resultadoDatos) => {
  if (errorDatos) return res.status(500).json(errorDatos);

  const datos = resultadoDatos[0];

  res.json({
    mensaje: "Reserva guardada y correos enviados",
    id: reservaId,
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: datos.correoCliente,
    subject: "Reserva confirmada - BarberBook",
    text: `
    Hola ${datos.nombreCliente},

    Tu reserva ha sido confirmada correctamente.

    Servicio: ${servicio}
    Barbero: ${barbero}
    Fecha: ${fecha}
    Hora: ${hora}

Gracias por reservar en BarberBook.
      `,

  }).catch((errorCorreo) => {
    console.log("Error al enviar correo al cliente:", errorCorreo);
  });

  if (datos.correoBarbero) {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: datos.correoBarbero,
      subject: "Nueva cita registrada - BarberBook",
      text: `
  Hola ${datos.nombreBarbero},

  Tienes una nueva cita registrada.

  Cliente: ${datos.nombreCliente}
  Servicio: ${servicio}
  Fecha: ${fecha}
  Hora: ${hora}
  Estado: Confirmada

  Revisa tu panel de barbero para ver los detalles actualizados.
              `,
            }).catch((errorCorreoBarbero) => {
              console.log("Error al enviar correo al barbero:", errorCorreoBarbero);
            });
          } else {
            console.log(`El barbero ${barbero} no tiene correo registrado.`);
          }
        }
      );
    }
  );
}); 
};

  exports.obtenerReservas = (req, res) => {
    const usuario_id = req.params.usuario_id;

    const sql = `
      SELECT * FROM reservas
      WHERE usuario_id = ?
      ORDER BY fecha ASC, hora ASC, id ASC
    `;

    db.query(sql, [usuario_id], (error, result) => {
      if (error) return res.status(500).json(error);

      res.json(result);
    });
  };

exports.eliminarReserva = (req, res) => {
  const id = req.params.id;

  const buscarReserva = `
  SELECT 
  reservas.id,
  reservas.servicio,
  reservas.barbero,
  reservas.fecha,
  reservas.hora,
  reservas.estado,
  usuarios.nombre AS nombreCliente,
  usuarios.correo AS correoCliente,
  barberos.correo AS correoBarbero,
  CONCAT(barberos.nombre, ' ', barberos.apellidos) AS nombreBarbero
  FROM reservas
  NNER JOIN usuarios 
  ON reservas.usuario_id = usuarios.id
  LEFT JOIN barberos 
  ON reservas.barbero = CONCAT(barberos.nombre, ' ', barberos.apellidos)
  WHERE reservas.id = ?
  `;

db.query(buscarReserva, [id], (errorBuscar, resultadoReserva) => {
  if (errorBuscar) return res.status(500).json(errorBuscar);

  if (resultadoReserva.length === 0) {
    return res.status(404).json({
      mensaje: "Reserva no encontrada",
    });
  }

  const datos = resultadoReserva[0];

  const sql = "UPDATE reservas SET estado = 'Cancelada' WHERE id = ?";

  db.query(sql, [id], (error) => {
    if (error) return res.status(500).json(error);

    res.json({
      mensaje: "Reserva cancelada y barbero notificado",
    });

    if (datos.correoBarbero) {
      transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: datos.correoBarbero,
      subject: "Cita cancelada - BarberBook",
      text: `
    Hola ${datos.nombreBarbero},

    Te informamos que una cita fue cancelada.

    Cliente: ${datos.nombreCliente}
    Servicio: ${datos.servicio}
    Fecha: ${datos.fecha}
    Hora: ${datos.hora}
    Estado: Cancelada

    Ya no deberás atender esta cita.

    BarberBook
            `,
          }).catch((errorCorreoBarbero) => {
            console.log("Error al enviar correo de cancelación al barbero:", errorCorreoBarbero);
          });
        } else {
          console.log(`El barbero ${datos.barbero} no tiene correo registrado.`);
        }
      });
    });
  };

exports.obtenerHorariosOcupados = (req, res) => {
  const { fecha, barbero } = req.query;

  const sql = "SELECT hora FROM reservas WHERE fecha = ? AND barbero = ? AND estado != 'Cancelada'";

  db.query(sql, [fecha, barbero], (error, result) => {
    if (error) return res.status(500).json(error);

    res.json(result);
  });
};

exports.actualizarEstado = (req, res) => {
  const id = req.params.id;
  const { estado } = req.body;

  const buscarReserva = `
    SELECT 
      reservas.id,
      reservas.servicio,
      reservas.barbero,
      reservas.fecha,
      reservas.hora,
      reservas.estado,
      usuarios.nombre AS nombreCliente,
      usuarios.correo AS correoCliente,
      barberos.correo AS correoBarbero,
      CONCAT(barberos.nombre, ' ', barberos.apellidos) AS nombreBarbero
    FROM reservas
    INNER JOIN usuarios 
      ON reservas.usuario_id = usuarios.id
    LEFT JOIN barberos 
      ON reservas.barbero = CONCAT(barberos.nombre, ' ', barberos.apellidos)
    WHERE reservas.id = ?
  `;

  db.query(buscarReserva, [id], (errorBuscar, resultadoReserva) => {
    if (errorBuscar) return res.status(500).json(errorBuscar);

    if (resultadoReserva.length === 0) {
      return res.status(404).json({
        mensaje: "Reserva no encontrada",
      });
    }

    const datos = resultadoReserva[0];

    const sql = "UPDATE reservas SET estado = ? WHERE id = ?";

    db.query(sql, [estado, id], (error) => {
      if (error) return res.status(500).json(error);

      res.json({
        mensaje: "Estado actualizado",
      });

      if (estado === "Cancelada" && datos.correoBarbero) {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: datos.correoBarbero,
          subject: "Cita cancelada - BarberBook",
          text: `
Hola ${datos.nombreBarbero},

Te informamos que una cita fue cancelada.

Cliente: ${datos.nombreCliente}
Servicio: ${datos.servicio}
Fecha: ${datos.fecha}
Hora: ${datos.hora}
Estado: Cancelada

Ya no deberás atender esta cita.

BarberBook
          `,
        }).catch((errorCorreoBarbero) => {
          console.log("Error al enviar correo de cancelación al barbero:", errorCorreoBarbero);
        });
      }
    });
  });
};

exports.obtenerTodasReservas = (req, res) => {

  const sql = `
    SELECT
    reservas.*,
    usuarios.nombre,
    usuarios.correo
    FROM reservas
    INNER JOIN usuarios
    ON reservas.usuario_id = usuarios.id
    ORDER BY 
    CASE 
    WHEN reservas.estado = 'Confirmada' THEN 1
    ELSE 2
    END ASC,
    reservas.fecha ASC,
    reservas.hora ASC `;

  db.query(sql, (error, result) => {
    if (error) return res.status(500).json(error);

    res.json(result);
  });
};

exports.obtenerReservasPorBarbero = (req, res) => {
  const barbero_id = req.params.barbero_id;
  const { fecha } = req.query;

  /*
    PANEL DEL BARBERO
    -----------------
    Busca las reservas del día para un barbero específico.
    Recibe el ID del barbero y la fecha como parámetro.
    Une con la tabla de usuarios para obtener el nombre del cliente.
  */
const sql = `
  SELECT
    reservas.id,
    reservas.hora,
    reservas.servicio,
    reservas.estado,
    usuarios.nombre
    FROM reservas
    INNER JOIN usuarios ON reservas.usuario_id = usuarios.id
    INNER JOIN barberos ON reservas.barbero = CONCAT(barberos.nombre, ' ', barberos.apellidos)
    WHERE barberos.id = ?
    AND reservas.fecha = ?
    ORDER BY 
    CASE 
    WHEN reservas.estado = 'Confirmada' THEN 1
    ELSE 2
    END ASC,
    reservas.hora ASC
`;

  db.query(sql, [barbero_id, fecha], (error, result) => {
    if (error) return res.status(500).json(error);
    res.json(result);
  });
};
