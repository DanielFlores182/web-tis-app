import React from "react";
import { useNavigate } from 'react-router-dom';
import './EvaluacionSemanal.css';
//import logo from '../images/logo.png';

const Evaluaciones = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (teamName) => {
    // Redirigir a la página de ActasSemanales
    navigate(`/evaluacion_semanal/actas_semanales?team=${teamName}`);
  };

  return (
    <div className="menu-container">
      {/* Menú lateral */}
      <aside className="sidebar">
       {/* <img src={logo} alt="Logo" className="header-logo" /> */}
        <h1 className="header-title">Estudiante</h1>
        <nav>
          <ul>
            <li><a href="/registrar_grupo">Registrar Grupo</a></li>
            <li><a href="/tareas_pendientes">Tareas pendientes</a></li>
            <li><a href="/cronograma_actividades">Cronograma de actividades</a></li>
            <li><a href="/historial_evaluaciones">Historial de evaluaciones</a></li>
            <li><a href="/ver_grupo">Ver grupo</a></li>
            <li><a href="/perfil">Perfil</a></li>
            <li><a href="/darse_de_baja">Darse de baja</a></li>
            <li><a href="/configuraciones">Configuraciones</a></li>
            <li><a href="/evaluacion_semanal">Evaluación Semanal</a></li>
            <li><a href="/">Cerrar Sesión</a></li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="content">
        <header>
          <h1>Evaluaciones Semanales de Equipos</h1>
          <p>domingo, 6 de octubre de 2024</p>
        </header>

        <nav className="tabs">
          <button className="tab active">Lista de Equipos</button>
          <button className="tab">Planillas Anteriores</button>
        </nav>

        <section className="team-list">
          <div className="search-bar">
            <input type="text" placeholder="Buscar equipo..." />
            <select>
              <option>Seleccionar semana</option>
            </select>
            <button className="btn-search">Buscar</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nombre del Equipo</th>
                <th>Estado de Evaluación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Equipo Alpha</td>
                <td><span className="status pending">Pendiente</span></td>
                <td>
                  <button 
                    className="btn-register" 
                    onClick={() => handleRegisterClick('Equipo Alpha')}
                  >
                    Registrar Evaluación
                  </button>
                </td>
              </tr>
              <tr>
                <td>Equipo Beta</td>
                <td><span className="status completed">Completado</span></td>
                <td>
                  <button 
                    className="btn-register" 
                    onClick={() => handleRegisterClick('Equipo Beta')}
                  >
                    Registrar Evaluación
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Evaluaciones;
