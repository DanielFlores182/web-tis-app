import React, { useState } from 'react';
import './Menu_doc.css';
import logo from '../images/logo.png';


function MenuDoc() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
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
            <li><a href="/reg_criterios">Ver Criterios de evaiacion</a></li>
            <li><a href="/perfil">Ver evaluaciones</a></li>
            <li><a href="/registro_evaluacion">Programar evaluaciones</a></li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/doc_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido al menú principal</h1>
        <h3>Esta es la pagina principal para Docentes para el control de la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuDoc;