import React, { useState, toggleRegisterOptions, showRegisterOptions } from 'react';
import './registro_est_ind.css'; // Asegúrate de crear y ajustar los estilos

function RegistroEstInd() {
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
      const response = await fetch('http://localhost:8081/web-tis-app/backend/reg_est_ind.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: formData.nombres, // Enviar el nombre
          apellidos: formData.apellidos, // Enviar el apellido
          codsis: formData.codsis, // Enviar el código SIS
          carrera: carreraValue, // Enviar el valor numérico
        }) 
      });

      const data = await response.json();
      
      // Maneja la respuesta del servidor
      if (data.success) {
        alert('Estudiante registrado exitosamente!');
      } else {
        alert('Mensaje: ' + data.message);
      }
    } catch (error) {
      console.error('Error en el envío:', error);
      alert('Ocurrió un error al enviar los datos.');
    }
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
                  <li><a href="/registro_est_ind">Registro Individual</a></li>
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
