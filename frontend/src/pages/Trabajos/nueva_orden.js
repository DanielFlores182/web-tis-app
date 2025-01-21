import React, { useState } from 'react';
import './nueva_orden.css';
import logo from '../../images/dentall 1.png';

function RegistroEstInd() {
     const [showRegisterOptions, setShowRegisterOptions] = useState(false);
      const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
    
      const toggleRegisterOptions = () => {
        setShowRegisterOptions(!showRegisterOptions);
      };
    
      const toggleCriteriosOptions = () => {
        setShowCriteriosOptions(!showCriteriosOptions);
      };
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Formulario enviado exitosamente.');
  };
  

  return (
    <div className="menu-container">
     <aside className="sidebar">
             <img src={logo} alt="Logo de la Empresa" className="header-logo" />
             <h1 className="header-title">Menu</h1>
             <nav>
               <ul>
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
          {/* Campos principales */}
          <div className="form-group">
            <label htmlFor="clinica">Clínica:</label>
            <input type="text" id="clinica" name="clinica" value={formData.clinica} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="odontologo">Odontólogo:</label>
            <input type="text" id="odontologo" name="odontologo" value={formData.odontologo} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="paciente">Paciente:</label>
            <input type="text" id="paciente" name="paciente" value={formData.paciente} onChange={handleInputChange} required />
          </div>
           {/* Edad y Sexo */}
           <div className="form-group">
            <label htmlFor="edad">Edad:</label>
            <input type="number" id="edad" name="edad" value={formData.edad} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select id="sexo" name="sexo" value={formData.sexo} onChange={handleInputChange}>
              <option value="" disabled>Seleccione</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="colorimetro">Colorímetro:</label>
            <input type="text" id="colorimetro" name="colorimetro" value={formData.colorimetro} onChange={handleInputChange} required />
          </div>

          {/* Fechas */}
          <div className="form-group">
            <label htmlFor="fechaRecibo">Fecha de Recibo:</label>
            <input type="date" id="fechaRecibo" name="fechaRecibo" value={formData.fechaRecibo} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="fechaEntrega">Fecha de Entrega:</label>
            <input type="date" id="fechaEntrega" name="fechaEntrega" value={formData.fechaEntrega} onChange={handleInputChange} />
          </div>
         
          <div class="checkbox-container">
            <div class="group">
                <h4>Ingresa</h4>
                <label><input type="checkbox"></input> Antagonista</label>
                <label><input type="checkbox"></input> Articulador</label>
            </div>
            <div class="group">
                <h4>Implante</h4>
                <label><input type="checkbox"></input> Transfer</label>
                <label><input type="checkbox"></input> Análogo</label>
                <label><input type="checkbox"></input> Tornillo</label>
                <label><input type="checkbox"></input> Uclas Mec.</label>
                <label><input type="checkbox"></input> Otros</label>
            </div>
            <div class="group">
                <h4>Cara Oclusal</h4>
                <label><input type="checkbox"></input> Sí</label>
                <label><input type="checkbox"></input> No</label>
            </div>
            <div class="group">
                <h4>Zona Cervical</h4>
                <label><input type="checkbox"></input> Oscura</label>
                <label><input type="checkbox"></input> Normal</label>
            </div>
            <div class="group">
                <h4>Incisal</h4>
                <label><input type="checkbox"></input> Translúcida</label>
                <label><input type="checkbox"></input> Normal</label>
                
            </div>
            <div class="group">
                <h4>Mamelones</h4>
                <label><input type="checkbox"></input> Sí</label>
                <label><input type="checkbox"></input> No</label>
            </div>
            </div>

          <button type="submit" className="submit-button">Registrar</button>
        </form>
      </main>
    </div>
  );
}

export default RegistroEstInd;
