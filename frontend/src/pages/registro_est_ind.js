import React, { useState} from 'react';
import './registro_est_ind.css'; // Asegúrate de crear y ajustar los estilos
import logo from '../images/logo.png';

function RegistroEstInd() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  }
  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    codsis: '',
    carrera: '' // Este campo se mantendrá como string, pero será un select
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Transformar la carrera en un número antes de enviar
    const carreraValue = formData.carrera === "Ing. Informatica" ? 1 : 2;
  
    try {
      const response = await fetch('https://web-tis-app-production.up.railway.app/reg_est_ind.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          codsis: formData.codsis,
          carrera: carreraValue,
        }),
      });
  
      const data = await response.json();
      if(data.response===true){console.log('true')}
        // Restablecer el formulario a su estado inicial
        setFormData({
          nombres: '',
          apellidos: '',
          codsis: '',
          carrera: '',
        });
  
        const redirect = window.confirm('Estudiante registrado exitosamente! ¿Quieres ir a la lista de estudiantes?');
        if (redirect) {
          window.location.href = '/lista_estudiantes';
        }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert('Ocurrió un error al enviar los datos.');
    }
  };
  

  return (
    <div className="menu-container">
    <aside className="sidebar">
      <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
      <h1 className="header-title">Docente</h1>
      <nav>
 <ul>
  <li>
    <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
    {showRegisterOptions && (
      <ul className="submenu">
        <li><a href="/registro_est_ind">Registro Individual</a></li>
        <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
      </ul>
    )}
  </li>
  <li>
    <a href="#!" onClick={toggleCriteriosOptions}>Criterios de Evaluación</a>
    {showCriteriosOptions && (
      <ul className="submenu">
        <li><a href="/Ver_criterios">Ver Criterios de Evaluación</a></li>
        <li><a href="/Reg_criterios">Registrar Criterios de Evaluación</a></li>
        <li><a href="/Val_criterios_eval">Validar Criterios de Evaluación de pares</a></li>
        <li><a href="/Val_criterios_auto">Validar Criterios de Autoevaluacion</a></li>
      </ul>
    )}
  </li>
  <li><a href="/tabla_evaluaciones">Ver evaluaciones</a></li>
  <li><a href="/registro_eva">Programar evaluaciones</a></li>
  <li><a href="/">Cerrar Sesión</a></li>
</ul>
</nav>

      </aside>
      <main className="content">
        <h1>Registro Individual de Estudiantes</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="nombres">Nombres:</label>
            <input 
              type="text" 
              id="nombres" 
              name="nombres" 
              value={formData.nombres} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellidos">Apellidos:</label>
            <input 
              type="text" 
              id="apellidos" 
              name="apellidos" 
              value={formData.apellidos} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="codsis">Código SIS:</label>
            <input 
              type="text" 
              id="codsis" 
              name="codsis" 
              value={formData.codsis} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="carrera">Carrera:</label>
            <select 
              id="carrera" 
              name="carrera" 
              value={formData.carrera} 
              onChange={handleInputChange} 
              required
            >
              <option value="" disabled>Seleccione una carrera</option>
              <option value="Ing. Informatica">Ing. Informatica</option>
              <option value="Ing. Sistemas">Ing. Sistemas</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Registrar Estudiante</button>
        </form>
      </main>
    </div>
  );
}

export default RegistroEstInd;
