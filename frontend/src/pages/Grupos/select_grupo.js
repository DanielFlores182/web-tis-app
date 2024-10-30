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

  // Obtener el grupo del estudiante
  useEffect(() => {
    const fetchGrupo = async () => {
      try {
        const response = await fetch('http://web-tis-app-production.up.railway.app/get_grupo_from_est.php', {
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
        <img src={logo} alt="Logo de la Empresa" className="header-logo" />
        <h1 className="header-title">Estudiante</h1>
        <nav>
          <ul>
            <li>
              <a href="#!">Registrar Grupo</a>
              <ul className="submenu">
                <li><a href="/registrar_grupo">Nuevo Grupo</a></li>
                <li><a href="/select_grupo">Modificar Grupo</a></li>
              </ul>
            </li>
            <li><a href="/perfin">Tareas pendientes</a></li>
            <li><a href="/perfin">Cronograma de actividades</a></li>
            <li><a href="/perfin">Historial de evaluaciones</a></li>
            <li><a href="/perfin">Ver grupo</a></li>
            <li><a href="/perfin">Perfil</a></li>

            <li><a href="/perfin">Darse de baja</a></li>
            <li><a href="/est_config">Configuraciones</a></li>
            <li><a href="/">Cerrar Sesion</a></li>
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

