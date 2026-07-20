DROP DATABASE IF EXISTS barberbook;
CREATE DATABASE barberbook;
USE barberbook;

-- =========================================================
-- TABLA: USUARIOS
-- =========================================================

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verificado BOOLEAN DEFAULT FALSE,
    codigo_verificacion VARCHAR(10),
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
);

-- =========================================================
-- TABLA: BARBEROS
-- =========================================================

DROP TABLE IF EXISTS barberos;

CREATE TABLE barberos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100),
    horario_inicio TIME,
    horario_fin TIME,
    disponible BOOLEAN DEFAULT TRUE,
    dias_trabajo VARCHAR(50) DEFAULT 'Lunes a sábado',
    correo VARCHAR(100),
    password VARCHAR(100)
);

-- =========================================================
-- TABLA: RESERVAS
-- =========================================================

DROP TABLE IF EXISTS reservas;

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    servicio VARCHAR(100) NOT NULL,
    barbero VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(20) NOT NULL,
    usuario_id INT,
    estado VARCHAR(20) DEFAULT 'Confirmada',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reserva_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- =========================================================
-- DATOS DE USUARIOS
-- =========================================================

INSERT INTO usuarios
(id,nombre,correo,password,creado_en,verificado,codigo_verificacion,rol)
VALUES
(44,'Arianaisil','76324355@mail.isil.pe','Ariana@123','2026-06-04 20:16:27',0,'186759','cliente'),
(45,'Ariana','ariana-npt@hotmail.com','Ariana@123','2026-06-05 00:53:23',1,'163502','cliente'),
(47,'Admin','barberbookproyecto@gmail.com','Admin@2026','2026-06-10 22:52:14',1,'690653','admin'),
(51,'isiliana','zeytanatrex@gmail.com','Admin@2026','2026-06-11 17:07:14',1,'210055','cliente'),
(52,'Pepito Perez','arianapozo44@gmail.com','Admin@2026','2026-06-12 00:44:25',1,'430354','cliente');

-- =========================================================
-- DATOS DE BARBEROS
-- =========================================================

INSERT INTO barberos
(id,nombre,apellidos,horario_inicio,horario_fin,disponible,dias_trabajo,correo,password)
VALUES
(1,'Mateo','Torres','09:00:00','18:00:00',0,'Lunes a sábado',NULL,NULL),
(2,'Ariana','Pozo','09:00:00','21:00:00',1,'Lunes a sábado','vevac71807@divahd.com','Barbero1@'),
(3,'Gerardo','Ruiz','09:00:00','21:00:00',1,'Lunes a sábado',NULL,NULL),
(4,'Enrique','Morelli','09:00:00','21:00:00',1,'Lunes a sábado',NULL,NULL),
(10,'Luis','Perez','09:30:00','18:00:00',0,'Lunes a sábado',NULL,NULL),
(11,'Piero','Perez','08:30:00','16:30:00',0,'Lunes a sábado',NULL,NULL),
(12,'Luis','Pozo','08:00:00','21:00:00',0,'Lunes a sábado',NULL,NULL),
(13,'Jorge','Perez','09:30:00','21:00:00',1,'Lunes a sábado',NULL,NULL),
(14,'Luis','Bazagre','10:30:00','15:00:00',0,'Lunes a sábado',NULL,NULL);

-- =========================================================
-- DATOS DE RESERVAS
-- =========================================================

INSERT INTO reservas
(id,servicio,barbero,fecha,hora,usuario_id,estado,creado_en)
VALUES
(7,'Corte clásico - S/25','Ariana','2026-06-11','10:00',45,'Confirmada','2026-06-11 08:11:18'),
(8,'Corte clásico - S/25','Ariana Pozo','2026-06-11','11:00',45,'Cancelada','2026-06-11 10:11:46'),
(9,'Corte clásico - S/25','Ariana Pozo','2026-06-11','17:30',45,'No asistió','2026-06-11 10:14:54'),
(10,'Corte clásico - S/25','Ariana Pozo','2026-06-11','09:00',45,'Atendida','2026-06-11 10:28:04'),
(11,'Corte clásico - S/25','Ariana Pozo','2026-06-11','09:30',45,'Atendida','2026-06-11 10:28:23'),
(12,'Arreglo de barba - S/15','Enrique Morelli','2026-06-11','10:00',51,'Atendida','2026-06-11 17:09:49'),
(14,'Corte clásico - S/25','Ariana Pozo','2026-06-12','09:30',52,'Confirmada','2026-06-12 00:45:32'),
(15,'Corte clásico - S/25','Ariana Pozo','2026-06-22','14:30',47,'Atendida','2026-06-22 19:23:49'),
(16,'Corte clásico - S/25','Gerardo Ruiz','2026-06-23','10:00',45,'Confirmada','2026-06-22 21:30:27'),
(17,'Corte clásico - S/25','Gerardo Ruiz','2026-06-23','10:30',45,'Confirmada','2026-06-22 21:30:46'),
(18,'Corte clásico - S/25','Jorge Perez','2026-06-23','09:28',45,'Confirmada','2026-06-22 21:31:43'),
(19,'Arreglo de barba - S/15','Jorge Perez','2026-06-23','09:58',45,'Confirmada','2026-06-22 21:36:30'),
(20,'Corte premium - S/40','Mateo Torres','2026-06-22','17:00',45,'Confirmada','2026-06-22 21:46:27'),
(21,'Corte clásico - S/25','Enrique Morelli','2026-06-24','16:30',47,'No asistió','2026-06-24 20:33:49'),
(22,'Corte clásico - S/25','Jorge Perez','2026-06-24','17:00',47,'No asistió','2026-06-24 21:13:46'),
(23,'Corte premium - S/40','Enrique Morelli','2026-06-26','09:00',45,'Confirmada','2026-06-25 15:19:47'),
(24,'Arreglo de barba - S/15','Gerardo Ruiz','2026-06-26','10:00',51,'Confirmada','2026-06-25 15:20:18'),
(25,'Corte clásico - S/25','Ariana Pozo','2026-06-25','20:00',45,'No asistió','2026-06-25 15:47:55'),
(26,'Corte clásico - S/25','Enrique Morelli','2026-06-25','14:30',51,'Cancelada','2026-06-25 18:34:29'),
(27,'Arreglo de barba - S/15','Jorge Perez','2026-06-25','20:30',51,'Confirmada','2026-06-25 18:34:47'),
(28,'Corte clásico - S/25','Ariana Pozo','2026-06-25','20:30',45,'Cancelada','2026-06-25 21:10:24'),
(29,'Corte clásico - S/25','Ariana Pozo','2026-06-25','20:30',45,'Cancelada','2026-06-25 21:27:08'),
(30,'Corte clásico - S/25','Ariana Pozo','2026-06-26','20:30',45,'Cancelada','2026-06-26 00:29:35');

-- =========================================================
-- CONSULTAS ÚTILES
-- =========================================================

SHOW TABLES;

DESCRIBE usuarios;
DESCRIBE barberos;
DESCRIBE reservas;

SELECT * FROM usuarios;
SELECT * FROM barberos;
SELECT * FROM reservas;