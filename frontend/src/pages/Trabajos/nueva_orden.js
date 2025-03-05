import React, { useState } from 'react';
import './nueva_orden.css';
import logo from '../../images/dentall 1.png';

function NuevaOrden() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    clinica: '',
    odontologo: '',
    direccion: '',
    telefono: '',
    descripcion: '',
    paciente: '',
    colorimetro: '',

    urgente: false,
    regular: false,
    especial: false,
    largoplazo: false,
    entregado: false,
    
    fechaRecibo: '',
    fechaEntrega: '',
    edad: '',
    sexo: '',
    telefono_o: '', // Teléfono del odontólogo

    ingresa_antagonista: false,
    ingresa_articulador: false,
    
    implante_transfer: false,
    implante_analogo: false,
    implante_tornillo: false,
    implante_uclas: false,
    implante_otros: false,
    
    caraoclusal_si: false,
    caraoclusal_no: false,
    
    zonacervical_oscura: false,
    zonacervical_normal: false,
    
    incisal_translucida: false,
    incisal_normal: false,
    
    mamelones_si: false,
    mamelones_no: false,
  });

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://web-tis-app-production.up.railway.app/insertar_orden.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envía el estado del formulario como JSON
      });
      //console.log(JSON.stringify(formData))
      const result = await response.json();
  
      if (result.success) {
        alert('Orden de trabajo registrada con éxito. ID: ' + result.id);
        // Mostrar confirmación
        const confirmarNuevaOrden = window.confirm('¿Quieres registrar una nueva orden?');

        if (confirmarNuevaOrden) {
          // Limpiar el formulario
          window.location.href = '/nueva_orden';
        } else {
          // Redirigir al menú principal
          window.location.href = '/menu_principal';
        }
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Error al enviar el formulario.');
    }
  };
  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
        <h1 className="header-title">Nueva Orden</h1>
        <nav>
          <ul>
            <li><a href="/menu_principal">Menu</a></li>
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
        <h1>Registrar Nueva Orden de Trabajo</h1>
        <form onSubmit={handleSubmit} className="register-form">
          {/* Opciones adicionales */}
          <div className="form-group">
            <label>
              <input type="checkbox" name="urgente" checked={formData.urgente} onChange={handleInputChange} />
              Urgente
            </label>
            <label>
              <input type="checkbox" name="regular" checked={formData.regular} onChange={handleInputChange} />
              Regular
            </label>
            <label>
              <input type="checkbox" name="especial" checked={formData.especial} onChange={handleInputChange} />
              Especial
            </label>
            <label>
              <input type="checkbox" name="largoplazo" checked={formData.largoplazo} onChange={handleInputChange} />
              Largo Plazo
            </label>
          </div>

          {/* Campo de odontólogo */}
          <div className="form-group">
            <label htmlFor="odontologo">Odontólogo:</label>
            <input
              type="text"
              id="odontologo"
              name="odontologo"
              value={formData.odontologo}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de teléfono del odontólogo */}
          <div className="form-group">
            <label htmlFor="telefono_o">Teléfono Odont:</label>
            <input
              type="text"
              id="telefono_o"
              name="telefono_o"
              value={formData.telefono_o}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de clínica */}
          <div className="form-group">
            <label htmlFor="clinica">Clínica:</label>
            <input
              type="text"
              id="clinica"
              name="clinica"
              value={formData.clinica}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de dirección */}
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de teléfono */}
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de descripción */}
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Campo de paciente */}
          <div className="form-group">
            <label htmlFor="paciente">Paciente:</label>
            <input
              type="text"
              id="paciente"
              name="paciente"
              value={formData.paciente}
              onChange={handleInputChange}
            />
          </div>
          {/* Campo de edad */}
          <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de sexo */}
          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
            >
              <option value="" disabled>Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          {/* Campo de colorímetro */}
          <div className="form-group">
            <label htmlFor="colorimetro">Colorímetro:</label>
            <input
              type="text"
              id="colorimetro"
              name="colorimetro"
              value={formData.colorimetro}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de fecha de recibo */}
          <div className="form-group">
            <label htmlFor="fechaRecibo">Fecha de Recibo:</label>
            <input
              type="date"
              id="fechaRecibo"
              name="fechaRecibo"
              value={formData.fechaRecibo}
              onChange={handleInputChange}
            />
          </div>

          {/* Campo de fecha de entrega */}
          <div className="form-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
            <input
              type="date"
              id="fechaEntrega"
              name="fechaEntrega"
              value={formData.fechaEntrega}
              onChange={handleInputChange}
            />
          </div>

          {/* Checkboxes */}
          <div className="checkbox-container">
            <div className="group">
              <h4>Ingresa</h4>
              <label><input type="checkbox" name="ingresa_antagonista" checked={formData.ingresa_antagonista} onChange={handleInputChange} /> Antagonista</label>
              <label><input type="checkbox" name="ingresa_articulador" checked={formData.ingresa_articulador} onChange={handleInputChange} /> Articulador</label>
            </div>
            <div className="group">
              <h4>Implante</h4>
              <label><input type="checkbox" name="implante_transfer" checked={formData.implante_transfer} onChange={handleInputChange} /> Transfer</label>
              <label><input type="checkbox" name="implante_analogo" checked={formData.implante_analogo} onChange={handleInputChange} /> Análogo</label>
              <label><input type="checkbox" name="implante_tornillo" checked={formData.implante_tornillo} onChange={handleInputChange} /> Tornillo</label>
              <label><input type="checkbox" name="implante_uclas" checked={formData.implante_uclas} onChange={handleInputChange} /> Uclas Mec.</label>
              <label><input type="checkbox" name="implante_otros" checked={formData.implante_otros} onChange={handleInputChange} /> Otros</label>
            </div>
            <div className="group">
              <h4>Cara Oclusal</h4>
              <label><input type="checkbox" name="caraoclusal_si" checked={formData.caraoclusal_si} onChange={handleInputChange} /> Sí</label>
              <label><input type="checkbox" name="caraoclusal_no" checked={formData.caraoclusal_no} onChange={handleInputChange} /> No</label>
            </div>
            <div className="group">
              <h4>Zona Cervical</h4>
              <label><input type="checkbox" name="zonacervical_oscura" checked={formData.zonacervical_oscura} onChange={handleInputChange} /> Oscura</label>
              <label><input type="checkbox" name="zonacervical_normal" checked={formData.zonacervical_normal} onChange={handleInputChange} /> Normal</label>
            </div>
            <div className="group">
              <h4>Incisal</h4>
              <label><input type="checkbox" name="incisal_translucida" checked={formData.incisal_translucida} onChange={handleInputChange} /> Translúcida</label>
              <label><input type="checkbox" name="incisal_normal" checked={formData.incisal_normal} onChange={handleInputChange} /> Normal</label>
            </div>
            <div className="group">
              <h4>Mamelones</h4>
              <label><input type="checkbox" name="mamelones_si" checked={formData.mamelones_si} onChange={handleInputChange} /> Sí</label>
              <label><input type="checkbox" name="mamelones_no" checked={formData.mamelones_no} onChange={handleInputChange} /> No</label>
            </div>
          </div>

          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
}

export default NuevaOrden;