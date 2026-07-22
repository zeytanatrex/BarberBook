const transporter = require("../utils/email");
const db = require("../config/db");

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:3000";

exports.registrar = (req, res) => {
  const { nombre, correo, password } = req.body;

  const codigo = Math.floor(100000 + Math.random() * 900000);
  const codigoTexto = codigo.toString();

  const sql = `
    INSERT INTO usuarios(nombre, correo, password, codigo_verificacion)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nombre, correo, password, codigoTexto],
    async (error, result) => {
      if (error) {
        console.error("ERROR MYSQL REGISTRO:", error);

        return res.status(500).json({
          mensaje: "No se pudo registrar el usuario",
          error: error.code,
        });
      }

      const enlace =
        `${BACKEND_URL}/api/usuarios/verificar/${codigoTexto}`;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: correo,
          subject: "Verifica tu cuenta BarberBook",
          html: `
            <h2>Bienvenido a BarberBook</h2>
            <p>Haz clic en el botón para verificar tu cuenta.</p>

            <a href="${enlace}"
              style="
                background:#d4af37;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:5px;
              ">
              Verificar cuenta
            </a>
          `,
        });

        console.log("Correo enviado correctamente");

        return res.json({
          mensaje: "Usuario creado. Revisa tu correo para verificar tu cuenta.",
          id: result.insertId,
        });
      } catch (errorCorreo) {
        console.error("ERROR NODEMAILER:", errorCorreo);

        return res.status(500).json({
          mensaje: "El usuario fue registrado, pero no se pudo enviar el correo",
          error: errorCorreo.code,
        });
      }
    }
  );
};

exports.login = (req, res) => {
  const { correo, password } = req.body;

  const sql = `
    SELECT *
    FROM usuarios
    WHERE correo = ?
    AND password = ?
  `;

  db.query(sql, [correo, password], (error, result) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (result.length === 0) {
      return res.status(401).json({
        mensaje: "Usuario incorrecto",
      });
    }

    if (result[0].verificado === 0) {
      return res.status(403).json({
        mensaje: "Debes verificar tu correo antes de iniciar sesión",
      });
    }

    res.json({
      mensaje: "Login correcto",
      usuario: result[0],
    });
  });
};

exports.verificarCorreo = (req, res) => {
  const { codigo } = req.params;

  const sql = `
    UPDATE usuarios
    SET verificado = 1
    WHERE codigo_verificacion = ?
  `;

  db.query(sql, [codigo], (error, result) => {
    if (error) {
      return res.status(500).send("Error al verificar");
    }

    if (result.affectedRows === 0) {
      return res.send("Código inválido");
    }

    res.send(`
      <h2>✅ Cuenta verificada correctamente</h2>
      <p>Ya puedes volver a BarberBook e iniciar sesión.</p>
    `);
  });
};

exports.reenviarVerificacion = (req, res) => {
  const { correo } = req.body;

  const sql = `
    SELECT codigo_verificacion
    FROM usuarios
    WHERE correo = ?
  `;

  db.query(sql, [correo], async (error, result) => {
    if (error) {
      console.error("ERROR MYSQL REENVÍO:", error);

      return res.status(500).json({
        mensaje: "No se pudo buscar el usuario",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const codigo = result[0].codigo_verificacion;
    const enlace =
      `${BACKEND_URL}/api/usuarios/verificar/${codigo}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: correo,
        subject: "Verifica tu cuenta BarberBook",
        html: `
          <h2>Bienvenido a BarberBook</h2>
          <p>Haz clic en el botón para verificar tu cuenta.</p>

          <a href="${enlace}"
            style="
              background:#d4af37;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:5px;
            ">
            Verificar cuenta
          </a>
        `,
      });

      return res.json({
        mensaje: "Correo reenviado correctamente",
      });
    } catch (errorCorreo) {
      console.error("ERROR NODEMAILER REENVÍO:", errorCorreo);

      return res.status(500).json({
        mensaje: "No se pudo reenviar el correo",
        error: errorCorreo.code,
      });
    }
  });
};