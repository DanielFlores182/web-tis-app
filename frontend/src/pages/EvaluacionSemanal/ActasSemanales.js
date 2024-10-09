import React, { useState } from 'react';
import './ActasSemanales.css'; // Importando el CSS separado

export default function ActaReunion() {
  const [comments, setComments] = useState('');
  const [approved, setApproved] = useState(null);

  const handleGoBack = () => {
    window.history.back(); // Navega a la página anterior
  };

  const attendees = [
    { id: 1, name: 'Asllani Martinez Alvaro (asistió)' },
    { id: 2, name: 'Auca Chambi Juan Pablo (asistió)' },
    { id: 3, name: 'Cabrera Bernal Giselle Lorena (asistió)' },
    { id: 4, name: 'Flores Olmos Daniel Marcelo (asistió)' },
    { id: 5, name: 'Pardo Zambrana Claudia Andrea (asistió)' },
    { id: 6, name: 'Rojas Calle Paola Andrea (asistió)' },
  ];

  const topics = [
    {
      id: 1,
      title: 'Identificación de requerimientos funcionales',
      content: 'Pudimos identificar del pliego cuantos RF habrá para el sistema y cuantos RNF se establecerá para este',
    },
    {
      id: 2,
      title:
        'Asignamos a cada uno de los integrantes del grupo una cierta cantidad de requerimientos para que identifiquen historias de usuario.',
      content:
        'Historias entregadas:\n\n(Daniel Marcelo Flores Olmos)\nRegistrar los resultados de las evaluaciones semanales (estudiantes)\n- Registrar resultados\n- Editar datos de resultado\n- Visualizar datos del resultado\n- Eliminar datos del resultado\nOtorgar permisos a los responsables de realizar una evaluación (docentes)\n- Visualizar usuarios que cumplan los criterios (reporte)\n- Validar permisos a usuarios\n- Quitar permisos a usuarios\nIniciar sesión\n-Inicio de sesión de usuarios\n\n(Juan Pablo Auca Chambi)\nGenerar reportes varios\n-Generar Reporte evaluación\n-Generar Reporte de miembros de grupo',
    },
  ];

  return (
    <div className="acta-container">
      <header className="acta-header">
        <h1>Actas de reuniones de equipo de desarrollo</h1>
        <div className="acta-header-info">
          <span>#1</span>
          <span>02-09-2024</span>
        </div>
      </header>

      <section className="acta-section">
        <h2>Asistentes:</h2>
        <table className="acta-table">
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id}>
                <td>{attendee.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="acta-section">
        <h2>Registro:</h2>
        <p>Se dio inicio de la reunión a las 7:00pm</p>
      </section>

      <section className="acta-section">
        <h2>Temas tratados:</h2>
        {topics.map((topic) => (
          <div key={topic.id} className="acta-topic">
            <h3>{topic.id}. {topic.title}</h3>
            <p className="acta-content">{topic.content}</p>
          </div>
        ))}
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
          <button
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
          </button>
        </div>
        <button className="acta-save-button">Guardar Acta</button>
      </div>

      {/* Botón de "Volver" */}
      <div className="acta-back">
        <button className="acta-back-button" onClick={handleGoBack}>Volver</button>
      </div>
    </div>
  );
}
