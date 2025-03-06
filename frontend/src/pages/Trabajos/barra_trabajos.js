import React, { useState, useEffect } from 'react';
import './barra_trabajos.css'; // Reutiliza los estilos de Menu.css
import logo from '../../images/dentall 1.png';

function BarraTareas() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
  const [ordenesHoy, setOrdenesHoy] = useState([]);
  const [ordenesManana, setOrdenesManana] = useState([]);
  const [ordenesPasadoManana, setOrdenesPasadoManana] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };
  // Función para obtener la fecha local en formato YYYY-MM-DD
  const getLocalDate = (offsetDays = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays); // Añadir días de desplazamiento
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  // Obtener las órdenes no entregadas desde el backend
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const hoy = getLocalDate(0); // Fecha de hoy
        const manana = getLocalDate(1); // Fecha de mañana
        const pasadoManana = getLocalDate(2); // Fecha de pasado mañana
        console.log(hoy, manana, pasadoManana);

        // Obtener órdenes para hoy
        const responseHoy = await fetch(`https://web-tis-app-production.up.railway.app/get_ordenes_por_fecha.php?fecha_entrega=${hoy}`);
        const resultHoy = await responseHoy.json();
        if (resultHoy.success) {
          setOrdenesHoy(resultHoy.data || []);
        } else {
          throw new Error(resultHoy.error || 'Error al obtener las órdenes para hoy');
        }

        // Obtener órdenes para mañana
        const responseManana = await fetch(`https://web-tis-app-production.up.railway.app/get_ordenes_por_fecha.php?fecha_entrega=${manana}`);
        const resultManana = await responseManana.json();
        if (resultManana.success) {
          setOrdenesManana(resultManana.data || []);
        } else {
          throw new Error(resultManana.error || 'Error al obtener las órdenes para mañana');
        }

        // Obtener órdenes para pasado mañana
        const responsePasadoManana = await fetch(`https://web-tis-app-production.up.railway.app/get_ordenes_por_fecha.php?fecha_entrega=${pasadoManana}`);
        const resultPasadoManana = await responsePasadoManana.json();
        if (resultPasadoManana.success) {
          setOrdenesPasadoManana(resultPasadoManana.data || []);
        } else {
          throw new Error(resultPasadoManana.error || 'Error al obtener las órdenes para pasado mañana');
        }
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
        <h1 className="header-title">Menu</h1>
        <nav>
          <ul>
            <li><a href="/nueva_orden">Nueva Orden</a></li>
            <li><a href="/barra_trabajos">Barra de Trabajos</a></li>
            <li>
              <a href="#!" onClick={toggleRegisterOptions}>Buscador</a>
              {showRegisterOptions && (
                <ul className="submenu">
                  <li><a href="/registro_est_ind">Trabajos</a></li>
                  <li><a href="/registro_est_lot">Contactos</a></li>
                </ul>
              )}
            </li>
            <li>
              <a href="#!" onClick={toggleCriteriosOptions}>Pendientes</a>
              {showCriteriosOptions && (
                <ul className="submenu">
                  <li><a href="/Ver_criterios">Trabajos regulares</a></li>
                  <li><a href="/Reg_criterios">Urgentes</a></li>
                  <li><a href="/Val_criterios_eval">Encargo especiales</a></li>
                  <li><a href="/Val_criterios_auto">Largo Plazo</a></li>
                </ul>
              )}
            </li>
            <li><a href="/registro_eva">Notas</a></li>
            <li><a href="/registro_eva">Configuracion</a></li>
            <li><a href="/">Cerrar Sesión</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1 style={{ color: '#CC1616' }}>Barra de Tareas</h1>
        <h3 style={{ color: '#333' }}>Órdenes de trabajo no entregadas</h3>
        <div className="taskboard">
          {/* Columna para hoy */}
          <div className="column">
            <h5>Entregar Hoy</h5>
            {ordenesHoy.map((orden) => (
              <div key={orden.id} className="card">
                <h3>{orden.paciente}</h3>
                <p><strong>Descripción:</strong> {orden.descripcion}</p>
                <p><strong>Odontólogo:</strong> {orden.odontologo}</p>
                <p><strong>Fecha de entrega:</strong> {orden.fecha_entrega}</p>
              </div>
            ))}
          </div>

          {/* Columna para mañana */}
          <div className="column">
            <h5>Entregar Mañana</h5>
            {ordenesManana.map((orden) => (
              <div key={orden.id} className="card">
                <h3>{orden.paciente}</h3>
                <p><strong>Descripción:</strong> {orden.descripcion}</p>
                <p><strong>Odontólogo:</strong> {orden.odontologo}</p>
                <p><strong>Fecha de entrega:</strong> {orden.fecha_entrega}</p>
              </div>
            ))}
          </div>

          {/* Columna para pasado mañana */}
          <div className="column">
            <h5>Entregar P. Mañana</h5>
            {ordenesPasadoManana.map((orden) => (
              <div key={orden.id} className="card">
                <h3>{orden.paciente}</h3>
                <p><strong>Descripción:</strong> {orden.descripcion}</p>
                <p><strong>Odontólogo:</strong> {orden.odontologo}</p>
                <p><strong>Fecha de entrega:</strong> {orden.fecha_entrega}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BarraTareas;