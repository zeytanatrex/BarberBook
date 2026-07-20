const express = require("express");
const cors = require("cors");
const usuarioRoutes =
require("./routes/usuarioRoutes");
const reservaRoutes =
require("./routes/reservaRoutes");
const barberoRoutes =
require("./routes/barberoRoutes");
require("dotenv").config();

console.log("USER=", process.env.EMAIL_USER);
console.log("PASS=", process.env.EMAIL_PASS);

const db = require("./config/db");
const transporter = require("./utils/email");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/usuarios",usuarioRoutes);
app.use("/api/reservas",reservaRoutes);
app.use("/api/barberos",barberoRoutes);

app.get("/", (req, res) => {
  res.send("API BarberBook funcionando");
});

app.get("/correo-prueba", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "arianapozo44@gmail.com",
      subject: "Prueba Nodemailer",
      text: "Si recibes este correo, Nodemailer funciona.",
    });

    res.send("Correo enviado correctamente");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// TAREA AUTOMÁTICA: marcar como "No asistió"
// Si una reserva confirmada supera los 15 minutos de tolerancia,
// el sistema la cambia automáticamente a "No asistió".
setInterval(() => {
  const ahora = new Date();
  const fechaHoy = ahora.toLocaleDateString("en-CA");
  const horaActual = ahora.toTimeString().slice(0, 5);

  const sql = `
    UPDATE reservas
    SET estado = 'No asistió'
    WHERE estado = 'Confirmada'
    AND fecha = ?
    AND TIME_TO_SEC(TIMEDIFF(?, hora)) >= 15 * 60
  `;

  db.query(sql, [fechaHoy, horaActual], (error, resultado) => {
    if (error) {
      console.error("Error actualizando reservas a No asistió:", error);
      return;
    }

    if (resultado.affectedRows > 0) {
      console.log(
        `${resultado.affectedRows} reserva(s) marcada(s) como No asistió`
      );
    }
  });
}, 60000);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});