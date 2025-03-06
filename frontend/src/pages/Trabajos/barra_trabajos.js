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
  const [selectedOrden, setSelectedOrden] = useState(null); // Estado para la orden seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

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

    // Formatear la fecha en YYYY-MM-DD según la zona horaria local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Función para abrir el modal con los detalles de la orden
  const openModal = (orden) => {
    setSelectedOrden(orden); // Guardar la orden seleccionada
    setShowModal(true); // Mostrar el modal
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false); // Ocultar el modal
    setSelectedOrden(null); // Limpiar la orden seleccionada
  };

  // Obtener las órdenes no entregadas desde el backend
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const hoy = getLocalDate(0); // Fecha de hoy
        const manana = getLocalDate(1); // Fecha de mañana
        const pasadoManana = getLocalDate(2); // Fecha de pasado mañana
        console.log("Fechas:", hoy, manana, pasadoManana);

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
  const imprimirOrdenesHoy = () => {
    const ordenesHtml = ordenesHoy.map((orden) => {
      return `
        <div class="orden">
          <h3>Detalles de la Orden</h3>
          <table>
            <tr><td><strong>Urgente:</strong></td><td>${orden.urgente ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Regular:</strong></td><td>${orden.regular ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Estetico:</strong></td><td>${orden.especial ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Largo Plazo:</strong></td><td>${orden.largoplazo ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Paciente:</strong></td><td>${orden.paciente}</td></tr>
            <tr><td><strong>Descripción:</strong></td><td>${orden.descripcion}</td></tr>
            <tr><td><strong>Odontólogo:</strong></td><td>${orden.odontologo}</td></tr>
            <tr><td><strong>Fecha de entrega:</strong></td><td>${orden.fecha_entrega}</td></tr>
            <tr><td><strong>Clínica:</strong></td><td>${orden.clinica}</td></tr>
            <tr><td><strong>Dirección:</strong></td><td>${orden.direccion}</td></tr>
            <tr><td><strong>Tel. Odontólogo:</strong></td><td>${orden.telefono_dentista}</td></tr>
            <tr><td><strong>Tel. Clínica:</strong></td><td>${orden.telefono_clinica}</td></tr>
            <tr><td><strong>Colorímetro:</strong></td><td>${orden.colorimetro}</td></tr>
            <tr><td><strong>Edad:</strong></td><td>${orden.edad}</td></tr>
            <tr><td><strong>Género:</strong></td><td>${orden.genero}</td></tr>
            <tr><td><strong>Antagonista:</strong></td><td>${orden.antagonista ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Articulador:</strong></td><td>${orden.articulador ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Transfer:</strong></td><td>${orden.transfer ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Analogo:</strong></td><td>${orden.analogo ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Tornillo:</strong></td><td>${orden.tornillo ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Uclas Mec:</strong></td><td>${orden.uclas ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Otros:</strong></td><td>${orden.otros ? 'Sí (ver descripcion)' : 'No'}</td></tr>
            <tr><td><strong>Cara Oclusal:</strong></td><td>${orden.cara_oclusal_si ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Oscura:</strong></td><td>${orden.zona_cervical_oscura ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Translucida:</strong></td><td>${orden.incisal_translucida ? 'Sí' : 'No'}</td></tr>
            <tr><td><strong>Mamelones:</strong></td><td>${orden.mamelones_si ? 'Sí' : 'No'}</td></tr>
          </table>
        </div>
      `;
    }).join('');
  
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(`
      <html>
        <head>
          <title>Órdenes de Hoy</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              font-size: 9pt; /* Reducir tamaño de la fuente */
            }
            .page {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              gap: 20px;
            }
            .orden {
              border: 1px solid #000;
              margin: 10px;
              padding: 10px;
              width: 48%; /* Para 2 órdenes por fila */
              box-sizing: border-box;
              page-break-inside: avoid; /* Evitar que las órdenes se dividan entre páginas */
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table td {
              padding: 5px;
              border: 1px solid #ddd;
            }
            @page {
              size: letter;
              margin: 1in;
            }
          </style>
        </head>
        <body>
          <div class="page">
            ${ordenesHtml}
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };
    

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
            <li><a href="/menu_principal">Menu</a></li>
            <li><a href="/nueva_orden">Nueva Orden</a></li>
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
        <button className="btn rounded-pill px-3" onClick={imprimirOrdenesHoy}>Imprimir Órdenes de Hoy</button>
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
                <button class="btn btn-warning rounded-pill px-3" onClick={() => openModal(orden)}>Ver</button>
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
                <button class="btn btn-warning rounded-pill px-3" onClick={() => openModal(orden)}>Ver</button>
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
                <button class="btn btn-warning rounded-pill px-3" onClick={() => openModal(orden)}>Ver</button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal para mostrar los detalles de la orden */}
        {showModal && selectedOrden && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              
              <h3>Detalles de la Orden</h3>
              <div className="modal-body">
                <table>
                  <tbody>
                    <tr><td><strong>Urgente:</strong></td><td>{selectedOrden.urgente ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Regular:</strong></td><td>{selectedOrden.regular ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Estetico:</strong></td><td>{selectedOrden.especial ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Largo Plazo:</strong></td><td>{selectedOrden.largoplazo ? 'Sí' : 'No'}</td></tr>
                    <p>.</p>
                    <tr><td><strong>Paciente:</strong></td><td>{selectedOrden.paciente}</td></tr>
                    <tr><td><strong>Descripción:</strong></td><td>{selectedOrden.descripcion}</td></tr>
                    <tr><td><strong>Odontólogo:</strong></td><td>{selectedOrden.odontologo}</td></tr>
                    <tr><td><strong>Fecha de entrega:</strong></td><td>{selectedOrden.fecha_entrega}</td></tr>
                    <tr><td><strong>Clínica:</strong></td><td>{selectedOrden.clinica}</td></tr>
                    <tr><td><strong>Dirección:</strong></td><td>{selectedOrden.direccion}</td></tr>
                    <tr><td><strong>Tel. Odontólogo:</strong></td><td>{selectedOrden.telefono_dentista}</td></tr>
                    <tr><td><strong>Tel. Clínica:</strong></td><td>{selectedOrden.telefono_clinica}</td></tr>
                    <tr><td><strong>Colorímetro:</strong></td><td>{selectedOrden.colorimetro}</td></tr>
                    <tr><td><strong>Edad:</strong></td><td>{selectedOrden.edad}</td></tr>
                    <tr><td><strong>Género:</strong></td><td>{selectedOrden.genero}</td></tr>
                    <p>.</p>
                    <p>Ingresa</p>
                    <tr><td><strong>Antagonista:</strong></td><td>{selectedOrden.antagonista ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Articulador:</strong></td><td>{selectedOrden.articulador ? 'Sí' : 'No'}</td></tr>
                    <p>.</p>
                    <p>Implante</p>
                    <tr><td><strong>Transfer:</strong></td><td>{selectedOrden.transfer ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Analogo:</strong></td><td>{selectedOrden.analogo ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Tornillo:</strong></td><td>{selectedOrden.tornillo ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Uclas Mec:</strong></td><td>{selectedOrden.uclas ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>Otros:</strong></td><td>{selectedOrden.otros ? 'Sí (ver descripcion)' : 'No'}</td></tr>
                    <p>.</p>
                    <tr><td><strong>Cara Oclusal:</strong></td><td>{selectedOrden.cara_oclusal_si ? 'Sí' : 'No'}</td></tr>
                    <p>.</p>
                    <p>Zona Cervical</p>
                    <tr><td><strong>Oscura:</strong></td><td>{selectedOrden.zona_cervical_oscura ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>normal:</strong></td><td>{selectedOrden.zona_cervical_normal ? 'Sí' : 'No'}</td></tr>
                    <p>.</p>
                    <p>Incisal</p>
                    <tr><td><strong>Translucida:</strong></td><td>{selectedOrden.incisal_translucida ? 'Sí' : 'No'}</td></tr>
                    <tr><td><strong>normal:</strong></td><td>{selectedOrden.incisal_normal ? 'Sí' : 'No'}</td></tr>
                    <p>.</p>
                    <tr><td><strong>Mamelones:</strong></td><td>{selectedOrden.mamelones_si ? 'Sí' : 'No'}</td></tr>
                  </tbody>
                </table>
              </div>
              <button class="btn btn-warning rounded-pill px-3" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}

    </div>
  );
}

export default BarraTareas;