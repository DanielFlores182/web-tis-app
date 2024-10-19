import React, { useState } from 'react';
import './ver_perfil.css'; // Importamos el archivo CSS

function VerPerfil() {
    const [tareas, setTareas] = useState([
      { nombre: 'Tarea 1', estado: 'Entregado' },
      { nombre: 'Tarea 2', estado: 'Sin entregar' },
    ]);
  
    const handleVerTarea = (tarea) => {
      console.log(`Ver tarea: ${tarea.nombre}`);
      // Aquí puedes agregar la lógica para mostrar detalles de la tarea
    };
  
    const handleAgregarTarea = () => {
      // Lógica para agregar una nueva tarea
      setTareas([...tareas, { nombre: '', estado: '' }]);
    };
  
    return (
      <div className="perfil-container">
        <h2 className="titulo">Nombre del Estudiante</h2>
        <div className="tareas-container">
          <h3 className="subtitulo">Tareas Asignadas Individuales</h3>
          {tareas.map((tarea, index) => (
            <div key={index} className="tarea">
              <span>{tarea.nombre}:</span>
              <span className={tarea.estado === 'Entregado' ? 'entregado' : 'sin-entregar'}>
                {tarea.estado}
              </span>
              <button className="btn-ver" onClick={() => handleVerTarea(tarea)}>
                Ver
              </button>
            </div>
          ))}
        </div>
        <div className="botones">
          <button className="btn" onClick={handleAgregarTarea}>
            Agregar Tarea
          </button>
          <button className="btn">Ver Planilla</button>
        </div>
      </div>
    );
  }

export default VerPerfil;