import React, { useState, useEffect } from 'react';
import './ActasSemanales.css';
import logo from '../../images/logo.png';
import { useNavigate } from 'react-router-dom';
//import { useUser } from '../../controller/userContex.js'; // Importar el contexto

export default function App() {
  const [meetingNumber, setMeetingNumber] = useState('1');
  const [meetingDate, setMeetingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'Asllani Martinez Alvaro', attended: false },
    { id: 2, name: 'Auca Chambi Juan Pablo', attended: false },
    { id: 3, name: 'Cabrera Bernal Giselle Lorena', attended: false },
    { id: 4, name: 'Flores Olmos Daniel Marcelo', attended: false },
    { id: 5, name: 'Pardo Zambrana Claudia Andrea', attended: false },
    { id: 6, name: 'Rojas Calle Paola Andrea', attended: false },
  ]);
  const [topics, setTopics] = useState([{ id: 1, title: '', content: '' }]);
  const [comments, setComments] = useState('');
  //const { username } = useUser(); // Extraer username del contexto
  const [showRegisterOptions, setShowRegisterOptions] = useState(false);
  const [showRegisterPlanningOptions, setShowRegisterPlanningOptions] = useState(false);
  const [showTaskOptions, setShowTaskOptions] = useState(false); // Estado para las opciones de Tareas
  const navigate = useNavigate();

  const toggleRegisterOptions = () => {
    setShowRegisterOptions(!showRegisterOptions);
  };

  const toggleRegisterPlanningOptions = () => {
    setShowRegisterPlanningOptions(!showRegisterPlanningOptions);
  };

  const toggleTaskOptions = () => {
    setShowTaskOptions(!showTaskOptions);
  };

  const handleModifyGroup = () => {
    navigate('/select_grupo');
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setMeetingDate(today);
  }, []);

  const handleAttendeeChange = (id) => {
    setAttendees(attendees.map(attendee =>
      attendee.id === id ? { ...attendee, attended: !attendee.attended } : attendee
    ));
  };

  const handleTopicChange = (id, field, value) => {
    setTopics(topics.map(topic =>
      topic.id === id ? { ...topic, [field]: value } : topic
    ));
  };

  const addTopic = () => {
    setTopics([...topics, { id: topics.length + 1, title: '', content: '' }]);
  };

  const deleteTopic = (id) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const handleSave = async () => {
    const acta = {
      meetingNumber,
      meetingDate,
      startTime,
      attendees,
      topics,
      comments,
    };

    try {
      const response = await fetch('https://web-tis-app-production.up.railway.app/add_acta_semanal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acta),
      });

      if (response.ok) {
        alert('Acta guardada exitosamente en la base de datos!');
      } else {
        const result = await response.json();
        alert(`Error al guardar: ${result.message}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Hubo un error al enviar los datos.');
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="acta-container">
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
      <main className="acta-content">
        <header className="acta-header">
          <h1>Actas de reuniones de equipo de desarrollo</h1>
        </header>
        <form className="acta-form">
          <div className="acta-info-group">
            <label htmlFor="meetingNumber">Número de acta:</label>
            <input
              id="meetingNumber"
              type="text"
              value={meetingNumber}
              onChange={(e) => setMeetingNumber(e.target.value)}
              className="acta-input"
            />
          </div>
          <div className="acta-info-group">
            <label htmlFor="meetingDate">Fecha de acta:</label>
            <input
              id="meetingDate"
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="acta-input"
            />
          </div>
          <section className="acta-section">
            <h2>Asistentes:</h2>
            {attendees.map(attendee => (
              <div key={attendee.id} className="attendee-cell">
                <label>
                  <input
                    type="checkbox"
                    checked={attendee.attended}
                    onChange={() => handleAttendeeChange(attendee.id)}
                  />
                  {attendee.name}
                </label>
              </div>
            ))}
          </section>
          <section className="acta-section">
            <h2>Registro:</h2>
            <label>
              Hora de inicio:
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="acta-input"
              />
            </label>
          </section>
          <section className="acta-section">
            <h2>Temas tratados:</h2>
            {topics.map(topic => (
              <div key={topic.id} className="acta-topic">
                <input
                  type="text"
                  value={topic.title}
                  onChange={(e) => handleTopicChange(topic.id, 'title', e.target.value)}
                  placeholder="Título del tema"
                  className="acta-input"
                />
                <textarea
                  value={topic.content}
                  onChange={(e) => handleTopicChange(topic.id, 'content', e.target.value)}
                  placeholder="Contenido del tema"
                  className="acta-textarea"
                  rows={3}
                />
                {topics.length > 1 && (
                  <button type="button" onClick={() => deleteTopic(topic.id)} className="acta-delete-button">
                    Eliminar Tema
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addTopic} className="acta-add-button">Añadir Tema</button>
          </section>
          <section className="acta-section">
            <h2>Comentarios:</h2>
            <textarea
              className="acta-textarea"
              placeholder="Añadir comentarios..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </section>
          <div className="acta-footer">
            <button type="button" onClick={handleSave} className="acta-save-button">Guardar Acta</button>
            <button type="button" onClick={handleGoBack} className="acta-back-button">Volver</button>
          </div>
        </form>
      </main>
    </div>
  );
}
