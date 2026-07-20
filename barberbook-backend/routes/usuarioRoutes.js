const express = require("express");
const router = express.Router();

const {
  registrar,
  login,
  verificarCorreo,
  reenviarVerificacion
} = require("../controllers/usuarioController");

router.post("/registro", registrar);
router.post("/login", login);

router.get("/verificar/:codigo", verificarCorreo);

router.post(
  "/reenviar-verificacion",
  reenviarVerificacion
);

module.exports = router;