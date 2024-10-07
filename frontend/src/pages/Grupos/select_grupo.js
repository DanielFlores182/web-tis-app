import React, { useEffect, useState } from 'react';
import './select_grupo.css';
import logo from '../../images/logo.png'; // Asegúrate de que la ruta sea correcta
import { useLocation } from 'react-router-dom';

function SelectGrupo() {
  const location = useLocation();
  //const { username } = location.state || {}; // Obtener el username desde el estado
  const username = localStorage.getItem('username'); 
  const [grupo, setGrupo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Verificar si el username está registrado y obtener el grupo
    const fetchGrupo = async () => {
      try {
        const response = await fetch('http://localhost:8081/web-tis-app/backend/get_grupo_from_est.php', {
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
        <h1>Seleccionar Grupo</h1>
        
        {grupo ? (
          <h2>Tu grupo es: {grupo}</h2>
        ) : (
          <p>Cargando grupo...</p>
        )}
      </main>
    </div>
  );
}

export default SelectGrupo;
