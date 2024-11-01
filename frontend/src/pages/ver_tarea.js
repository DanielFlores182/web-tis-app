import React from 'react';
import './ver_tarea.css'; // Importa tu archivo de estilos CSS

function VerTarea({ nombreTarea, descripcionTarea }) {
    return (
        <div className="tarea">
          <h1 className="titulo">Tarea 1</h1>
          <h2 className="subtitulo">Descripción de la tarea</h2>
          <p className="descripcion">Aquí viene la descripción de la tarea.</p>
          <div className="adjuntos">
            <h3 className="subtitulo-adjuntos">Archivos adjuntos</h3>
            <img src="/ruta/a/tu/icono.svg" alt="Archivos adjuntos" />
          </div>
          <div className="acciones">
            <button className="btn agregar-comentario">Agregar Comentario</button>
            <button className="btn agregar-nota">Agregar Nota</button>
          </div>
        </div>
      );
}
export default VerTarea;
