import React, { useState } from 'react';
import './registro_eva.css';
import logo from '../images/logo.png';

const RegistroEvaluacion = () => {
    // Estado para controlar la visualización de opciones en "Registrar Estudiante"
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  
    // Función para alternar las opciones del submenú
    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions);
    };

    const handleEvaluationSubmit = (e) => {
        e.preventDefault();
        // Lógica para manejar el formulario de evaluación
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
            <li><a href="/perfil">Ver grupos</a></li>
            <li><a href="/perfil">Ver evaluaciones</a></li>
            <li><a href="/registro_evaluacion">Programar evaluaciones</a></li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
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
              <select className="form-select" required>
                <option value="" disabled>Seleccione el tipo de evaluación</option>
                <option value="Examen">Autoevaluación</option>
                <option value="Proyecto">Evaluación por pares</option>
                <option value="Práctica">Evaluación cruzada</option>
              </select>
              <label>Tipo de evaluación</label>
            </div>

            {/* Descripción */}
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Descripción de la Evaluación"
                required
              />
              <label>Descripción</label>
            </div>

            {/* Fecha de inicio */}
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                required
              />
              <label>Fecha de inicio</label>
            </div>

            {/* Fecha de vencimiento */}
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
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