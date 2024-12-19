import React, { useState } from 'react';
import './Menu_doc.css';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

function MenuDoc() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
  const navigate = useNavigate();

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };

  const handleListaEstudiantes = () => {
    navigate('/lista_estudiantes');
  };

  const handleTablaAnuncios = () => {
    navigate('/tabla_anuncios');
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
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
        <h1 style={{ color: '#CC1616' }}>Bienvenido,</h1>
        <h3 style={{ color: '#333' }}>Esta es la página principal para Docentes para el control de la materia TIS</h3>
        <p style={{ color: '#666' }}>Selecciona una opción de la barra de navegación o verifica los reportes abajo</p>
        <div className="button-group">
          <button className="central-button" onClick={handleListaEstudiantes}>
            Lista de Estudiantes
          </button>
          <button className="central-button" onClick={handleTablaAnuncios}>
            Tabla de Anuncios
          </button>
        </div>
      </main>
    </div>
  );
}

export default MenuDoc;
