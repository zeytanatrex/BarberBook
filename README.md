# 💈 BarberBook

BarberBook es una plataforma web desarrollada para la gestión de reservas en una barbería. Permite a los clientes reservar citas con diferentes barberos, mientras que los administradores y barberos cuentan con herramientas para gestionar las reservas de forma eficiente.

---

## 📌 Descripción

El sistema busca digitalizar el proceso de reserva de citas en una barbería, evitando conflictos de horarios y facilitando la comunicación entre clientes, barberos y administradores mediante notificaciones por correo electrónico.

---

## 🚀 Funcionalidades

### 👤 Cliente

- Registro e inicio de sesión.
- Recuperación de contraseña mediante correo electrónico.
- Visualización de servicios disponibles.
- Reserva de citas con:
  - Servicio.
  - Barbero.
  - Fecha.
  - Hora.
- Visualización de todas sus reservas.
- Cancelación de reservas únicamente hasta **3 horas antes** de la cita.
- Visualización del estado de cada reserva:
  - 🟡 Confirmada
  - 🟢 Atendida
  - 🔴 Cancelada
  - ⚠️ No asistió

---

### 💈 Barbero

- Inicio de sesión.
- Panel con las reservas asignadas.
- Visualización de clientes del día.
- Cambio del estado de una cita a:
  - Atendida.
  - No asistió.
- Consulta de agenda diaria.

---

### 👨‍💼 Administrador

- Gestión completa de reservas.
- Visualización de todas las citas registradas.
- Cambio de estados de las reservas.
- Gestión de usuarios.
- Gestión de barberos.
- Visualización de estadísticas generales.

---

## 📧 Notificaciones automáticas

El sistema envía correos electrónicos mediante Nodemailer para:

- Confirmación de reserva al cliente.
- Notificación al barbero cuando recibe una nueva cita.
- Notificación al barbero cuando una cita es cancelada.

---

## 🛡️ Reglas de negocio implementadas

- No es posible reservar un horario ocupado.
- Una reserva cancelada libera automáticamente el horario.
- Solo se permite cancelar una reserva hasta **3 horas antes** de la cita.
- Las reservas pasadas pueden marcarse como:
  - Atendida.
  - No asistió.
- Los estados de las reservas se actualizan desde el panel correspondiente.

---

## 🛠️ Tecnologías utilizadas

### Frontend

- React
- React Router
- Axios
- CSS3

### Backend

- Node.js
- Express.js
- Nodemailer

### Base de datos

- MySQL

---

## 📂 Estructura del proyecto

```
Frontend/
│
├── components/
├── pages/
├── styles/
├── App.jsx
└── main.jsx

Backend/
│
├── config/
├── controllers/
├── routes/
├── utils/
├── server.js
└── package.json
```

---

## ⚙️ Instalación

### Clonar el repositorio

```bash
git clone https://github.com/usuario/barberbook.git
```

---

### Backend

```bash
cd backend
npm install
npm start
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Base de datos

Importar el archivo SQL incluido en el proyecto utilizando MySQL Workbench.

---

## Variables de entorno

Crear un archivo `.env` con la siguiente configuración:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=barberbook

EMAIL_USER=correo@gmail.com
EMAIL_PASS=contraseña_app
```

---

## 📷 Capturas

- Inicio
  <img width="774" height="502" alt="image" src="https://github.com/user-attachments/assets/e0f0aac3-baba-40ab-94c2-051ed3fbeae5" />
  <img width="819" height="553" alt="image" src="https://github.com/user-attachments/assets/7ab16c75-27f9-4491-b3fd-50c69e31921a" />

- Login
  <img width="400" height="470" alt="image" src="https://github.com/user-attachments/assets/27584149-9fa2-427c-b309-452072fcce71" />

- Registro
  <img width="418" height="561" alt="image" src="https://github.com/user-attachments/assets/f1cffe1e-a059-4110-a0b9-1a0992b35483" />
  <img width="434" height="620" alt="image" src="https://github.com/user-attachments/assets/7dfc58e9-207f-47f7-94af-c692a6c3556f" />
  <img width="610" height="443" alt="image" src="https://github.com/user-attachments/assets/61f74fbf-b020-424d-9ad3-e7846e73170c" />

- Reserva
  <img width="380" height="654" alt="image" src="https://github.com/user-attachments/assets/623bea1e-175c-4049-93c5-ef5fc037a08f" />
  <img width="472" height="479" alt="image" src="https://github.com/user-attachments/assets/23d2e12f-9e76-440e-b04b-b9dffcaf52c6" />
  <img width="490" height="395" alt="image" src="https://github.com/user-attachments/assets/ceb10200-e956-466f-96ee-3f59cc3e78d9" />
  <img width="547" height="519" alt="image" src="https://github.com/user-attachments/assets/fddb6f21-c0c7-4433-b42d-bc589bd7fd74" />

- Mis Reservas
  <img width="713" height="540" alt="image" src="https://github.com/user-attachments/assets/80c88e7b-b8b2-4daa-89cc-a519f82697bd" />

- Panel del Barbero
  <img width="1124" height="663" alt="image" src="https://github.com/user-attachments/assets/b287e3e7-a2ca-4bc9-b97c-9ed1707a99fc" />
  <img width="1007" height="586" alt="image" src="https://github.com/user-attachments/assets/3e1b4752-f4cc-4404-84a0-24096705e63a" />

  
- Panel del Administrador
  <img width="664" height="542" alt="image" src="https://github.com/user-attachments/assets/3f190e92-73ca-4188-9900-9882efb6be14" />
  <img width="785" height="260" alt="image" src="https://github.com/user-attachments/assets/4a99e436-d663-41b1-a7cb-86e983b34fb9" />
  <img width="942" height="515" alt="image" src="https://github.com/user-attachments/assets/c11b8d83-7df7-461f-917e-7be6b400030d" />


---

## 👨‍💻 Autor

Desarrollado por **Adriano Leon, Ariana Pozo y Enrique Morelli** como proyecto final académico.

---

## 📄 Licencia

Proyecto desarrollado con fines educativos.
