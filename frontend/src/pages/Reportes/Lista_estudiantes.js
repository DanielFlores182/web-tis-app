import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx'; // Importa XLSX para crear los archivos Excel
import './Lista_estudiantes.css';
import logo from '../../images/logo.png';
import { useUser } from '../../controller/userContex';

function ListaEstudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [docenteEstudiantes, setDocenteEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);
  const { username } = useUser();
  //const username ='corinaflores_doc';
  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };

  useEffect(() => {
    if (!username) {
      console.log('Usuario no identificado. Por favor, inicia sesión.');
      return;
    }

    fetch(`https://web-tis-app-production.up.railway.app/get_est_by_doc.php?username=${username}`)
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
          setDocenteEstudiantes(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });

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
  }, [username]);

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

  const downloadExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
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
        <button
          onClick={() => downloadExcel(docenteEstudiantes, 'Estudiantes_Docente')}
          className="download-button"
        >
          Descargar en Excel
        </button>

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
        <button
          onClick={() => downloadExcel(filteredEstudiantes, 'Lista_Estudiantes')}
          className="download-button"
        >
          Descargar en Excel
        </button>
      </main>
    </div>
  );
}

export default ListaEstudiantes;
