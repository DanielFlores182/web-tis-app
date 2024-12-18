import React, { useState, useEffect } from 'react';
import './Lista_estudiantes.css'; // Reutilizamos los estilos de Menu_doc
import logo from '../../images/logo.png';
import { useUser } from '../../controller/userContex'; // Ajusta la ruta según tu proyecto

function ListaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [docenteEstudiantes, setDocenteEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
  const { username } = useUser(); // Obtén el usuario actual desde el contexto

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };
  if (!username) {
    console.log('Usuario no identificado. Por favor, inicia sesión.');
  }
  useEffect(() => {
   
    // Obtener estudiantes específicos para el docente
    fetch('https://web-tis-app-production.up.railway.app/get_est_by_doc.php?username=username')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los estudiantes del docente');
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          console.error('Error:', data.error);
          setDocenteEstudiantes([]);
        } else {
          setDocenteEstudiantes(data); // Guardar estudiantes de este docente
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Fetch para obtener la lista de todos los estudiantes
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
          estudiante.correo.toLowerCase().includes(term)
      )
    );
  };

  const careerMapping = {
    1: "Informática",
    2: "Sistemas",
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
        <h1 style={{ color: '#CC1616' }}>Estudiantes del Docente</h1>
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Carrera</th>
              <th>Cod SIS</th>
              <th>Grupo</th>
            </tr>
          </thead>
          <tbody>
            {docenteEstudiantes.map((estudiante, index) => (
              <tr key={index}>
                <td>{estudiante.id}</td>
                <td>{estudiante.nombre_estudiante}</td>
                <td>{estudiante.apellido_estudiante}</td>
                <td>{estudiante.correo_estudiante}</td>
                <td>{careerMapping[estudiante.carrera] || "desconocido"}</td>
                <td>{estudiante.cod_sis}</td>
                <td>{estudiante.grupo_nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>

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
              <th>Grupo</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstudiantes.map((estudiante, index) => (
              <tr key={index}>
                <td>{estudiante.id}</td>
                <td>{estudiante.nombres}</td>
                <td>{estudiante.apellidos}</td>
                <td>{estudiante.correo}</td>
                <td>{careerMapping[estudiante.carrera] || "desconocido"}</td>
                <td>{estudiante.cod_sis}</td>
                <td>{estudiante.grupo_materia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
