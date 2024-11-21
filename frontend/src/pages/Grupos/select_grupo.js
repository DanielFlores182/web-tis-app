import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './select_grupo.css'; // Asegúrate de tener estilos para el menú y el contenido
import logo from '../../images/logo.png'; // Asegúrate de que la ruta de la imagen sea correcta
import { useUser } from '../../controller/userContex';

function SelectGrupo() {
  const { username } = useUser(); // Obtener el username del contexto
  const [grupo, setGrupo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);
  const [showTaskOptions, setShowTaskOptions] = useState(false); // Estado para las opciones de Tareas

    const toggleRegisterOptions = () => {
      setShowRegisterOptions(!showRegisterOptions); // Cambiar entre mostrar y ocultar
    };
  
    const toggleRegisterPlanningOptions = () => {
        setShowRegisterPlanningOptions(!showRegisterPlanningOptions);
      };
      const toggleTaskOptions = () => {
        setShowTaskOptions(!showTaskOptions);
      };
      const handleModifyGroup = () => {
        navigate('/select_grupo');
      }

  // Obtener el grupo del estudiante
  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const response = await fetch('https://web-tis-app-production.up.railway.app/get_grupo_from_est.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        const data = await response.json();
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setGrupo(data.grupo);
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error en la comunicación con el servidor.');
      }
    };

    if (username) {
      fetchGrupo();
    } else {
      setErrorMessage('Username no proporcionado.');
    }
  }, [username]);

  const handleEditGroup = () => {
    if (grupo) {
      navigate('/editar_est_grupo', { state: { grupo_nombre: grupo } }); // Pasar el nombre del grupo como estado
    } else {
      setErrorMessage('No hay grupo seleccionado.');
    }
  };

  return (
    <div className="menu-container">
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
      <main className="content">

        {errorMessage ? (
          <p className="error-message">{errorMessage}</p>
        ) : grupo ? (
          <div className="message-container">
            <h1>Estás registrado en el grupo: {grupo}</h1>
            <p>¿Deseas editar los estudiantes registrados?</p>
            <button className="btn btn-primary" onClick={handleEditGroup}>
              Aceptar
            </button>
          </div>
        ) : (
          <div className="message-container">
            <h1>No estás registrado en ningún grupo.</h1>
            <p>Registra un nuevo grupo o háblale al líder de un grupo existente para que te añada a su grupo.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default SelectGrupo;

