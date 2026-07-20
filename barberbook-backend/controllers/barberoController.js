  const db = require("../config/db");

  exports.obtenerBarberos = (req, res) => {
    const sql = "SELECT * FROM barberos ORDER BY nombre";

    db.query(sql, (error, result) => {
      if (error) return res.status(500).json(error);

      res.json(result);
    });
  };

  exports.crearBarbero = (req, res) => {
    const {
      nombre,
      apellidos,
      horario_inicio,
      horario_fin,
      disponible
    } = req.body;

    const sql = `
      INSERT INTO barberos
      (
        nombre,
        apellidos,
        horario_inicio,
        horario_fin,
        disponible
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        nombre,
        apellidos,
        horario_inicio,
        horario_fin,
        disponible
      ],
      (error, result) => {
        if (error) return res.status(500).json(error);

        res.json({
          mensaje: "Barbero creado",
          id: result.insertId
        });
      }
    );
  };

  exports.editarBarbero = (req, res) => {
    const { id } = req.params;

    const {
      nombre,
      apellidos,
      horario_inicio,
      horario_fin,
      disponible
    } = req.body;

    const sql = `
      UPDATE barberos
      SET
        nombre = ?,
        apellidos = ?,
        horario_inicio = ?,
        horario_fin = ?,
        disponible = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [
        nombre,
        apellidos,
        horario_inicio,
        horario_fin,
        disponible,
        id
      ],
      (error) => {
        if (error) return res.status(500).json(error);

        res.json({
          mensaje: "Barbero actualizado"
        });
      }
    );
  };

  exports.darDeBajaBarbero = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE barberos
    SET disponible = 0
    WHERE id = ?
  `;

  db.query(sql, [id], (error) => {
    if (error) return res.status(500).json(error);

    res.json({
      mensaje: "Barbero dado de baja"
    });
  });
};

  exports.eliminarBarbero = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM barberos WHERE id = ?";

    db.query(sql, [id], (error) => {
      if (error) return res.status(500).json(error);

      res.json({
        mensaje: "Barbero eliminado"
      });
    });
  };
