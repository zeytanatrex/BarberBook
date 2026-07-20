import { FaInstagram, FaWhatsapp, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import { useState } from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function Home() {const [mensajeReserva,setMensajeReserva]=useState("");
                const [horaSeleccionada, setHoraSeleccionada] = useState("");
                const [servicioSeleccionado, setServicioSeleccionado] = useState("");
                const [barberoSeleccionado, setBarberoSeleccionado] = useState("");
                const [fechaSeleccionada, setFechaSeleccionada] = useState("");
                const [barberoActivo, setBarberoActivo] = useState(null);
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                  useEffect(() => {document.title = "BarberBook | Home ";}, []);
return (
  <>
    <nav className="navbar">
      <h1 className="logo">
      BarberBook
      </h1>
      <ul>
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><Link to="/reserva">Reservar</Link></li>
    {usuario ? (
      <>
        <li>Hola, {usuario.nombre}</li> 
        <li><Link to="/mis-reservas">Mis reservas</Link></li>
        {usuario.rol === "admin" && (
          <>
            <li><Link to="/panel-barbero">Panel Barbero</Link></li>
            <li><Link to="/admin">Panel Admin</Link></li>
          </>
        )}
        <li>
          <button className="btn-logout" onClick={() => {
            localStorage.removeItem("usuario");
            window.location.reload();
          }}>
            Cerrar sesión
          </button>
        </li>
      </>
    ) : (
      <li><Link to="/login">Login</Link></li>
    )}
        </ul>
    </nav>
<div className="section-divider"></div>
    <section id="inicio" className="hero">

      <div>
      <h2>Reserva tu corte en segundos</h2>
      <p>"Sin colas, sin llamadas"</p>
      </div>
      <Link to="/reserva"><button>Reservar</button></Link>
    </section>

  <div className="section-divider"></div>
    <section id="servicios" className="services servicios-fondo">
    <h2>Nuestros Servicios</h2>
    <div className="cards">
      <div className="card">
        <img src="https://cdn-icons-png.flaticon.com/512/7657/7657402.png" alt="Corte clásico" />
        <h3>Corte clásico</h3>
        <p>Corte tradicional con acabado limpio y estilo profesional.</p>
        <span className="precio">S/25</span>
        <Link to="/reserva"><button>Reservar</button></Link>
      </div>

      <div className="card">
        <img src="https://cdn-icons-png.flaticon.com/512/6019/6019027.png" alt="Barba" />
        <h3>Arreglo de barba</h3>
        <p>Perfilado y diseño para un look elegante y moderno.</p>
        <span className="precio">S/15</span>
        <Link to="/reserva"><button>Reservar</button></Link>
      </div>

      <div className="card">
        <img src="https://cdn-icons-png.flaticon.com/512/1995/1995475.png" alt="Premium" />
        <h3>Corte premium 👑</h3>
        <p>Corte + estilo + acabado exclusivo para clientes VIP.</p>
        <span className="precio">S/40</span>
        <Link to="/reserva"><button>Reservar</button></Link>
      </div>
    </div>
    </section>

    <div className="section-divider"></div>
    <section className="barberos servicios-fondo">
      <h2>Nuestros Barberos</h2>
    <div className="barberos-cards">

    <div className="barbero-card">
    <img src="https://randomuser.me/api/portraits/men/32.jpg"/>
      <h3>Mateo</h3>
      <p>Especialista en cortes clásicos</p>
    <span>⭐ 4.9 | 5 años experiencia</span>
    <button onClick={()=>setBarberoActivo({
        nombre:
        "Mateo",
        edad:
        "28 años",
        experiencia:
        "5 años",
        especialidad:
        "Cortes clásicos y degradados",
        descripcion:
        "Especialista en estilos clásicos con atención personalizada."})}>Conocer más</button>
    </div>

    <div className="barbero-card">
    <img src="https://randomuser.me/api/portraits/women/44.jpg"/>
    <h3>Ariana</h3>
    <p>Especialista en barba y estilo</p>
    <span>⭐ 4.8 | 4 años experiencia</span>
    <button onClick={()=>setBarberoActivo({
        nombre:
        "Ariana",
        edad:
        "25 años",
        experiencia:
        "4 años",
        especialidad:
        "Barba y estilos modernos",
        descripcion:
        "Experta en perfilado y diseño masculino."})}>Conocer más</button>
    </div>

    <div className="barbero-card"><img src="https://randomuser.me/api/portraits/men/52.jpg"/>
    <h3>Gerardo</h3>
    <p>Fade y cortes modernos</p>
    <span>⭐ 4.9 | 6 años experiencia</span>
    <button onClick={()=>setBarberoActivo({
        nombre:
        "Gerardo",
        edad:
        "30 años",
        experiencia:
        "6 años",
        especialidad:
        "Fade y cortes modernos",
        descripcion:
        "Especialista en tendencias urbanas."})}>Conocer más</button>
    </div>

    <div className="barbero-card">
    <img src="https://randomuser.me/api/portraits/men/68.jpg"/>
    <h3>Enrique</h3>
    <p>Premium stylist</p>
    <span>⭐ 5.0 | 8 años experiencia</span>
    <button onClick={()=>setBarberoActivo({
        nombre:
        "Enrique",
        edad:
        "35 años",
        experiencia:
        "8 años",
        especialidad:
        "Premium stylist",
        descripcion:
        "Experto en cortes VIP y asesoría de imagen."})}>Conocer más</button>
    </div>
    </div>
  </section>      
  <div className="section-divider"></div>
    <div className="section-divider"></div>
    <section className="about">
    <div className="about-left">
    <h2>
    ¿Quiénes
    <br />
    somos?
    </h2>
    <div className="about-stats">
    <div>
    <h3>+5</h3>
    <p>Años</p>
    </div>

    <div>
    <h3>+1000</h3>
    <p>Clientes</p>
    </div>

    <div>
    <h3>4.9★</h3>
    <p>Valoración</p>
    </div>
    </div>
    </div>

    <div className="about-content">
    <span>SOBRE NOSOTROS</span>
    <h3>Tradición y estilo moderno </h3>
    <p>Somos una barbería moderna ubicada en Lince,
    nacida con la idea de ofrecer una experiencia
    diferente en el cuidado personal masculino. </p>
    <p>Empezamos como un pequeño local con dos
    barberos apasionados y hoy combinamos
    la barbería tradicional con reservas digitales.
    </p>
    </div>
  
  </section>
  <div className="section-divider"></div>
    <footer className="footer">
  <div className="footer-contacto">
  <h4>CONTACTO</h4>
  <p>
    <FaMapMarkerAlt />
    <span>Dirección: Lince, Lima</span>
  </p>
  <p>
    <FaPhoneAlt />
    <span>Teléfono: 999 999 999</span>
  </p>
  <p>
    <FaClock />
    <span>Horario: 10:00 am - 9:00 pm</span>
  </p>
</div>

    <div className="footer-centro">
    <h2 className="footer-logo">
      BarberBook
    </h2>
    <p className="footer-eslogan">
      Tu estilo, nuestra pasión.
    </p>
    <p className="footer-copy">
      © 2026 BarberBook. Todos los derechos reservados.
    </p>
  </div>

  <div className="footer-redes">

    <h4>SÍGUENOS</h4>
    <div style={{ display: "flex", gap: "20px" }}>
      <a
        href="https://instagram.com/barber"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram size={28} />
      </a>

      <a
        href="https://wa.me/51980915910"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={28} />
      </a>

      <a
        href="https://www.tiktok.com/@barber"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTiktok size={28} />
      </a>
    </div>

  </div>
  </footer>
  {barberoActivo && (<div className="modal-barbero"><div className="modal-content">
  <h2>{barberoActivo.nombre}</h2>
  <p>Edad:{barberoActivo.edad}</p>
  <p>Experiencia:{barberoActivo.experiencia}</p>
  <p>Especialidad:{barberoActivo.especialidad}</p>
  <p>{barberoActivo.descripcion}</p>
  <button onClick={()=>setBarberoActivo(null)}>Cerrar</button></div></div>)}
  </>
);
}

export default Home;