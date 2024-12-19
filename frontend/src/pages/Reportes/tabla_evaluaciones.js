import React, { useState, useEffect } from 'react';
import './tabla_evaluaciones.css'; // Crea un archivo CSS para estilos específicos
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png'

function ListaEvaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [filteredEvaluaciones, setFilteredEvaluaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
    const [showRegisterOptions, setShowRegisterOptions] = useState(false);
    const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
    const navigate = useNavigate();
  
    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions);
    };
  
    const toggleCriteriosOptions = () => {
      setShowCriteriosOptions(!showCriteriosOptions);
    };
  
  

  useEffect(() => {
    // Fetch para obtener la lista de evaluaciones
    fetch('https://web-tis-app-production.up.railway.app/get_evaluaciones.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las evaluaciones');
        }
        return response.json();
      })
      .then((data) => {
        setEvaluaciones(data);
        setFilteredEvaluaciones(data); // Inicializar con todos los datos
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEvaluaciones(
      evaluaciones.filter(
        (evaluacion) =>
          evaluacion.tipo_eva.toLowerCase().includes(term) ||
          evaluacion.descripcion_eva.toLowerCase().includes(term)
      )
    );
  };

  return (
    <div className="menu-container">
        <aside className="sidebar">
                <img src={logo} alt="Logo de la Empresa" className="header-logo" />
                <h1 className="header-title">Docente</h1>
                <nav>
                  <ul>
                    <li><a href="/menu_doc">Volver al Menú Principal</a></li>
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
                    <li><a href="/perfil">Ver evaluaciones</a></li>
                    <li><a href="/registro_eva">Programar evaluaciones</a></li>
                    <li><a href="/">Cerrar Sesión</a></li>
                  </ul>
                </nav>
              </aside>
      <main className="content">
        <div className="header-row">
          <h1 style={{ color: '#CC1616' }}>Lista de Evaluaciones</h1>
          <button
            className="add-button"
            onClick={() => navigate('/registro_eva')}
          >
            Programar Nueva Evaluación
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar evaluaciones..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="evaluaciones-container">
          {filteredEvaluaciones.map((evaluacion) => (
            <div key={evaluacion.id} className="evaluacion-post">
              <h5>{evaluacion.tipo_eva}</h5>
              <p>{evaluacion.descripcion_eva}</p>
              <span>
                Fecha Inicio: {new Date(evaluacion.fecha_ini).toLocaleDateString()}
              </span>
              <span>
                Fecha Fin: {new Date(evaluacion.fecha_fin).toLocaleDateString()}
              </span>
              <p>Nota: {evaluacion.nota_eva}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ListaEvaluaciones;
