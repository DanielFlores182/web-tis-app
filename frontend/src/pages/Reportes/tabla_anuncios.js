import React, { useState, useEffect } from 'react';
import './tabla_anuncios.css'; // Crea un archivo de estilos para los anuncios
import logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';

function ListaAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [filteredAnuncios, setFilteredAnuncios] = useState([]);
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
    // Fetch para obtener la lista de anuncios
    fetch('https://web-tis-app-production.up.railway.app/get_anuncios.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los anuncios');
        }
        return response.json();
      })
      .then((data) => {
        setAnuncios(data);
        setFilteredAnuncios(data); // Establecer los anuncios originales al principio
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredAnuncios(
      anuncios.filter(
        (anuncio) =>
          anuncio.docente_nombre.toLowerCase().includes(term) ||
          anuncio.texto.toLowerCase().includes(term)
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
          <h1 style={{ color: '#CC1616' }}>Lista de Anuncios</h1>
          <button
            className="add-button"
            onClick={() => navigate('/nuevo_anuncio')}
          >
            Añadir Nuevo Anuncio
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar anuncios..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="anuncios-container">
          {filteredAnuncios.map((anuncio) => (
            <div key={anuncio.id} className="anuncio-post">
              <div className="anuncio-header">
                <h5>{anuncio.docente_nombre}</h5>
                <span>{new Date(anuncio.fecha).toLocaleString()}</span>
              </div>
              <p className="anuncio-text">{anuncio.texto}</p>
              <div className="anuncio-footer">
                <span>Grupo: {anuncio.grupo}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}

export default ListaAnuncios;
