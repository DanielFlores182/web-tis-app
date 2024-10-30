import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ver_tarea.css';

function VerTarea() {
  const { idTarea } = useParams();
  const [tarea, setTarea] = useState({
    descripcion: '',
    entregado: false,
    archivo: null,
  });

  useEffect(() => {
    fetch(`http://localhost:8081/web-tis-app/backend/obtener_tarea.php?id=${idTarea}`)
      .then(response => response.json())
      .then(data => {
        setTarea({
          descripcion: data.detalle,
          entregado: data.entregado,
          archivo: data.archivo // Se asume que el archivo está en formato base64
        });
      })
      .catch(error => console.error('Error al obtener tarea:', error));
  }, [idTarea]);

  return (
    <div className="tarea">
      <h2 className="titulo">{tarea.entregado ? "Entregado" : "Sin entregar"}
      </h2>
        <div className="subtitulo-container">
         <h3 className="subtitulo">{tarea.descripcion}</h3>
        </div>
      <h3 className="subtitulo-adjuntos">Archivos Adjuntos</h3>
      <div className="adjuntos">
        {tarea.archivo ? (
          <a href={`data:application/octet-stream;base64,${tarea.archivo}`} download="archivo_tarea">
            Descargar archivo
          </a>
        ) : (
          <p>No hay archivos adjuntos</p>
        )}
      </div>
    </div>
  );
}

export default VerTarea;
