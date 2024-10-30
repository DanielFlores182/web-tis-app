import React, { useState } from 'react';
import './planilla.css';

function VerPlanilla() {
    const [filas] = useState([
      { nombres: 'Juan Pérez', tarea1: 'Tarea 1', nota: 'A' },
      { nombres: 'Ana Gómez', tarea1: 'Tarea 2', nota: 'B+' },
      { nombres: 'Luis Fernández', tarea1: 'Tarea 3', nota: 'A-' },
    ]);
  
    return (
      <div className="container">
        <h2 className="titulo">Planilla de tareas individuales</h2>
        <h3 className="subtitulo">Nombre de Equipo</h3>
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Tarea 1</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, index) => (
              <tr key={index}>
                <td>{fila.nombres}</td>
                <td>{fila.tarea1}</td>
                <td>{fila.nota}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn">Descargar</button>
      </div>
    );
  }
  

export default VerPlanilla;