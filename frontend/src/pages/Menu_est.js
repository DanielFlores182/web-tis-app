// src/MenuEst.js
import React, { useState } from 'react';
import './Menu_est.css';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../controller/userContex'; // Importar el contexto

function MenuEst() {
  const { username } = useUser(); // Extraer username del contexto
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const navigate = useNavigate();

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const handleModifyGroup = () => {
    navigate('/select_grupo');
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
                  <li><a href="#!" onClick={handleModifyGroup}>Modificar Grupo</a></li>
                </ul>
              )}
            </li>
            <li><a href="/perfin">Tareas pendientes</a></li>
            <li><a href="/perfin">Cronograma de actividades</a></li>
            <li><a href="/perfin">Historial de evaluaciones</a></li>
            <li><a href="/perfin">Ver grupo</a></li>
            <li><a href="/perfin">Perfil</a></li>
            <li><a href="/perfin">Darse de baja</a></li>
            <li><a href="/est_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1>Bienvenido, {username}</h1> {/* Mostrar el username */}
        <h3>Esta es la página principal para Estudiante para la materia TIS</h3>
        <p>Selecciona una opción de la barra de navegación.</p>
      </main>
    </div>
  );
}

export default MenuEst;
