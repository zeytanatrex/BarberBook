  // Importa la configuración de Nodemailer para enviar correos de verificación
  const transporter = require("../utils/email");
  const db = require("../config/db");

  exports.registrar = (req, res) => {
    const { nombre, correo, password } = req.body;

    // Genera un código aleatorio de 6 dígitos para verificar el correo
    const codigo = Math.floor(100000 + Math.random() * 900000);

    // Convierte el código a texto para guardarlo y enviarlo por correo
    const codigoTexto = codigo.toString();

    // Guarda el usuario junto con su código de verificación
    const sql = `
      INSERT INTO usuarios(nombre, correo, password, codigo_verificacion)
      VALUES (?, ?, ?, ?)
    `;
    db.query(
      sql,
      [nombre, correo, password, codigoTexto],
      (error, result) => {
        if (error) {
          return res.status(500).json(error);
        }
          const enlace = `http://localhost:3000/api/usuarios/verificar/${codigoTexto}`;

          transporter.sendMail({
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
                border-radius:5px;">
                Verificar cuenta
              </a>
            `,
          })
        .then(() => {
          console.log("Correo enviado correctamente");
        })
        .catch((error) => {
          console.error("ERROR NODEMAILER:", error);
        });
        res.json({
          mensaje: "Usuario creado. Revisa tu correo para verificar tu cuenta.",
          id: result.insertId,
        });

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

    console.log("RESULTADO LOGIN:");
    console.log(result);

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

  db.query(sql, [correo], (error, result) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (result.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
      });
    }

    const codigo = result[0].codigo_verificacion;

    const enlace =
      `http://localhost:3000/api/usuarios/verificar/${codigo}`;

    transporter.sendMail({
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
        border-radius:5px;">
        Verificar cuenta
        </a>
      `,
    });

    res.json({
      mensaje: "Correo reenviado correctamente",
    });
  });
};