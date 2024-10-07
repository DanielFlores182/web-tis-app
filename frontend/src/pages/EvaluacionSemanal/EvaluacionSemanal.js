import React from "react";
import { useNavigate } from 'react-router-dom';
import './EvaluacionSemanal.css';

const Evaluaciones = () => {
  const navigate = useNavigate();

  const handleRegisterClick = (teamName) => {
    // Redirigir a la página de ActasSemanales
    navigate(`/evaluacion_semanal/actas_semanales?team=${teamName}`);
  };

  return (
    <div className="evaluaciones-container">
      <header>
        <h1>Evaluaciones Semanales de Equipos</h1>
        <p>domingo, 6 de octubre de 2024</p>
        <div className="user-info">
          <span>Usuario: Juan Pérez</span>
          <button className="btn-new-evaluation">+ Registrar nueva evaluación semanal</button>
        </div>
      </header>

      <nav className="tabs">
        <button className="tab active">Lista de Equipos</button>
        <button className="tab">Registro de Evaluación</button>
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
            {/* Añadir más equipos aquí si es necesario */}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Evaluaciones;
