import React, { useState } from 'react';
import './registro_eva.css';
import logo from '../images/logo.png';

const RegistroEvaluacion = () => {
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
    }
    const toggleCriteriosOptions = () => {
      setShowCriteriosOptions(!showCriteriosOptions);
    };
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        tipo_eva: '',
        descripcion_eva: '',
        fecha_ini: '',
        fecha_fin: ''
    });

    // Función para manejar el cambio de valores en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEvaluationSubmit = async (e) => {
      e.preventDefault();
  
      try {
          const response = await fetch('https://web-tis-app-production.up.railway.app/reg_tipo_eva.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  tipo_eva: formData.tipo_eva,
                  descripcion_eva: formData.descripcion_eva,
                  fecha_ini: formData.fecha_ini,
                  fecha_fin: formData.fecha_fin,
              })
          });
  
          if (!response.ok) {
              throw new Error('Error en la respuesta del servidor');
          }
  
          const data = await response.json();
  
          // Maneja la respuesta del servidor
          if (data.success) {
            alert('Evaluación registrada exitosamente!');
        } else {
            alert('Mensaje: ' + data.message); // Esto mostrará el campo "message" siempre
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
    <li><a href="/perfil">Ver evaluaciones</a></li>
    <li><a href="/registro_eva">Programar evaluaciones</a></li>
    <li><a href="/">Cerrar Sesión</a></li>
  </ul>
</nav>

      </aside>

            {/* Contenido principal */}
            <main className="content card px-5">
                <div className="text-danger text-center">
                    <h2>Registro de evaluación</h2>
                </div>
                <div className="pb-5 text-center">
                    Complete el siguiente formulario para registrar una evaluación.
                </div>
                <div className="card-body background px-5 rounded">
                    <form onSubmit={handleEvaluationSubmit}>
                        <div className="title-custome text-light mb-3">
                            <h4><b>Programar Evaluación</b></h4>
                        </div>

                        {/* Tipo de Evaluación */}
                        <div className="form-floating mb-3">
                            <select
                                className="form-select"
                                name="tipo_eva"
                                value={formData.tipo_eva}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Seleccione el tipo de evaluación</option>
                                <option value="Autoevaluación">Autoevaluación</option>
                                <option value="Evaluación por pares">Evaluación por pares</option>
                                <option value="Evaluación cruzada">Evaluación cruzada</option>
                            </select>
                            <label>Tipo de evaluación</label>
                        </div>

                        {/* Descripción */}
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control"
                                name="descripcion_eva"
                                placeholder="Descripción de la Evaluación"
                                value={formData.descripcion_eva}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Descripción</label>
                        </div>

                        {/* Fecha de inicio */}
                        <div className="form-floating mb-3">
                            <input
                                type="date"
                                className="form-control"
                                name="fecha_ini"
                                value={formData.fecha_ini}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Fecha de inicio</label>
                        </div>

                        {/* Fecha de vencimiento */}
                        <div className="form-floating mb-3">
                            <input
                                type="date"
                                className="form-control"
                                name="fecha_fin"
                                value={formData.fecha_fin}
                                onChange={handleInputChange}
                                required
                            />
                            <label>Fecha de vencimiento</label>
                        </div>

                        {/* Botón para registrar */}
                        <button className="btn btn-primary" type="submit">Registrar evaluación</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default RegistroEvaluacion;