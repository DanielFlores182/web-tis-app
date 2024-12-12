import React, { useState, useEffect } from 'react';
import './tabla_anuncios.css'; // Crea un archivo de estilos para los anuncios
import logo from '../../images/logo.png';

function ListaAnuncios() {
  const [anuncios, setAnuncios] = useState([]);
  const [filteredAnuncios, setFilteredAnuncios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
        setFilteredAnuncios(data);
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
        <h1 className="header-title">Lista de Anuncios</h1>
        <nav>
          <ul>
            <li><a href="/menu_doc">Volver al Menú Principal</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1 style={{ color: '#CC1616' }}>Lista de Anuncios</h1>
        <input
          type="text"
          placeholder="Buscar anuncios..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="anuncios-container">
          {filteredAnuncios.map((anuncio, index) => (
            <div key={index} className="anuncio-post">
              <div className="anuncio-header">
                <h2>{anuncio.docente_nombre}</h2>
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
