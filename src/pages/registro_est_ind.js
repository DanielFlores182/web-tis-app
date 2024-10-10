import React, { useState } from 'react';
import './registro_est_ind.css'; // Asegúrate de crear y ajustar los estilos

function RegistroEstInd() {

  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    codsis: '',
    carrera: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar la lógica para enviar los datos al backend
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="menu-container">
    <aside className="sidebar">
        <nav>
          <ul>
            <li>
              <a href="#!" onClick={toggleRegisterOptions}>Registrar Estudiante</a>
              {showRegisterOptions && (
                <ul className="submenu">
                  <li><a href="/registro_est_lot">Registrar Por Lote</a></li>
                </ul>
              )}
            </li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
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
            <label htmlFor="codsis">Codigo Sis:</label>
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
            <input 
              type="text" 
              id="carrera" 
              name="carrera" 
              value={formData.carrera} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          <button type="submit" className="submit-button">Registrar Estudiante</button>
        </form>
      </main>
    </div>
  );
}

export default RegistroEstInd;
