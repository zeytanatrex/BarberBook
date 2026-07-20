const express = require("express");
const router = express.Router();

const barberoController = require("../controllers/barberoController");

router.get("/", barberoController.obtenerBarberos);
router.post("/", barberoController.crearBarbero);

router.put("/:id", barberoController.editarBarbero);
router.put("/:id/baja", barberoController.darDeBajaBarbero);
router.delete("/:id", barberoController.eliminarBarbero);

module.exports = router;