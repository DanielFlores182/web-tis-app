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
    entregado: false,
    fechaRecibo: '',
    fechaEntrega: '',
    edad: '',
    sexo: '',
    telefono_o: '', // Teléfono del odontólogo
    ingresa: {
      Antagonista: false,
      Articulador: false,
    },
    implante: {
      Transfer: false,
      Análogo: false,
      Tornillo: false,
      Uclas: false,
      Otros: false,
    },
    caraoclusal: {
      Si: false,
      No: false,
    },
    zonacervical: {
      Oscura: false,
      Normal: false,
    },
    incisal: {
      Translucida: false,
      Normal: false,
    },
    mamelones: {
      Si: false,
      No: false,
    },
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
      const response = await fetch('http://web-tis-app-production.up.railway.app/insertar_orden.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envía el estado del formulario como JSON
      });
  
      const result = await response.json();
  
      if (result.success) {
        alert('Orden de trabajo registrada con éxito. ID: ' + result.id);
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
        <h1 className="header-title">Menu</h1>
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
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
              <label><input type="checkbox" name="ingresa.Antagonista" checked={formData.ingresa.Antagonista} onChange={handleInputChange} /> Antagonista</label>
              <label><input type="checkbox" name="ingresa.Articulador" checked={formData.ingresa.Articulador} onChange={handleInputChange} /> Articulador</label>
            </div>
            <div className="group">
              <h4>Implante</h4>
              <label><input type="checkbox" name="implante.Transfer" checked={formData.implante.Transfer} onChange={handleInputChange} /> Transfer</label>
              <label><input type="checkbox" name="implante.Análogo" checked={formData.implante.Análogo} onChange={handleInputChange} /> Análogo</label>
              <label><input type="checkbox" name="implante.Tornillo" checked={formData.implante.Tornillo} onChange={handleInputChange} /> Tornillo</label>
              <label><input type="checkbox" name="implante.Uclas" checked={formData.implante.Uclas} onChange={handleInputChange} /> Uclas Mec.</label>
              <label><input type="checkbox" name="implante.Otros" checked={formData.implante.Otros} onChange={handleInputChange} /> Otros</label>
            </div>
            <div className="group">
              <h4>Cara Oclusal</h4>
              <label><input type="checkbox" name="caraoclusal.Si" checked={formData.caraoclusal.Si} onChange={handleInputChange} /> Sí</label>
              <label><input type="checkbox" name="caraoclusal.No" checked={formData.caraoclusal.No} onChange={handleInputChange} /> No</label>
            </div>
            <div className="group">
              <h4>Zona Cervical</h4>
              <label><input type="checkbox" name="zonacervical.Oscura" checked={formData.zonacervical.Oscura} onChange={handleInputChange} /> Oscura</label>
              <label><input type="checkbox" name="zonacervical.Normal" checked={formData.zonacervical.Normal} onChange={handleInputChange} /> Normal</label>
            </div>
            <div className="group">
              <h4>Incisal</h4>
              <label><input type="checkbox" name="incisal.Translucida" checked={formData.incisal.Translucida} onChange={handleInputChange} /> Translúcida</label>
              <label><input type="checkbox" name="incisal.Normal" checked={formData.incisal.Normal} onChange={handleInputChange} /> Normal</label>
            </div>
            <div className="group">
              <h4>Mamelones</h4>
              <label><input type="checkbox" name="mamelones.Si" checked={formData.mamelones.Si} onChange={handleInputChange} /> Sí</label>
              <label><input type="checkbox" name="mamelones.No" checked={formData.mamelones.No} onChange={handleInputChange} /> No</label>
            </div>
          </div>

          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
}

export default NuevaOrden;