import React, { useState } from 'react';
import './nuevo_anuncio.css'; // Estilos para esta página
import logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../controller/userContex'; // Ajusta la ruta según tu proyecto

function NuevoAnuncio() {
  const [texto, setTexto] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { username } = useUser(); // Obtén el usuario actual desde el contexto
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showCriteriosOptions, setShowCriteriosOptions] = useState(false);

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleCriteriosOptions = () => {
    setShowCriteriosOptions(!showCriteriosOptions);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validar que el texto no esté vacío
    if (!texto) {
      setError('El texto del anuncio es obligatorio.');
      return;
    }

    // Validar que el usuario esté disponible en el contexto
    if (!username) {
      setError('Usuario no identificado. Por favor, inicia sesión.');
      return;
    }
     const jsonprueba = JSON.stringify({ texto, id_docente: username });
     console.log(jsonprueba);
    // Enviar los datos al backend con el formato solicitado
    fetch('https://web-tis-app-production.up.railway.app/add_anuncio.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto, id_docente: username }), // Formato JSON requerido
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al agregar el anuncio');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setSuccess(true);
          setTexto('');
          setTimeout(() => navigate('/tabla_anuncios'), 2000); // Redirige tras 2 segundos
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      })
      .catch((err) => {
        setError(err.message);
      });
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
        <h1 style={{ color: '#CC1616' }}>Nuevo Anuncio</h1>
        <form className="anuncio-form" onSubmit={handleSubmit}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu anuncio aquí..."
            className="anuncio-textarea"
          ></textarea>
          <button type="submit" className="submit-button">
            Publicar Anuncio
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Anuncio agregado exitosamente. Redirigiendo...</p>}
      </main>
    </div>
  );
}

export default NuevoAnuncio;
