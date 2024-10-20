import React, { useState } from 'react';
import './Menu_est.css';
import logo from '../images/logo.png';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate para redirigir

function MenuEst() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const location = useLocation();
  const { username } = location.state || {}; // Extraer el username del estado
  const navigate = useNavigate(); // Hook para redirigir
  localStorage.setItem('username', username);
  console.log("Username recibido:", username);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
  };

  const handleModifyGroup = () => {
    
    if (username) {
        navigate('/select_grupo'); // Redirigir a "Modificar Grupo" con el username
    } else {
        console.error("Username no disponible"); // Mensaje en caso de que el username no esté definido
    }
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
                  <li><a href="#!" onClick={handleModifyGroup}>Modificar Grupo</a></li> {/* Cambia el enlace aquí */}
                </ul>
              )}
            </li>
            <li><a href="/perfin">Tareas pendientes</a></li>
            <li><a href="/perfin">Cronograma de actividades</a></li>
            <li><a href="/perfin">Historial de evaluaciones</a></li>
            <li><a href="/evaluacion_semanal/actas_semanales">Actas Semanales</a></li>
            <li><a href="/perfin">Ver grupo</a></li>
            <li><a href="/perfin">Perfil</a></li>
            <li><a href="/perfin">Darse de baja</a></li>
            <li><a href="/est_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido al menú principal</h1>
        <h3>Esta es la página principal para Estudiante para la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuEst;
