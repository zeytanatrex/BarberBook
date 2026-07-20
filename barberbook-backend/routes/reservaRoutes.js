const express = require("express");
const router = express.Router();

const {
  crearReserva,
  obtenerReservas,
  obtenerHorariosOcupados,
  eliminarReserva,
  actualizarEstado,
  obtenerTodasReservas,
  obtenerReservasPorBarbero,
} = require("../controllers/reservaController");

router.post("/", crearReserva);
router.get("/ocupadas",obtenerHorariosOcupados);
router.get("/admin/todas",obtenerTodasReservas);
router.get("/barbero/:barbero_id", obtenerReservasPorBarbero);
router.get("/:usuario_id", obtenerReservas);
router.put("/:id/estado", actualizarEstado);
router.delete("/:id", eliminarReserva);

module.exports = router;