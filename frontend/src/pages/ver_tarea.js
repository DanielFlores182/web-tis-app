import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ver_tarea.css';

function VerTarea() {
  const { idTarea } = useParams(); // Obtener el id de la tarea desde la URL
  const [tarea, setTarea] = useState({ nombre: '', descripcion: '' });
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [nota, setNota] = useState('');
  const [mostrarComentario, setMostrarComentario] = useState(false);
  const [mostrarNota, setMostrarNota] = useState(false);

  useEffect(() => {
    // Llamar al backend para obtener la tarea por id
    fetch(`http://localhost/backend/obtener_tarea.php?id=${idTarea}`)
      .then(response => response.json())
      .then(data => {
        setTarea({ nombre: data.nombre, descripcion: data.detalle });
        setComentarios(data.comentarios || []); // Obtener comentarios guardados
      })
      .catch(error => console.error('Error al obtener tarea:', error));
  }, [idTarea]);

  const handleAgregarComentario = () => {
    if (comentario.trim()) {
      // Guardar el comentario en el backend
      fetch('http://localhost/backend/guardar_comentario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idTarea, comentario }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setComentarios([...comentarios, comentario]); // Agregar comentario al listado
            setComentario(''); // Limpiar el campo de texto
            setMostrarComentario(false); // Ocultar el input
          }
        })
        .catch(error => console.error('Error al guardar comentario:', error));
    }
  };

  const handleAgregarNota = () => {
    setMostrarNota(true);
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleNotaChange = (event) => {
    setNota(event.target.value);
  };

  return (
    <div className="tarea">
      <h2 className="titulo">{tarea.nombre}</h2>
      <h3 className="subtitulo">Descripción de la tarea</h3>
      <div className="descripcion">
        {tarea.descripcion}
      </div>
      
      <h3 className="subtitulo-adjuntos">Archivos Adjuntos</h3>
      <div className="adjuntos">
        <p>Aquí se mostrarían los archivos subidos por el estudiante.</p>
      </div>

      <h3 className="subtitulo">Comentarios</h3>
      <div className="comentarios">
        {comentarios.length === 0 ? (
          <p>No hay comentarios</p>
        ) : (
          comentarios.map((coment, index) => (
            <p key={index}>{coment}</p>
          ))
        )}
      </div>

      <div className="acciones">
        <button className="btn" onClick={handleAgregarComentario}>
          Agregar Comentario
        </button>
        <button className="btn" onClick={handleAgregarNota}>
          Agregar Nota
        </button>
      </div>

      {mostrarComentario && (
        <div className="comentario-container">
          <textarea
            className="comentario-input"
            rows="3"
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChange={handleComentarioChange}
          />
          <button className="btn" onClick={handleAgregarComentario}>
            Guardar Comentario
          </button>
        </div>
      )}

      {mostrarNota && (
        <div className="nota-container">
          <input
            type="number"
            className="nota-input"
            placeholder="Ingresa la nota"
            value={nota}
            onChange={handleNotaChange}
          />
        </div>
      )}
    </div>
  );
}

export default VerTarea;
