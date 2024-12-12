import React, { useState, useEffect } from 'react';
import './Lista_estudiantes.css'; // Reutilizamos los estilos de Menu_doc
import logo from '../../images/logo.png';

function ListaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch para obtener la lista de estudiantes
    fetch('https://web-tis-app-production.up.railway.app/get_all_estudiantes.php')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then((data) => {
        setEstudiantes(data);
        setFilteredEstudiantes(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEstudiantes(
      estudiantes.filter(
        (estudiante) =>
          estudiante.nombres.toLowerCase().includes(term) ||
          estudiante.apellidos.toLowerCase().includes(term) ||
          estudiante.correo.toLowerCase().includes(term) ||
          estudiante.carrera.toLowerCase().includes(term) ||
          estudiante.cod_sis.toString().includes(term)
      )
    );
  };

  return (
    <div className="menu-container">
      <aside className="sidebar">
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
        <h1 className="header-title">Lista de Estudiantes</h1>
        <nav>
          <ul>
            <li><a href="/menu_doc">Volver al Menú Principal</a></li>
          </ul>
        </nav>
      </aside>
      <main className="content">
        <h1 style={{ color: '#CC1616' }}>Lista de Estudiantes</h1>
        <input
          type="text"
          placeholder="Buscar estudiantes..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Carrera</th>
              <th>Cod SIS</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudiantes.map((estudiante, index) => (
              <tr key={index}>
                <td>{estudiante.id}</td>
                <td>{estudiante.nombres}</td>
                <td>{estudiante.apellidos}</td>
                <td>{estudiante.correo}</td>
                <td>{estudiante.carrera}</td>
                <td>{estudiante.cod_sis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
