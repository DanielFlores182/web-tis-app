import React, { useState } from 'react';
import './ActasSemanales.css';

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
  const [topics, setTopics] = useState([
    { id: 1, title: '', content: '' },
  ]);
  const [comments, setComments] = useState('');
  //const [approved, setApproved] = useState(null);

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

  const handleSave = async () => {
    const acta = {
      meetingNumber,
      meetingDate,
      startTime,
      attendees,
      topics,
      comments,
      //approved,
    };
  
    try {
      const response = await fetch('http://web-tis-app-production.up.railway.app/add_acta_semanal.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acta),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert('Acta guardada exitosamente en la base de datos!');
      } else {
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
      <header className="acta-header">
  <h1>Actas de reuniones de equipo de desarrollo</h1>
  <div className="acta-header-info">
    <div className="acta-info-group">
      <label htmlFor="meetingNumber">Número de acta:</label>
      <input
        id="meetingNumber"
        type="text"
        value={meetingNumber}
        onChange={(e) => setMeetingNumber(e.target.value)}
        placeholder="Número de acta"
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
  </div>
</header>
      <section className="acta-section">
  <h2>Asistentes:</h2>
  <div className="attendee-grid">
    {attendees.map((attendee) => (
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
  </div>
</section>
      <section className="acta-section">
        <h2>Registro:</h2>
        <p>
          Se dio inicio de la reunión a las{' '}
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="acta-input"
          />
        </p>
      </section>

      <section className="acta-section">
        <h2>Temas tratados:</h2>
        {topics.map((topic) => (
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
              rows={4}
            />
          </div>
        ))}
        <button onClick={addTopic} className="acta-add-button">Añadir Tema</button>
      </section>

      <section className="acta-section">
        <h2>Comentarios:</h2>
        <textarea
          className="acta-textarea"
          placeholder="Añadir comentarios..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
        />
      </section>

      <div className="acta-footer">
        <div>
          {/* <button
            className={`acta-button approve-default ${approved === true ? 'approved' : ''}`}
            onClick={() => setApproved(true)}
          >
            Aprobado
          </button>
          <button
            className={`acta-button reject-default ${approved === false ? 'rejected' : ''}`}
            onClick={() => setApproved(false)}
          >
            Reprobado
          </button> */}
        </div>
        <button className="acta-save-button" onClick={handleSave}>Guardar Acta</button>
      </div>

      <div className="acta-back">
        <button className="acta-back-button" onClick={handleGoBack}>Volver</button>
      </div>
    </div>
  );
}
