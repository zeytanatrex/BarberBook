CREATE DATABASE barberbook;

USE barberbook;

CREATE TABLE usuarios(

id INT AUTO_INCREMENT PRIMARY KEY,

nombre VARCHAR(100)
NOT NULL,

correo VARCHAR(100)
UNIQUE
NOT NULL,

password VARCHAR(255)
NOT NULL,

creado_en TIMESTAMP
DEFAULT CURRENT_TIMESTAMP

);
CREATE TABLE reservas(
id INT AUTO_INCREMENT PRIMARY KEY,
servicio VARCHAR(100)NOT NULL,
barbero VARCHAR(100)NOT NULL,
fecha DATE NOT NULL,
hora VARCHAR(20)NOT NULL,
usuario_id INT,
estado VARCHAR(20) DEFAULT 'Confirmada',
creado_en TIMESTAMP
DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(usuario_id)REFERENCES usuarios(id) ON DELETE CASCADE);

SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE reservas;

SELECT *FROM usuarios;
SELECT *FROM reservas;

TRUNCATE TABLE reservas;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

SET SQL_SAFE_UPDATES = 0;
UPDATE reservas
SET estado='Confirmada'
WHERE estado='Pendiente'
OR estado='Cancelada';
SET SQL_SAFE_UPDATES = 1;

SELECT
id,
servicio,
barbero,
fecha,
hora,
estado,
usuario_id
FROM reservas;