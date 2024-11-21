import React, { useState } from 'react';
import './ver_perfil.css'; // Importamos el archivo CSS
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

function VerPerfil() {
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
    const [tareas, setTareas] = useState([
      { nombre: 'Tarea 1', estado: 'Entregado' },
      { nombre: 'Tarea 2', estado: 'Sin entregar' },
    ]);
  
    const handleVerTarea = (tarea) => {
      console.log(`Ver tarea: ${tarea.nombre}`);
      // Aquí puedes agregar la lógica para mostrar detalles de la tarea
    };
  
    const handleAgregarTarea = () => {
      // Lógica para agregar una nueva tarea
      setTareas([...tareas, { nombre: '', estado: '' }]);
    };
  
    return (
      <div className="perfil-container">
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
        <h2 className="titulo">Nombre del Estudiante</h2>
        <div className="tareas-container">
          <h3 className="subtitulo">Tareas Asignadas Individuales</h3>
          {tareas.map((tarea, index) => (
            <div key={index} className="tarea">
              <span>{tarea.nombre}:</span>
              <span className={tarea.estado === 'Entregado' ? 'entregado' : 'sin-entregar'}>
                {tarea.estado}
              </span>
              <button className="btn-ver" onClick={() => handleVerTarea(tarea)}>
                Ver
              </button>
            </div>
          ))}
        </div>
        <div className="botones">
          <button className="btn" onClick={handleAgregarTarea}>
            Agregar Tarea
          </button>
          <button className="btn">Ver Planilla</button>
        </div>
      </div>
    );
  }

export default VerPerfil;