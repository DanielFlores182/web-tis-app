import React, { useState } from 'react';
import './planilla.css';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

function VerPlanilla() {
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);
  const [showTaskOptions, setShowTaskOptions] = useState(false); // Estado para las opciones de Tareas
  const navigate = useNavigate();

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleRegisterPlanningOptions = () => {
    setShowRegisterPlanningOptions(!showRegisterPlanningOptions);
  };

  const toggleTaskOptions = () => {
    setShowTaskOptions(!showTaskOptions);
  };

  const handleModifyGroup = () => {
    navigate('/select_grupo');
  };
    const [filas] = useState([
      { nombres: 'Juan Pérez', tarea1: 'Tarea 1', nota: 'A' },
      { nombres: 'Ana Gómez', tarea1: 'Tarea 2', nota: 'B+' },
      { nombres: 'Luis Fernández', tarea1: 'Tarea 3', nota: 'A-' },
    ]);
  
    return (
      <div className="container">
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
            <li>
              <a href="#!" onClick={toggleTaskOptions}>Tareas</a> {/* Modificado a "Tareas" */}
              {showTaskOptions && (
                <ul className="submenu">
                  <li><a href="/planilla">Planilla de tareas</a></li>
                  <li><a href="/ver_perfil_tareas">Tareas publicadas</a></li>
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
            <li><a href="/evaluacion_semanal/actas_semanales">Actas Semanales</a></li>
            <li><a href="/">Cerrar Sesión</a></li>
          </ul>
        </nav>
      </aside>
        <h2 className="titulo">Planilla de tareas individuales</h2>
        <h3 className="subtitulo">Nombre de Equipo</h3>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Tarea 1</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, index) => (
              <tr key={index}>
                <td>{fila.nombres}</td>
                <td>{fila.tarea1}</td>
                <td>{fila.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn">Descargar</button>
      </div>
    );
  }
  

export default VerPlanilla;