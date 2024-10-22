import React, {useState} from 'react';
import './Menu_est.css';
import logo from '../images/logo.png';

function MenuEst() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };   
  const toggleRegisterPlanningOptions = () => {
    setShowRegisterPlanningOptions(!showRegisterPlanningOptions); // Cambiar entre mostrar y ocultar
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo"></img>
        <h1 className="header-title">Estudiante</h1>
        <nav>
          <ul>
          <li>
              <a href="#!" onClick={toggleRegisterOptions}>Registrar Grupo</a>
              {showRegisterOptions && (
                <ul className="submenu">
                  <li><a href="/registrar_grupo">Nuevo Grupo</a></li>
                  <li><a href="/agregar_est">Agregar Estudiantes</a></li>
                </ul>
              )}
            </li>  
            <li>
              <a href="#!" onClick={toggleRegisterPlanningOptions}>Registrar Planificacion</a>
              {showRegisterPlanningOptions && (
                <ul className="submenu">
                  <li><a href="/registro_planificacion">Crear Plan</a></li>
                  <li><a href="/asignar_tareas">Asignar Tareas</a></li>
                </ul>
              )}
            </li>  
           <li><a href="/perfin">Tareas pendientes</a></li>
           <li><a href="/perfin">Cronograma de actividades</a></li>
           <li><a href="/perfin">Historial de evaluaciones</a></li>
           <li><a href="/perfin">Ver grupo</a></li>
            
            <li><a href="/perfin">Darse de baja</a></li>
            <li><a href="/est_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido al menú principal</h1>
        <h3>Esta es la pagina principal para Estudiante para la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuEst;
